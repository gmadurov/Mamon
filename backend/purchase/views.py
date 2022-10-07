from django.shortcuts import render
from .models import Product, Purchase

# Create your views here.


def showPurchases(request):
    purchases = Purchase.objects.all()
    content = {"purchases": purchases}
    return render(request, "purchase/purchases.html", content)


def showPurchase(request, pk):
    purchase = Purchase.objects.get(id=pk)
    content = {"purchase": purchase}
    return render(request, "purchase/purchase.html", content)


def showProducts(request):
    products = Product.objects.all()
    content = {"products": products}
    return render(request, "purchase/products.html", content)

def showProduct(request, pk):
    product = Product.objects.get(id = pk)
    content = {"product": product}
    return render(request, "purchase/product.html", content)
