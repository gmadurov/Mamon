from django.shortcuts import render
from .models import Product, Purchase
from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required(login_url="login")
def showPurchases(request):
    purchases = Purchase.objects.all()
    content = {"purchases": purchases}
    return render(request, "purchase/purchases.html", content)


@login_required(login_url="login")
def showPurchase(request, pk):
    purchase = Purchase.objects.get(id=pk)
    content = {"purchase": purchase}
    return render(request, "purchase/purchase.html", content)


@login_required(login_url="login")
def showProducts(request):
    products = Product.objects.all()
    content = {"products": products}
    return render(request, "purchase/products.html", content)


@login_required(login_url="login")
def showProduct(request, pk):
    product = Product.objects.get(id=pk)
    content = {"product": product}
    return render(request, "purchase/product.html", content)
