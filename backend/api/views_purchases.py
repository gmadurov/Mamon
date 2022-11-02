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
        purchase = Purchase.objects.create(
            buyer=Holder.objects.get(id=data["buyer"]),
            seller=Personel.objects.get(user_id=data["seller"]),
            payed=data["payed"] or False,
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
@permission_classes([IsAuthenticated])
def showPurchase(request, pk):
    data = request.data
    purschase = Purchase.objects.get(id=pk)
    # if request.method == "GET": # redundant
    #     serializer = PurchaseSerializer(purschase, many=False)
    #     return Response(serializer.data)
    if request.method == "PUT":
        purschase.buyer = data["buyer"] or None
        purschase.products = data["products"] or None
        purschase.save()
    if request.method == "DELETE":
        purschase.delete()
        return Response()
    serializer = PurchaseSerializer(purschase, many=False, context={"request": request})
    return Response(serializer.data)
