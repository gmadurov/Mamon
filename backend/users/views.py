import json
import os

import requests
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render


from .models import Holder, Personel

# Create your views here.


def safe_json_decode(response):
    if response.status_code == 500:
        raise Exception("500")
    # elif response.status_code == 400:
    #     raise Exception("400")
    # elif response.status_code == 401:
    #     raise Exception("401")
    else:
        try:
            return response, response.json()
        except json.decoder.JSONDecodeError:
            raise Exception("500", "Ledenbase response not readable or empty")


@login_required(login_url="login")
def showUsers(request):
    users = Holder.objects.all()
    return render(request)


@login_required(login_url="login")
def home(request):
    user = Holder.objects.get(user=request.user)
    purchases = user.purchases.all()
    content = {
        "user": user,
        "purchases": purchases,
    }
    return render(request, "users/home.html", content)


def loginLedenbase(request):
    res, ledenbaseUser = safe_json_decode(
        requests.post(
            os.environ.get("BACKEND_URL") + "/v2/login/",
            json={
                "password": request.POST["password"],
                "username": request.POST["username"],
            },
        )
    )
    if res.status_code != 200:
        messages.error(request, ledenbaseUser["non_field_errors"])
        return None

    user, created = User.objects.get_or_create(
        username=request.POST["username"],
        first_name=ledenbaseUser["user"]["first_name"],
        last_name=ledenbaseUser["user"]["last_name"],
        # user purposely doesnt have a password set here to make sure it
    )
    holder, created = Holder.objects.get_or_create(
        user=user,
    )
    holder.ledenbase_id = ledenbaseUser["user"]["id"]
    holder.image_ledenbase = (
        os.environ.get("BACKEND_URL") + ledenbaseUser["user"]["photo_url"]
    )
    holder.save()
    return user


def loginUser(request):
    if request.user.is_authenticated:
        return redirect("purchases")
    if request.method == "POST":
        user1 = User.objects.filter(username=request.POST["username"])
        if user1.exists() and user1.filter(holder__ledenbase_id=0).exists():
            print("user exists and doesnt have ledenbase id")
            user = authenticate(
                password=request.POST["password"],
                username=request.POST["username"],
            )
        else:
            user = loginLedenbase(request)
        if user:
            login(request, user)
            messages.info(request, "User was logged in")
            return redirect(
                request.GET["next"] if "next" in request.GET else "userHome"
            )

    return render(request, "users/login.html")


def logoutUser(request):
    logout(request)
    messages.info(request, "User logged out")
    return redirect("login")
