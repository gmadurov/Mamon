from datetime import datetime
import json
import os
import pprint

import requests
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render

from django.urls import reverse
from purchase.utils import paginateObjects
from .forms import MolliePaymentsForm

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
            return (
                response,
                response.json(),
            )
        except json.decoder.JSONDecodeError:
            raise Exception(
                "500",
                "Ledenbase response not readable or empty",
            )


@login_required(login_url="login")
def showUsers(request):
    users = Holder.objects.all()
    return render(request)


@login_required(login_url="login")
def home(request):
    user = Holder.objects.get(user=request.user)
    purchases = user.purchases.all()
    custom_range, purchases = paginateObjects(request, list(purchases), 10, "purchase_page")

    content = {
        "user": user,
        "purchases": purchases,
        "custom_range": custom_range,
    }
    return render(
        request,
        "users/home.html",
        content,
    )


def loginLedenbase(request):
    (res, ledenbaseUser,) = safe_json_decode(
        requests.post(
            os.environ.get("BACKEND_URL") + "/v2/login/",
            json={
                "password": request.POST["password"],
                "username": request.POST["username"],
            },
        )
    )
    if res.status_code != 200:
        try:

            messages.error(
                request,
                ledenbaseUser["non_field_errors"],
            )
        except:
            messages.error(
                request,
                "I have no clue what is happening",
            )
        return None

    (user, created,) = User.objects.get_or_create(
        username=request.POST["username"],
        first_name=ledenbaseUser["user"]["first_name"],
        last_name=ledenbaseUser["user"]["last_name"],
        # user purposely doesnt have a password set here to make sure it
    )
    (holder, created,) = Holder.objects.get_or_create(
        user=user,
    )
    holder.ledenbase_id = ledenbaseUser["user"]["id"]
    holder.image_ledenbase = os.environ.get("BACKEND_URL") + ledenbaseUser["user"]["photo_url"]
    holder.save()
    return user


def loginUser(request):
    if request.user.is_authenticated:
        return redirect("userHome")
    if request.method == "POST":
        user1 = User.objects.filter(username=request.POST["username"])
        if user1.exists() and user1.filter(holder__ledenbase_id=0).exists():
            # print("user exists and doesnt have ledenbase id")
            user = authenticate(
                password=request.POST["password"],
                username=request.POST["username"],
            )
        else:
            user = loginLedenbase(request)
        if user:
            login(
                request,
                user,
            )
            messages.info(
                request,
                "User was logged in",
            )
            return redirect(request.GET["next"] if "next" in request.GET else "userHome")
        else:
            messages.error(
                request,
                "Username or password is incorrect",
            )

    return render(
        request,
        "users/login.html",
    )


def logoutUser(request):
    logout(request)
    messages.info(
        request,
        "User logged out",
    )
    return redirect("login")


@login_required(login_url="login")
def app(request):
    return render(
        request,
        "users/app.html",
    )


@login_required(login_url="login")
def mollieReturn(request, *args, **kwargs):
    payment = mollie_client.payments.get(kwargs["payment_id"])
    if payment.is_paid():
        messages.info(
            request,
            "Payment was succesful",
        )
    else:
        messages.error(
            request,
            "Payment was not succesful",
        )
    return redirect("userHome")


@login_required(login_url="login")
def mollieWebhook(request, *args, **kwargs):
    molliePayment = MolliePayments.objects.get(payment_id=kwargs["identifier"])
    payment = mollie_client.payments.get(kwargs["identifier"])
    if payment.is_paid():
        messages.info(
            request,
            "Payment was succesful",
        )
        molliePayment.is_paid = True
        molliePayment.payed_on = datetime.now()
        molliePayment.save()
        WalletUpgrades.objects.create(
            holder=molliePayment.holder,
            amount=molliePayment.amount,
            comment=f"Upgrade via mollie payment {molliePayment.payment_id}",
            seller=Personel.objects.get(id=5),
        )
    else:
        messages.error(
            request,
            "Payment was not succesful",
        )
    return redirect("userHome")


@login_required(login_url="login")
def paymentUpgrade(request):
    form = MolliePaymentsForm()
    if request.method == "POST":
        form = MolliePaymentsForm(request.POST)
        if form.is_valid():
            molliePayment = form.save(commit=False)
            molliePayment.holder = request.user.holder
            # molliePayment.save()
            body = {
                "amount": {"currency": "EUR", "value": f"{molliePayment.amount:.2f}"},
                "description": f"Mamon | Wallet Opwarderen  €{molliePayment.amount:.2f}",
                "redirectUrl": request.build_absolute_uri(reverse("mollie-return", args=[str(molliePayment.identifier)])),
                "webhookUrl": request.build_absolute_uri(reverse("mollie-webhook", args=[str(molliePayment.identifier)])),
                "method": ["applepay", "creditcard", "ideal"],
                "metadata": {"identifier": str(molliePayment.identifier)},
            }
            payment = mollie_client.payments.create(body)
            molliePayment.payment_id = payment.id
            molliePayment.expiry_date = payment.get("expiresAt")
            molliePayment.save()
            return redirect(payment.checkout_url)
    content = {
        "form": form,
    }
    return render(request, "users/paymentUpgrade.html", content)
