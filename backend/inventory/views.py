from django.shortcuts import render
import datetime
from users.forms import PersonelForm
from purchase.forms import ProductForm
from django.contrib import messages

from users.models import Holder, Personel, WalletUpgrades
from purchase.utils import paginateObjects
from django.db.models import Sum
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth.decorators import login_required
from .models import Order, Product,  Category
from purchase.models import  Barcycle, Purchase
# Create your views here.
# Create your views here.
@login_required(login_url="login")
def showProducts(request):
    products = Product.objects.all()
    orders = Order.objects.all()
    #   find how many of each product a request user has bought
    quantity = {
        prod.id: orders.filter(ordered__in=request.user.holder.purchases.all()).filter(product=prod).aggregate(Sum("quantity")).get("quantity__sum") or 0
        for prod in products
    }
    custom_range, products = paginateObjects(request, list(products), 10, "product_page")

    content = {
        "products": products,
        "quantity": quantity,
        "custom_range": custom_range,
    }
    return render(request, "purchase/products.html", content)



@login_required(login_url="login")
def showProductOverviews(request, pk):
    product = Product.objects.get(id=pk)
    start_date = datetime.datetime.strptime(
        request.GET.get("start_date", (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M")), "%Y-%m-%dT%H:%M"
    )
    end_date = datetime.datetime.strptime((request.GET.get("end_date", (datetime.datetime.today()).strftime("%Y-%m-%dT%H:%M"))), "%Y-%m-%dT%H:%M")

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
def toggle_product_activity(request, pk=None):
    product = get_object_or_404(Product, pk=pk)
    product.active = not product.active
    product.save()
    # return to last page
    return redirect(request.META.get("HTTP_REFERER"))

@login_required
def product_create(request):
    form = ProductForm()
    if request.method == "POST":
        form = ProductForm(data=request.POST)
        if form.is_valid():
            product = form.save()
            return redirect("product", pk=product.pk)
        else:
            messages.error(request, form.errors)
    return render(request, "purchase/product_form.html", {"form": form})
