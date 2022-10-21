import json
import os

import requests
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q
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
    # return render(request)


def logind(request):

    try:
        if (
            User.objects.get(username=request.data["username"]).holder.ledenbase_id
        ) > 1:
            raise Exception("User is from ledenbase")
        user = authenticate(
            password=request.data["password"],
            username=request.data["username"],
        )
    except:
        res, ledenbaseUser = safe_json_decode(
            requests.post(
                os.environ.get("BACKEND_URL") + "/v2/login/",
                json={
                    "password": request.data["password"],
                    "username": request.data["username"],
                },
            )
        )
        if res.status_code != 200:
            return
        try:
            # print(ledenbaseUser)
            holder = Holder.objects.get(ledenbase_id=ledenbaseUser["user"]["id"])
            user = holder.user
            holder.image_ledenbase = (
                os.environ.get("BACKEND_URL") + ledenbaseUser["user"]["photo_url"]
            )
            holder.save()

        except:
            # create user and update holder info as required if user is not in database
            user = User.objects.create(
                username=request.data["username"],
                first_name=ledenbaseUser["user"]["first_name"],
                last_name=ledenbaseUser["user"]["last_name"],
                # user purposely doesnt have a password set here to make sure it
            )
            holder = Holder.objects.get(
                user=user,
            )
            holder.ledenbase_id = ledenbaseUser["user"]["id"]
            holder.image_ledenbase = (
                os.environ.get("BACKEND_URL") + ledenbaseUser["user"]["photo_url"]
            )
            holder.save()


def loginUser(request):
    if request.user.is_authenticated:
        return redirect("purchases")
    if request.method == "POST":
        # print(request.POST)
        try:
            User.objects.get(username=request.POST["username"]).personel
        except Personel.DoesNotExist:
            messages.error(request, "Username does not exist")
            print("here")
        user = authenticate(
            password=request.POST["pass word"],
            username=request.POST["username"],
        )
        if user:
            login(request, user)
            messages.info(request, "User was logged in")
            return redirect(
                request.GET["next"] if "next" in request.GET else "purchases"
            )
        else:
            messages.error(request, "Password is incorrect")

    return render(request, "users/login.html")


def logoutUser(request):
    logout(request)
    messages.info(request, "User logged out")
    return redirect("login")
