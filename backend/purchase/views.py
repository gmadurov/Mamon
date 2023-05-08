import datetime
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
    start_date = datetime.datetime.strptime(
        request.GET.get("start_date", (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M")), "%Y-%m-%dT%H:%M"
    )
    end_date = datetime.datetime.strptime((request.GET.get("end_date", (datetime.datetime.today()).strftime("%Y-%m-%dT%H:%M"))), "%Y-%m-%dT%H:%M")
    purchases = Purchase.objects.filter(created__gte=start_date, created__lte=end_date)
    if request.method == "POST":
        return purchase_export_excel(Purchase, request, purchases, f'{start_date.strftime("%B")}')
    # get sum of all holder stands
    holder_stands = Holder.objects.all().aggregate(Sum("stand")).get("stand__sum")
    walletUpgradeQuery = WalletUpgrades.objects.filter(date__gte=start_date, date__lte=end_date)

    # get the products that have been sold in this time period
    products = Product.objects.filter(order__ordered__created__gte=start_date, order__ordered__created__lte=end_date).distinct()
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
                for prod in products.filter(**dict(cat_products__name=category) if category else {})
            ]
        )

    barWinst = get_category_sales("Bar",balance=True)  #  # get total amount of money made from bar
    handelswaar = get_category_sales("Handelswaar") # get total amount of money made from handelswaar
    totalGepind = get_category_sales(pin=True) # get total amounts payed with pin
    totalGecashed = get_category_sales(cash=True) # get total amounts payed with cash
    # get total amounts of happen payed with cash and pin
    bezoekers_pasen = get_category_sales(buyer__user__groups__name__in=["Bezoekers"]) # get total amounts payed by bezoekers
    happenPin = get_category_sales("Happen", pin=True) # get total amounts of happen payed with pin
    happenCash = get_category_sales("Happen", cash=True) # get total amounts of happen payed with cash
    happen = get_category_sales("Happen") # get total revenue from happen

    custom_range_purchases, purchases = paginateObjects(request, purchases, 20, "purchase_page")

    # handle all the calculations for wallet upgrades in this time period
    walletUpgrades = walletUpgradeQuery.aggregate(Sum("amount")).get("amount__sum")
    refunds = sum([wal.amount for wal in walletUpgradeQuery.filter(refund=True)])

    custom_range_products_quant, products_quant = paginateObjects(request, list(products_quant), 10, "product_page")

    content = {
        "purchases": purchases,
        "products_quant": products_quant,
        "start_date": start_date.strftime("%Y-%m-%dT%H:%M"),
        "end_date": end_date.strftime("%Y-%m-%dT%H:%M"),
        "holder_stands": holder_stands,
        "barWinst": barWinst,
        "walletUpgrades": walletUpgrades,
        "totalGepind": totalGepind - handelswaar - happenPin,
        "totalGecashed": totalGecashed,
        "bezoekers_pasen": bezoekers_pasen,
        "handelswaar": handelswaar,
        "happenPin": happenPin,
        "happenCash": happenCash,
        "happen": happen,
        "refunds": refunds,
        "custom_range_purchases": custom_range_purchases,
        "custom_range_products_quant": custom_range_products_quant,
    }
    return render(request, "purchase/overview.html", content)


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
    custom_range_products_quant, products_quant = paginateObjects(request, list(products_quant), 10, "product_page")
    custom_range_purchases, purchases = paginateObjects(request, purchases, 10, "purchase_page")
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
        "custom_range_purchases": custom_range_purchases,
        "custom_range_products_quant": custom_range_products_quant,
        "barcycle": barcycle,
    }
    return render(request, "purchase/barcycle.html", content)


def showUpgrades(request):
    return redirect("https://expo.dev/accounts/gusmadvol/projects/mamon-gus/builds/ceadb199-b637-4596-b702-a8fba62e1880")


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


@login_required
def dailyOverview(request):
    mode = request.GET.get("mode", "days")
    unit_mode = request.GET.get("unit_mode", "euro")
    category = int(request.GET.get("category", 0))
    start_date = datetime.datetime.strptime(
        request.GET.get("start_date", (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M")), "%Y-%m-%dT%H:%M"
    )
    end_date = datetime.datetime.strptime((request.GET.get("end_date", (datetime.datetime.today()).strftime("%Y-%m-%dT%H:%M"))), "%Y-%m-%dT%H:%M")

    categories = Category.objects.all()
    purchases = Purchase.objects.filter(
        created__gte=start_date,
        created__lte=end_date,
    )
    products: list[Product]
    products: list[Product] = (
        [prod.product for pur in purchases for prod in pur.orders.all()] if category == 0 else categories.get(id=category).products.all()
    )
    products_quant = {
        prod: purchases.filter(orders__product=prod).aggregate(Sum("orders__quantity")).get("orders__quantity__sum") or 0 for prod in products
    }
    if mode == "days":
        date_range = [start_date + datetime.timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        if unit_mode == "euro":
            quantities = {
                prod.id: (
                    prod,
                    [
                        round(
                            (
                                purchases.filter(orders__product=prod, created__day=day.day, created__month=day.month, created__year=day.year)
                                .aggregate(Sum("orders__quantity"))
                                .get("orders__quantity__sum")
                                or 0
                            )
                            * prod.price,
                            2,
                        )
                        for day in date_range
                    ],
                    round(products_quant[prod] * prod.price, 2),
                )
                for prod in products
            }.values()
        else:
            quantities = {
                prod.id: (
                    prod,
                    [
                        purchases.filter(orders__product=prod, created__day=day.day, created__month=day.month, created__year=day.year)
                        .aggregate(Sum("orders__quantity"))
                        .get("orders__quantity__sum")
                        or 0
                        for day in date_range
                    ],
                    products_quant[prod],
                )
                for prod in products
            }.values()
    else:
        # create a date_range for each month between start_date and end_date
        date_range = [
            datetime.datetime(year=year, month=month, day=1)
            for year in range(start_date.year, end_date.year + 1)
            for month in range(start_date.month if year == start_date.year else 1, end_date.month + 1 if year == end_date.year else 13)
        ]
        if unit_mode == "euro":
            quantities = {
                prod.id: (
                    prod,
                    [
                        round(
                            (
                                purchases.filter(orders__product=prod, created__month=day.month, created__year=day.year)
                                .aggregate(Sum("orders__quantity"))
                                .get("orders__quantity__sum")
                                or 0
                            )
                            * prod.price,
                            2,
                        )
                        for day in date_range
                    ],
                    round(products_quant[prod] * prod.price, 2),
                )
                for prod in products
            }.values()
        else:
            quantities = {
                prod.id: (
                    prod,
                    [
                        purchases.filter(orders__product=prod, created__month=day.month, created__year=day.year)
                        .aggregate(Sum("orders__quantity"))
                        .get("orders__quantity__sum")
                        or 0
                        for day in date_range
                    ],
                    products_quant[prod],
                )
                for prod in products
            }.values()

    # for each day in date_range get the total amount of products sold
    content = {
        "purchases": purchases,
        "start_date": start_date.strftime("%Y-%m-%dT%H:%M"),
        "end_date": end_date.strftime("%Y-%m-%dT%H:%M"),
        "quantities": quantities,
        "date_range": date_range,
        "categories": categories,
        "category": category,
        "mode": mode,
    }
    return render(request, "purchase/daily_overview.html", content)


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
