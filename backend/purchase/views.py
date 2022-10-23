from django.shortcuts import render
from .models import Order, Product, Purchase
from django.contrib.auth.decorators import login_required
from django.db.models import Sum

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
    orders = Order.objects.all()
    #   find how many of each product a request user has bought
    quantity = {
        prod.id: orders.filter(ordered__in=request.user.holder.purchases.all())
        .filter(product=prod)
        .aggregate(Sum("quantity"))
        .get("quantity__sum")
        or 0
        for prod in products
    }

    content = {"products": products, "quantity": quantity}
    return render(request, "purchase/products.html", content)


@login_required(login_url="login")
def showProduct(request, pk):
    product = Product.objects.get(id=pk)
    purchases = Purchase.objects.filter(orders__product=product).filter(
        buyer=request.user.holder
    )
    content = {"product": product, "purchases": purchases}
    return render(request, "purchase/product.html", content)
