import json
import os

import requests
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from api.tokens import MyTokenObtainPairSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.views import loginAllUsers
import yaml

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


@api_view(["GET"])
def getRoutes(request):
    routes = [
        {
            "POST": API_URL + "",
        },
        {
            "POST": API_URL + "login/",
            "description": "Login",
            "body": {"username": "string", "password": "string"},
        },
        {
            "POST": API_URL + "users/token/refresh/",
            "description": "refresh token",
            "body": {"refresh": "string"},
        },
        {"ALL BELLOW REQUIRE AUTHENTICATION as a header": "Bearer or Authentication: access token"},
        {
            "GET": API_URL + "holders/",
            "description": "Get all holders",
            "body?": {"search": "string"},
        },
        {
            "GET": API_URL + "holders/<str:pk>/",
            "description": "Get holder by id",
            "pk": "Holder id",
        },
        {
            "GET, PUT": API_URL + "holders/<str:pk>/cards/",
            "description": "Get holder cards by id",
            "pk": "Holder id",
        },
        {
            "GET, POST": API_URL + "products/",
            "description": "Get all or create products",
            "body?": "product to be created (name:string, price: float, color: string)",
        },
        {
            "GET, PUT": API_URL + "products/<str:pk>/",
            "description": "Get, or update(name and color only) product by id",
            "pk": "Product id",
        },
        {
            "GET, POST": API_URL + "categories/",
            "description": "Get all or create categories",
        },
        {
            "POST": API_URL + "reports/",
            "description": "Create reports",
        },
        {
            "GET, POST": API_URL + "purchase/",
            "description": "Get all or create purchases",
        },
        {
            "GET": API_URL + "purchase/<str:pk>/",
            "description": "Get purchase by id",
            "pk": "Purchase id",
        },
        {
            "GET, POST": API_URL + "walletupgrade/",
            "description": "Get all wallet upgrades",
        },
        {
            "GET, POST, DELETE": API_URL + "cards/",
            "description": "Get all, add or delete cards",
        },
        {
            "GET, PUT, DELETE": API_URL + "cards/<str:pk>/",
            "description": "Get card by id",
            "pk": "Card id",
        },
        {
            "GET": API_URL + "environment/<str:name>/",
            "name": "name of enviroment variable",
        },
    ]
    with open("api/openapiMAMON.yaml", "r") as stream:
        routes = yaml.safe_load(stream)
    return Response(routes)


# TODO: make the login use the check_user method from views_holders


@api_view(["GET"])
def getVersion(request):
    return Response({"version": os.environ.get("VERSION")})


@api_view(["POST"])
def LoginAllUsers(request):
    """this is a test
    :param .Info info: information about the API; if omitted, defaults to :ref:`DEFAULT_INFO <default-swagger-settings>`
    """
    user1 = User.objects.filter(username=request.data["username"])
    if user1.exists() and user1.filter(holder__ledenbase_id=0).exists():
        user = authenticate(
            # request,
            password=request.data.get("password"),
            username=request.data.get("username"),
        )
    else:
        user, status = loginAllUsers(request, password=request.data.get("password"), username=request.data.get("username"), api=True)
        if status != 200:
            return Response(data=user, status=status)
    # try:
    refresh = MyTokenObtainPairSerializer.get_token(user)
    # except:
    #     refresh = RefreshToken.for_user(user)
    response = {"refresh": str(refresh), "access": str(refresh.access_token)}

    return Response(response)


@api_view(["GET"])
def getEnvironment(request, name):
    if "open_" in name:
        return Response({"variable": os.environ.get(name)})
    else:
        return Response({"error": "not allowed"}, status=403)


@api_view(["POST"])
def printme(request):
    print(request.data)
    return Response(request.data)
