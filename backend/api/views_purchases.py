from pprint import pprint
from purchase.models import Order, Product, Purchase
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Holder, Personel

from .serializers import PurchaseSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def showPurchases(request):
    if request.method == "GET":
        holder = request.user.holder
        purchases = holder.purchases.all()  # Purchase.objects.all()
        # user = Holder.objects.get(user=request.user)
        # purchases = user.purchases.all()
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        data = request.data
        purchase = PurchaseSerializer(data=data)
        if purchase.is_valid(raise_exception=True):
            purchase.save()
            return Response(purchase.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def showPurchase(request, pk):
    data = request.data
    purschase = Purchase.objects.get(id=pk)
    # if request.method == "GET": # redundant
    #     serializer = PurchaseSerializer(purschase, many=False)
    #     return Response(serializer.data)
    # if request.method == "PUT":
    #     purschase.buyer = data["buyer"] or None
    #     purschase.products = data["products"] or None
    #     purschase.save()
    serializer = PurchaseSerializer(purschase, many=False, context={"request": request})
    return Response(serializer.data)
