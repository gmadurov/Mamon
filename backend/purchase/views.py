import datetime
from django.shortcuts import render

from users.models import Holder
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


@login_required(login_url="login")
def showOverview(request):
    # get puchased in a certain time period specified by a forms in the request
    start_date = request.GET.get(
        "start_date", datetime.datetime.today() - datetime.timedelta(days=30)
    )
    end_date = request.GET.get("end_date", datetime.datetime.today())

    try:
        purchases = Purchase.objects.filter(
            created__gte=start_date, created__lte=end_date
        )
    except:
        purchases = Purchase.objects.all()
    products = Product.objects.all()
    quantity = {
        prod.id: purchases.filter(orders__product=prod)
        .aggregate(Sum("orders__quantity"))
        .get("orders__quantity__sum")
        or 0
        for prod in products
    }

    # get sum of all holder stands
    holder_stands = Holder.objects.all().aggregate(Sum("stand")).get("stand__sum")

    barWinst = sum([pur.total for pur in purchases])
    # print(holder_stands)
    content = {
        "purchases": purchases,
        "quantity": quantity,
        "start_date": start_date,
        "end_date": end_date,
        "holder_stands": holder_stands,
        "barWinst": barWinst,
    }
    return render(request, "purchase/overview.html", content)
