from datetime import datetime
import json
import os

import requests
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt

from .models import Holder, MolliePayments, Personel, WalletUpgrades
from core.settings import mollie_client

# Create your views here.


def safe_json_decode(
    response,
):
    if response.status_code == 500:
        raise Exception("500")
    # elif response.status_code == 400:
    #     raise Exception("400")
    # elif response.status_code == 401:
    #     raise Exception("401")
    else:
        try:
            return (response, response.json())
        except json.decoder.JSONDecodeError:
            raise Exception("500", "Ledenbase response not readable or empty")


@login_required(login_url="login")
def showUsers(request):
    users = Holder.objects.all()
    return render(request)


def loginAllUsers(request, username=None, password=None, api=False) -> tuple[User, int]:
    """this function will loging and update all users, it will return the user and the status code
    it will first try to authenticate the user with the django auth system,
    if that fails it will try to authenticate with the ledenbase api
    if the user is not found it will return a 404"""
    user = authenticate(request, username=username, password=password)
    if user is not None:
        return user, 200
    else:
        LEDENBASE_TOKEN = os.environ.get("LEDENBASE_TOKEN")
        LEDENBASE_URL = os.environ.get("LEDENBASE_URL")
        login_res = requests.post(
            f"{LEDENBASE_URL}/login/",
            headers={"Content-Type": "application/json", "Accept": "application/json", "Authorization": LEDENBASE_TOKEN},
            json={"password": password, "username": username},
        )
        lid_token = login_res.text
        if login_res.status_code != 200:
            if not api:
                try:
                    messages.error(request, "Error 4032:" + json.loads(lid_token).get("non_field_errors")[0])
                except:
                    messages.error(request, "Error 4041: No response from Ledenbase")
                return None, login_res.status_code
            else:
                # return ledenbase response and status code
                return json.loads(login_res.text), login_res.status_code

        if login_res.status_code == 200:
            person_res = requests.get(
                f"{LEDENBASE_URL}/personen/{json.loads(lid_token).get('token')}/",
                headers={"Content-Type": "application/json", "Accept": "application/json", "Authorization": LEDENBASE_TOKEN},
            )
            ledenbase_lid: dict = json.loads(person_res.text)
            (user, created,) = User.objects.get_or_create(
                username=username,
                # user purposely doesnt have a password set here to make sure it
            )
            user.first_name = ledenbase_lid.get("voornaam")
            user.last_name = ledenbase_lid.get("tussenvoegsel") + ledenbase_lid.get("achternaam")
            user.is_superuser = ledenbase_lid.get("is_administrator")
            if not user.is_staff and ledenbase_lid.get("is_administrator"):
                user.is_staff = True

            user.save()
            (holder, created) = Holder.objects.get_or_create(user=user)
            holder.ledenbase_id = ledenbase_lid.get("id")
            holder.image_ledenbase = ledenbase_lid.get("foto")
            holder.save()
            if created and not api:
                messages.info(request, "User and Holder were created")
            return user, login_res.status_code
    return user, 404128


def loginUser(request):
    if request.user.is_authenticated:
        return redirect("userHome")
    if request.method == "POST":
        user, status = loginAllUsers(
            request,
            password=request.POST["password"],
            username=request.POST["username"],
        )
        if status == 200:
            login(
                request,
                user,
            )
            messages.info(request, "User was logged in")
            return redirect(request.GET["next"] if "next" in request.GET else "userHome")
        else:
            messages.error(request, "Username or password is incorrect")

    return render(request, "users/login.html")


def logoutUser(request):
    logout(request)
    messages.info(request, "User logged out")
    return redirect("login")


@login_required(login_url="login")
def app(request):
    return render(request, "users/app.html")


@login_required(login_url="login")
def mollieReturn(request, *args, **kwargs):
    molliePayment = MolliePayments.objects.get(identifier=kwargs["identifier"])
    payment = mollie_client.payments.get(molliePayment.payment_id)
    if payment.status == "paid":
        messages.info(
            request,
            f"Betaling is gelukt, je hebt nu {payment.amount['value']} {payment.amount['currency']} op je account",
        )
        molliePayment.is_paid = True
        molliePayment.payed_on = datetime.now()
        molliePayment.save()
        WalletUpgrades.objects.create(
            holder=molliePayment.holder,
            amount=float(molliePayment.amount),
            comment=f"Upgrade via mollie payment {molliePayment.payment_id}",
            seller=Personel.objects.get(id=2),
            molliePayment=molliePayment,
        )
    else:
        messages.error(
            request,
            "Payment was not succesful",
        )
    return redirect("userHome")


@login_required(login_url="login")
@csrf_exempt
def mollieWebhook(request, *args, **kwargs):
    molliePayment = MolliePayments.objects.get(identifier=kwargs["identifier"])
    payment = mollie_client.payments.get(molliePayment.payment_id)
    if payment.status == "paid":
        molliePayment.is_paid = True
        molliePayment.payed_on = datetime.now()
        molliePayment.save()
        WalletUpgrades.objects.create(
            holder=molliePayment.holder,
            amount=float(molliePayment.amount),
            comment=f"Upgrade via mollie payment {molliePayment.payment_id}",
            seller=Personel.objects.get(id=2),
            molliePayment=molliePayment,
        )
    else:
        messages.error(request, "Payment was not succesful")
    return redirect("userHome")
