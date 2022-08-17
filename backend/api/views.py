import io
import json
import os
from datetime import date, datetime, time
from itertools import product
from typing import final
from unittest import expectedFailure
from urllib import response
from django.shortcuts import redirect

import jwt
import requests
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .tokens import MyTokenObtainPairSerializer, MyTokenObtainPairView
from purchase.models import Order, Product, Purchase
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    token_refresh,
)
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from users.models import Holder

from .serializers import (
    HolderSerializer,
    ProductSerializer,
    PurchaseSerializer,
    UserSerializer,
)

API_URL = "/api/"


encoded_jwt = jwt.encode(
    {
        "IDENTIFIER": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJJREVOVElGSUVSIjoiM2I4ZDY4NTItODdjMC00NWY1LTgyNjYtNWI5Nzc5NWFjZDViIiwiUEFUSFMiOlsiKiJdfQ.1HGoxZvfR21jyVwPbUIh0dlv2o3nl3Ts-NnaPTiAs84",
        "PATHS": [
            "/api/login/",
            "/api/personen/[a-zA-Z0-9]{40}/",
        ],
    },
    os.environ.get("JWT_KEY", "querty"),
    algorithm="HS256",
)


def group_required(*group_names):
    """Requires user membership in at least one of the groups passed in."""

    def in_groups(u):
        if u.is_authenticated:
            if u.groups.filter(name__in=group_names):
                return True
        return False

    return user_passes_test(in_groups, login_url="403")


def safe_json_decode(response):
    print(response.status_code)
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


@api_view(["GET", "POST"])
@permission_classes(IsAuthenticated)
def showProducts(request):
    data = request.data
    if request.method == "GET":
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = ProductSerializer(data=data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes(IsAuthenticated)
def showProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)
    if request.method == "GET":
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    if request.method == "PUT":
        product.price = data["price"] or None
        product.name = data["name"] or None
        product.save()
    if request.method == "DELETE":
        product.delete()
        return Response()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes(IsAuthenticated)
def showPurchases(request):
    data = request.data
    if request.method == "GET":
        holder = request.user.holder
        purschases = holder.purchase_set.all()  # Purchase.objects.all()
        serializer = PurchaseSerializer(purschases, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        purchase = Purchase.objects.create(
            buyer=Holder.objects.get(id=data["buyer"]),
            payed=data["payed"],
        )
        if data["orders"]:

            orders = [
                Order.objects.get_or_create(
                    quantity=order["quantity"],
                    product=Product.objects.get(id=order["product"]),
                )
                for order in data["orders"]
            ]
            # print([order[1] for order in orders])
            purchase.orders.set([order[0] for order in orders])
        else:
            purchase.orders.set([])
        purchase.save()
        serializer = PurchaseSerializer(purchase, many=False)
        return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes(IsAuthenticated)
def showPurchase(request, pk):
    data = request.data
    purschase = Purchase.objects.get(id=pk)
    if request.method == "GET":
        serializer = PurchaseSerializer(purschase, many=False)
        return Response(serializer.data)
    if request.method == "PUT":
        purschase.buyer = data["buyer"] or None
        purschase.products = data["products"] or None
        purschase.save()
    if request.method == "DELETE":
        purschase.delete()
        return Response()
    serializer = PurchaseSerializer(purschase, many=False)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes(IsAuthenticated)
def showHolders(request):
    data = request.data
    if request.method == "GET":
        if "search" in data.keys():
            search = data["search"]
            users = User.objects.filter(
                Q(first_name__icontains=search) | Q(last_name__icontains=search)
            ).distinct()
            holders = [user.holder for user in users]
        else:
            holders = Holder.objects.all()
        serializer = HolderSerializer(holders, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        if "search" in data.keys():
            search = data["search"]
            users = (
                User.objects.filter(
                    Q(first_name__icontains=search) | Q(last_name__icontains=search)
                ).distinct()
                if (data["search"])
                else User.objects.all()
            )
            print(users)
            holders = [user.holder for user in users]
            serializer = HolderSerializer(holders, many=True)
        else:
            holder = Holder.objects.create()
            serializer = HolderSerializer(holder, many=False)
        return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes(IsAuthenticated)
def showHolder(request, pk):
    data = request.data
    holder = Holder.objects.get(id=pk)
    if request.method == "GET":
        serializer = HolderSerializer(holder, many=False)
        return Response(serializer.data)
    if request.method == "PUT":
        holder.stand = data["stand"] or None
        holder.save()
    if request.method == "DELETE":
        holder.delete()
        return Response()
    serializer = HolderSerializer(holder, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def LoginAllUsers(request):

    try:
        if (
            User.objects.get(username=request.data["username"]).holder.ledenbase_id
        ) > 1:
            raise Exception("User is from ledenbase")
        token = safe_json_decode(
            requests.post(
                f"{request.scheme}://{request.get_host()}/api/users/token/",
                data={
                    "password": request.data["password"],
                    "username": request.data["username"],
                },
            )
        )[1]
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
            return Response(
                data=ledenbaseUser,
                status=res.status_code,
            )
        try:
            user = Holder.objects.get(ledenbase_id=ledenbaseUser["user"]["id"]).user
        except:
            # create user and update holder info as required if user is not in database
            user = User.objects.create(
                username=request.data["username"],
                first_name=ledenbaseUser["user"]["first_name"],
                last_name=ledenbaseUser["user"]["last_name"],
            )
            holder = Holder.objects.get(
                user=user,
            )
            holder.ledenbase_id = ledenbaseUser["user"]["id"]
            holder.save()

        refresh = MyTokenObtainPairSerializer.get_token(user)
        token = safe_json_decode(
            requests.post(
                f"{request.scheme}://{request.get_host()}/api/users/token/refresh/",
                data={"refresh": refresh},
            )
        )[1]

    return Response(token or None)
    # return Response(token)
