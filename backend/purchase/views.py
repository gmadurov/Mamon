import datetime
import time
from common.export_functions import purchase_export_excel
from users.forms import PersonelForm
from purchase.forms import ProductForm
from django.contrib import messages

from users.models import Holder, Personel, WalletUpgrades
from purchase.utils import paginateObjects
from django.db.models import Sum
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from purchase.models import Barcycle, Purchase
from inventory.models import Order, Product, Category

# Create your views here.
"""This page is for what the bestuur sees it is overview info"""


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
def showOverview(request):
    # get puchased in a certain time period specified by a forms in the request
    start_date_str = request.GET.get("start_date", (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M"))
    end_date_str = request.GET.get("end_date", datetime.datetime.today().strftime("%Y-%m-%dT%H:%M"))

    start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%dT%H:%M")
    end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%dT%H:%M")

    purchases = Purchase.objects.filter(created__range=(start_date, end_date))
    if request.method == "POST":
        return purchase_export_excel(Purchase, request, purchases, f'{start_date.strftime("%B")}')
    # get sum of all holder stands, excluding users in "Bezoekers" group
    holder_stands = Holder.objects.exclude(user__groups__name__in=["Bezoekers"]).aggregate(Sum("stand")).get("stand__sum")
    # Filter wallet upgrades within the specified time period, excluding users in "Bezoekers" group
    walletUpgradeQuery = (
        WalletUpgrades.objects.prefetch_related("refund", "amount")
        .filter(date__range=(start_date, end_date))
        .exclude(holder__user__groups__name__in=["Bezoekers"])
    )
    # Get the products that have been sold in this time period
    products = Product.objects.filter(order__ordered__created__gte=start_date, order__ordered__created__lte=end_date).distinct()
    # Calculate the quantities of products sold
    products_quant = {
        prod: purchases.filter(orders__product=prod).aggregate(Sum("orders__quantity")).get("orders__quantity__sum") or 0 for prod in products
    }.items()

    # handle all the calculations for purchases in this time period
    def get_category_sales(category=None, **kwargs):
        """This function returns the total amount of money made from a certain category of products in a certain time period
        you might also need to add balance=True to the filter to only include wallet payments
        if no category is given it will return the total amount of money made for all products in the time period

        category = desired cat otherwise leave empty

        **kwargs are for filtering the purchases
        """
        return sum(
            [
                (
                    purchases.filter(created__gte=start_date, created__lte=end_date, orders__product=prod, **kwargs)
                    .aggregate(Sum("orders__quantity"))
                    .get("orders__quantity__sum")
                    or 0
                )
                * prod.price
                for prod in (products.filter(**dict(cat_products__name=category)) if category else products)
            ]
        )

    barOmzetWallet = get_category_sales("Bar", balance=True)  #  # get total amount of money made from bar
    barOmzetPin = get_category_sales("Bar", pin=True)  #  # get total amount of money made from bar
    barOmzetCash = get_category_sales("Bar", cash=True)  #  # get total amount of money made from bar
    handelswaar = get_category_sales("Handelswaar")  # get total amount of money made from handelswaar
    totalGepind = get_category_sales(pin=True)  # get total amounts payed with pin
    totalGecashed = get_category_sales(cash=True)  # get total amounts payed with cash
    bezoekers_pasen = get_category_sales(buyer__user__groups__name__in=["Bezoekers"])  # get total amounts payed by bezoekers
    hapOmzetPin = get_category_sales("Happen", pin=True)  # get total amounts of happen payed with pin
    hapOmzetCash = get_category_sales("Happen", cash=True)  # get total amounts of happen payed with cash
    hapOmzetWallet = get_category_sales("Happen", balance=True)  # get total revenue from happen

    purchases, paginator_purchases = paginateObjects(request, purchases, 20, "purchase_page")

    # handle all the calculations for wallet upgrades in this time period
    walletUpgrades = walletUpgradeQuery.aggregate(Sum("amount")).get("amount__sum")
    refunds = walletUpgradeQuery.filter(refund=True).aggregate(Sum("amount")).get("amount__sum")
    # refunds = sum([wal.amount for wal in walletUpgradeQuery])

    products_quant, paginator_products_quant = paginateObjects(request, list(products_quant), 10, "product_page")
    content = {
        "purchases": purchases,
        "products_quant": products_quant,
        "start_date": start_date.strftime("%Y-%m-%dT%H:%M"),
        "end_date": end_date.strftime("%Y-%m-%dT%H:%M"),
        "holder_stands": holder_stands,
        "barOmzetWallet": barOmzetWallet,
        "barOmzetPin": barOmzetPin,
        "barOmzetCash": barOmzetCash,
        "walletUpgrades": walletUpgrades,
        "totalGepind": totalGepind - handelswaar - hapOmzetPin,
        "totalGecashed": totalGecashed,
        "bezoekers_pasen": bezoekers_pasen,
        "handelswaar": handelswaar,
        "hapOmzetPin": hapOmzetPin,
        "hapOmzetCash": hapOmzetCash,
        "hapOmzetWallet": hapOmzetWallet,
        "refunds": refunds,
        "pages_purchases": paginator_purchases.get_elided_page_range(number=purchases.number, on_each_side=2, on_ends=1),
        "pages_products_quant": paginator_products_quant.get_elided_page_range(number=products_quant.number, on_each_side=2, on_ends=1),
    }
    return render(request, "purchase/overview.html", content)


@login_required
def dailyOverview(request):
    mode = request.GET.get("mode", "days")
    unit_mode = request.GET.get("unit_mode", "euro")
    category = int(request.GET.get("category", 0))
    start_date_str = request.GET.get("start_date", (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M"))
    end_date_str = request.GET.get("end_date", datetime.datetime.today().strftime("%Y-%m-%dT%H:%M"))

    start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%dT%H:%M")
    end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%dT%H:%M")

    categories = Category.objects.all()
    purchases = Purchase.objects.prefetch_related("orders").filter(created__range=(start_date, end_date))

    kwargs = dict(order__ordered__created__range=(start_date, end_date))
    if category:
        kwargs["cat_products__id"] = category
    products = Product.objects.filter(**kwargs).distinct()
    products_quant = {
        prod_id["orders__product_id"]: prod_id["orders__quantity__sum"]
        for prod_id in purchases.values("orders__product_id").annotate(Sum("orders__quantity"))
    }

    def get_quants(price, months):
        """return the total amount of products sold in a given time range and the time range"""
        date_range = (
            [
                datetime.datetime(year=year, month=month, day=1)
                for year in range(start_date.year, end_date.year + 1)
                for month in range(start_date.month if year == start_date.year else 1, end_date.month + 1 if year == end_date.year else 13)
            ]
            if months
            else [start_date + datetime.timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        )
        return (
            date_range,
            {
                prod: (
                    prod,
                    [
                        round(
                            (purchases.filter(orders__product=prod, **kwargs).aggregate(Sum("orders__quantity")).get("orders__quantity__sum") or 0)
                            * (prod.price if price else 1),
                            2,
                        )
                        for kwargs in (
                            [dict(created__month=day.month, created__year=day.year) for day in date_range]
                            if months
                            else [dict(created__day=day.day, created__month=day.month, created__year=day.year) for day in date_range]
                        )
                    ],
                    round(products_quant[prod.id] * (prod.price if price else 1), 2),
                )
                for prod in products
            }.values(),
        )

    date_range, quantities = get_quants(unit_mode == "euro", mode == "months")

    # # for each day in date_range get the total amount of products sold
    content = {
        "quantities": quantities,
        "total_sales": sum([q[2] for q in quantities]),
        "date_range": date_range,
        "categories": categories,
        "category": category,
        "start_date": start_date.strftime("%Y-%m-%dT%H:%M"),
        "end_date": end_date.strftime("%Y-%m-%dT%H:%M"),
        "mode": mode,
        "unit_mode": unit_mode,
    }
    return render(request, "purchase/daily_overview.html", content)


@login_required(login_url="login")
def showBarcycles(request):
    barcycles = Barcycle.objects.all()
    content = {"barcycles": barcycles}
    return render(
        request,
        "purchase/barcycles.html",
        content,
    )


def showBarcycle(request, pk):
    barcycle = Barcycle.objects.get(id=pk)
    purchases = barcycle.purchases
    print(purchases)
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
    products_quant, paginator_products_quant = paginateObjects(request, list(products_quant), 10, "product_page")
    purchases, paginator_purchases= paginateObjects(request, purchases, 10, "purchase_page")
    content = {
        "purchases": purchases,
        "products_quant": products_quant,
        "holder_stands": holder_stands,
        "barWinst": barWinst,
        "totalGepind": totalGepind,
        "totalGecashed": totalGecashed,
        "bezoekers_pasen": bezoekers_pasen,
        "handelswaar": handelswaar,
        "happenPin": happenPin,
        "happenCash": happenCash,
        "custom_range_purchases": paginator_purchases.get_elided_page_range(number=purchases.number, on_each_side=2, on_ends=1),
        "custom_range_products_quant": paginator_products_quant.get_elided_page_range(number=products_quant.number, on_each_side=2, on_ends=1),
        "barcycle": barcycle,
    }
    return render(request, "purchase/barcycle.html", content)


# idk if this should be implemented
# def product_edit(request, pk=None):
#     product = get_object_or_404(Product, pk=pk)
#     if request.method == "POST":
#         form = ProductForm(data=request.POST, instance=product)
#         if form.is_valid():
#             form.save()
#             return redirect("product", pk=pk)
#         else:
#             messages.error(request, form.errors)
#     else:
#         form = ProductForm(instance=product)
#     return render(request, "purchase/product_form.html", {"form": form})


# def category_create(request):
#     form = CategoryForm()
#     if request.method == "POST":
#         form = CategoryForm(data=request.POST)
#         if form.is_valid():
#             category = form.save()
#             return redirect("category", pk=category.pk)
#         else:
#             messages.error(request, form.errors)
#     return render(request, "purchase/category_form.html", {"form": form})


def userOverview(request):
    users = Personel.objects.all()
    content = {
        "users": users,
    }
    return render(request, "purchase/user_overview.html", content)


def userEdit(request, pk):
    user = Personel.objects.get(id=pk)
    form = PersonelForm(instance=user)
    if request.method == "POST":
        form = PersonelForm(data=request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect("personelOverview")
        else:
            messages.error(request, form.errors)
    content = {
        "user": user,
        "form": form,
    }
    return render(request, "purchase/user_form.html", content)


def togglePersonelActive(request, pk=None):
    personel = get_object_or_404(Personel, pk=pk)
    personel.active = not personel.active
    personel.save()
    # return to last page
    return redirect(request.META.get("HTTP_REFERER"))
