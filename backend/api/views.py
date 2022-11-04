import json
import os

import requests
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from api.tokens import MyTokenObtainPairSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import Holder


API_URL = "/api/"


def group_required(*group_names):
    """Requires user membership in at least one of the groups passed in."""

    def in_groups(u):
        if u.is_authenticated:
            if u.groups.filter(name__in=group_names):
                return True
        return False

    return user_passes_test(in_groups, login_url="403")


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



@api_view(["GET", "POST"])
def getRoutes(request):
    routes = [
        {"POST": API_URL + "login/"},
        {"GET": API_URL + "purchase/"},
        {"POST": API_URL + "purchase/"},
        {"GET": API_URL + "purchase/id"},
        {"PUT": API_URL + "purchase/id"},
        {"DELETE": API_URL + "purchase/id"},
        {"GET": API_URL + "product/"},
        {"POST": API_URL + "product/"},
        {"GET": API_URL + "product/id"},
        {"PUT": API_URL + "product/id"},
        {"DELETE": API_URL + "product/id"},
        {"GET": API_URL + "holders/"},
        {"POST": API_URL + "holders/"},
        {"GET": API_URL + "holders/id"},
        {"PUT": API_URL + "holders/id"},
        {"DELETE": API_URL + "holders/id"},
    ]
    return Response(routes)
# TODO: make the login use the check_user method from views_holders

@api_view(["POST"])
def LoginAllUsers(request):
    user1 = User.objects.filter(username=request.data["username"])
    if user1.exists() and user1.filter(holder__ledenbase_id=0).exists():
        user = authenticate(
            # request,
            password=request.data["password"],
            username=request.data["username"],
        )
        print("authenticaded users", user)
    else:
        user = loginLedenbase(request)
    # try:
    refresh = MyTokenObtainPairSerializer.get_token(user)
    # except:
    #     refresh = RefreshToken.for_user(user)
    response = {"refresh": str(refresh), "access": str(refresh.access_token)}

    return Response(response)


def loginLedenbase(request, boolean=False):
    res, ledenbaseUser = safe_json_decode(
        requests.post(
            os.environ.get("BACKEND_URL") + "/v2/login/",
            json={
                "password": request.data.get("password"),
                "username": request.data.get("username"),
            },
        )
    )
    if res.status_code != 200:
        return Response(
            data=ledenbaseUser,
            status=res.status_code,
        )

    user, created = User.objects.get_or_create(
        username=request.data.get("username"),
        # user purposely doesnt have a password set here to make sure it
    )

    user.first_name = ledenbaseUser["user"]["first_name"]
    user.last_name = ledenbaseUser["user"]["last_name"]
    user.save()
    if created:
        holder = Holder.objects.create(user=user)
        holder.save()
    else:
        holder = user.holder
    holder.ledenbase_id = ledenbaseUser["user"]["id"]
    holder.image_ledenbase = (
        os.environ.get("BACKEND_URL") + ledenbaseUser["user"]["photo_url"]
    )
    holder.save()
    return user
