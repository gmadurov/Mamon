from django.shortcuts import render
from .models import Purchase

# Create your views here.


def showPurchases(request):
    purchases = Purchase.objects.all()
    content = {"purchases": purchases}
    return render(request, "purchases/purchases.html", content)


def showPurchase(request, pk):
    purchase = Purchase.objects.get(id=pk)
    content = {"purchase": purchase}
    return render(request, "purchase/purchase.html", content)
