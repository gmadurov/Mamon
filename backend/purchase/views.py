import datetime

from users.models import Holder, WalletUpgrades
from purchase.utils import paginateObjects
from django.db.models import Sum
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Order, Product, Barcycle, Category, Purchase

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
        prod.id: orders.filter(ordered__in=request.user.holder.purchases.all()).filter(product=prod).aggregate(Sum("quantity")).get("quantity__sum") or 0
        for prod in products
    }

    content = {
        "products": products,
        "quantity": quantity,
    }
    return render(request, "purchase/products.html", content)


@login_required(login_url="login")
def showProductOverviews(request, pk):
    product = Product.objects.get(id=pk)
    start_date = request.GET.get("start_date") or (datetime.datetime.today() - datetime.timedelta(days=30))
    end_date = request.GET.get("end_date") or (datetime.datetime.today())

    #   find how many of each product a request user has bought
    purchases = Purchase.objects.filter(
        created__gte=start_date,
        created__lte=end_date,
    ).filter(orders__product__id=pk)
    content = {
        "product": product,
        "purchases": purchases,
    }
    return render(request, "purchase/product.html", content)


@login_required(login_url="login")
def showProduct(request, pk):
    product = Product.objects.get(id=pk)
    purchases = Purchase.objects.filter(orders__product=product).filter(buyer=request.user.holder)
    content = {
        "product": product,
        "purchases": purchases,
    }
    return render(request, "purchase/product.html", content)


@login_required(login_url="login")
def showOverview(request):
    # get puchased in a certain time period specified by a forms in the request
    start_date = request.GET.get("start_date") or (datetime.datetime.today() - datetime.timedelta(days=30))
    end_date = request.GET.get("end_date") or (datetime.datetime.today())

    purchases = Purchase.objects.filter(
        created__gte=start_date,
        created__lte=end_date,
    )

    #  get all the products that has been bought in the purchases
    products = [prod.product for pur in purchases for prod in pur.orders.all()]
    products_quant = {
        prod: purchases.filter(orders__product=prod).aggregate(Sum("orders__quantity")).get("orders__quantity__sum") or 0 for prod in products
    }.items()

    # get sum of all holder stands
    holder_stands = Holder.objects.all().aggregate(Sum("stand")).get("stand__sum")

    barWinst = sum([pur.total for pur in purchases])
    totalGepind = sum([pur.total for pur in purchases.filter(pin=True)])
    totalGecashed = sum([pur.total for pur in purchases.filter(cash=True)])
    bezoekers_pasen = sum([pur.total for pur in purchases.filter(buyer__user__groups__name__in=["Bezoekers"])])
    handelswaar = sum([pur.total for pur in purchases.filter(orders__product__cat_products__name__in=["Handelswaar"])])
    happenPin = sum([pur.total for pur in purchases.filter(orders__product__cat_products__name__in=["Happen"], pin=True)])
    happenCash = sum([pur.total for pur in purchases.filter(orders__product__cat_products__name__in=["Happen"], cash=True)])
    walletUpgradeQuery = WalletUpgrades.objects.filter(date__gte=start_date, date__lte=end_date)
    walletUpgrades = walletUpgradeQuery.aggregate(Sum("amount")).get("amount__sum")
    refunds = sum([wal.amount for wal in walletUpgradeQuery.filter(refund=True)])
    custom_range_products_quant, products_quant = paginateObjects(request, list(products_quant), 10, "product_page")
    custom_range_purchases, purchases = paginateObjects(request, purchases, 20, "purchase_page")
    content = {
        "purchases": purchases,
        "products_quant": products_quant,
        "start_date": start_date,
        "end_date": end_date,
        "holder_stands": holder_stands,
        "barWinst": barWinst,
        "walletUpgrades": walletUpgrades,
        "totalGepind": totalGepind,
        "totalGecashed": totalGecashed,
        "bezoekers_pasen": bezoekers_pasen,
        "handelswaar": handelswaar,
        "happenPin": happenPin,
        "happenCash": happenCash,
        "refunds": refunds,
        "custom_range_purchases": custom_range_purchases,
        "custom_range_products_quant": custom_range_products_quant,
    }
    return render(request, "purchase/overview.html", content)


@login_required(login_url="login")
def showBarcycles(request):
    barcycles = Barcycle.objects.all()
    content = {"barcycles": barcycles}
    print(barcycles)
    return render(
        request,
        "purchase/barcycles.html",
        content,
    )


def showBarcycle(request, pk):
    barcycle = Barcycle.objects.get(id=pk)
    content = {"barcycle": barcycle}
    return render(request, "purchase/barcycle.html", content)
