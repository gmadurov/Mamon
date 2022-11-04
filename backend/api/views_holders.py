import os
import requests
from api.views import loginLedenbase, safe_json_decode
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Holder, Personel, WalletUpgrades

from .serializers import HolderSerializer, WalletUpgradesSerializer


def check_user(username, password):
    user = authenticate(username=username, password=password)
    if user is not None:
        return True
    else:
        res, ledenbaseUser = safe_json_decode(
            requests.post(
                os.environ.get("BACKEND_URL") + "/v2/login/",
                json={
                    "password": password,
                    "username": username,
                },
            )
        )
        if res.status_code != 200:
            return (
                Response(
                    data=ledenbaseUser,
                    status=res.status_code,
                ),
                False,
            )

        user = User.objects.get(username=username)
        return user, True


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
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
        serializer = HolderSerializer(holders, many=True, context={"request": request})
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
            holders = [user.holder for user in users]
            serializer = HolderSerializer(
                holders, many=True, context={"request": request}
            )
        else:
            holder = Holder.objects.create()
            serializer = HolderSerializer(
                holder, many=False, context={"request": request}
            )
        return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def showHolder(request, pk):
    data = request.data
    holder = Holder.objects.get(id=pk)
    # if request.method == "GET": # redundant
    #     serializer = HolderSerializer(holder, many=False, context={"request": request})
    #     return Response(serializer.data)
    if request.method == "PUT":
        holder.stand = data["stand"] or None
        holder.save()
    if request.method == "DELETE":
        holder.delete()
        return Response()
    serializer = HolderSerializer(holder, many=False, context={"request": request})
    return Response(serializer.data)


# make wallet upgrades api


@api_view(["GET", "POST"])
# @permission_classes([IsAuthenticated])
def handle_WalletUpgrades(request):
    if request.method == "GET":
        walletUpgrades = WalletUpgrades.objects.all()
        serializer = WalletUpgradesSerializer(
            walletUpgrades, many=True, context={"request": request}
        )
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        seller, checked = check_user(
            username=data.get("seller").get("username"),
            password=data.get("password"),
        )
        if seller and checked:
            id = int(data["holder"]["id"])
            print(id, seller)
            holder = Holder.objects.get(id=50)
            personel = Personel.objects.get(user=seller)
            wallet_upgrade = WalletUpgrades.objects.create(
                holder=holder, amount=data["amount"], seller=personel
            )
            serializer = WalletUpgradesSerializer(
                wallet_upgrade, many=False, context={"request": request}
            )
            return Response(serializer.data)
        return Response({"message": "Seller not found"}, status=501)
