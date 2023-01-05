from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.views import loginAllUsers
from users.models import Card, Holder, Personel, WalletUpgrades
from django.shortcuts import get_object_or_404

from .serializers import CardSerializer, HolderSerializer, WalletUpgradesSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def showHolders(request):
    data = request.data
    if "search" in data.keys():
        search = data.get("search")
        users = User.objects.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search)).distinct()
        holders = [user.holder for user in users]
    else:
        holders = Holder.objects.all()
    serializer = HolderSerializer(holders, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def showHolder(request, pk):
    holder = Holder.objects.get(id=pk)
    serializer = HolderSerializer(holder, many=False, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def showHolder(request, pk):
    data = request.data
    holder = Holder.objects.get(id=pk)
    serializer = HolderSerializer(holder, many=False, context={"request": request})
    return Response(serializer.data)


# make wallet upgrades api


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def handle_WalletUpgrades(request):
    if request.method == "GET":
        walletUpgrades = WalletUpgrades.objects.all()
        serializer = WalletUpgradesSerializer(walletUpgrades, many=True, context={"request": request})
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        # print(data, request.user)
        holder = get_object_or_404(Holder, id=int(data.get("holder")["id"]))
        personel = get_object_or_404(Personel, user=request.user)
        serializer = WalletUpgradesSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save(holder=holder, seller=personel)
            return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def handle_WalletUpgradesPassword(request):
    if request.method == "GET":
        walletUpgrades = WalletUpgrades.objects.all()
        serializer = WalletUpgradesSerializer(walletUpgrades, many=True, context={"request": request})
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        seller, checked = loginAllUsers(request, password=request.data.get("password"), username=request.data.get("seller").get("username"), api=True)
        if seller and checked == 200:
            holder = get_object_or_404(Holder, id=int(data.get("holder")["id"]))
            personel = get_object_or_404(Personel, user=seller)
            wallet_upgrade = WalletUpgradesSerializer(data=data)
            if wallet_upgrade.is_valid(True):
                wallet_upgrade.save(holder=holder, seller=personel)
                return Response(wallet_upgrade.data)
            # wallet_upgrade.save(holder=holder, seller=personel)
            # serializer = WalletUpgradesSerializer(wallet_upgrade, many=False, context={"request": request})
            # return Response(serializer.data)
        return Response({"message": "Seller not found"}, status=501)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def handle_WalletUpgradesCards(request):
    if request.method == "GET":
        walletUpgrades = WalletUpgrades.objects.all()
        serializer = WalletUpgradesSerializer(walletUpgrades, many=True, context={"request": request})
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        seller, checked = loginAllUsers(request, password=request.data.get("password"), username=request.data.get("username"), api=True)
        if seller and checked == 200:
            id = int(data.get("holder")["id"])
            holder = Holder.objects.get(id=id)
            personel = Personel.objects.get(user_holder__card=request.data.get("card"))
            # TODO: check who the card is associated to
            wallet_upgrade = WalletUpgrades.objects.create(holder=holder, amount=data.get("amount"), seller=personel)
            serializer = WalletUpgradesSerializer(wallet_upgrade, many=False, context={"request": request})
            return Response(serializer.data)
        return Response({"message": "Seller not found"}, status=501)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def showHolderCards(request, pk):
    if request.method == "GET":
        cards = Card.objects.filter(holder_id=pk)
        serializer = CardSerializer(cards, many=True, context={"request": request})
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        holder = Holder.objects.get(id=pk)
        card = Card.objects.create(
            holder=holder,
            card_name=data.get("card_name"),
            card_id=data.get("card_id"),
        )
        serializer = CardSerializer(card, many=False, context={"request": request})
        return Response(serializer.data)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def handle_Cards(request):
    if request.method == "GET":
        cards = Card.objects.all()
        serializer = CardSerializer(cards, many=True, context={"request": request})
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        holder = Holder.objects.get(id=data.get("holder").get("id"))
        card = Card.objects.create(
            holder=holder,
            card_name=data.get("card_name"),
            card_id=data.get("card_id"),
        )
        serializer = CardSerializer(card, many=False, context={"request": request})
        return Response(serializer.data)
    if request.method == "DELETE":
        card = Card.objects.get(id=data.get("id"))
        card.delete()
        return Response()


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def handle_Card(request, pk):
    if request.method == "GET":
        card = Card.objects.get(card_id=pk)
        serializer = CardSerializer(card, many=False, context={"request": request})
        return Response(serializer.data)
    if request.method == "PUT":
        data = request.data
        card = Card.objects.get(id=pk)
        card.card_name = data.get("card_name")
        card.save()
        serializer = CardSerializer(card, many=False, context={"request": request})
        return Response(serializer.data)
    if request.method == "DELETE":
        card = Card.objects.get(id=pk)
        card.delete()
        return Response()


