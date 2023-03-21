from datetime import datetime
import json
import os
import pprint

import requests
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt

from django.db.models import Sum
from django.urls import reverse
from purchase.models import Order, Product, Purchase
from purchase.utils import paginateObjects
from .forms import MolliePaymentsForm

from .models import Holder, MolliePayments, Personel, WalletUpgrades
from core.settings import mollie_client


"""This page is for what the users see it is personal info"""


def landing(reqeust):
    return render(reqeust, "users/landing.html")


@login_required(login_url="login")
def home(request):
    user = Holder.objects.get(user=request.user)
    purchases = user.purchases.all()
    custom_range, purchases = paginateObjects(request, list(purchases), 10, "purchase_page")
    content = {
        "user": user,
        "purchases": purchases,
        "custom_range": custom_range,
    }
    return render(request, "users/home.html", content)


@login_required(login_url="login")
def paymentUpgrade(request):
    form = MolliePaymentsForm()
    if request.method == "POST":
        form = MolliePaymentsForm(request.POST)
        if form.is_valid():
            molliePayment = form.save(commit=False)
            molliePayment.holder = request.user.holder
            body = {
                "amount": {"currency": "EUR", "value": f"{molliePayment.amount:.2f}"},
                "description": f"Mamon | Wallet Opwarderen  €{molliePayment.amount:.2f}",
                "redirectUrl": request.build_absolute_uri(reverse("mollie-return", args=[str(molliePayment.identifier)])),
                "webhookUrl": request.build_absolute_uri(reverse("mollie-webhook", args=[str(molliePayment.identifier)])),
                "method": ["applepay", "creditcard", "ideal"],
                "metadata": {"identifier": str(molliePayment.identifier)},
            }
            payment = mollie_client.payments.create(body)
            molliePayment.payment_id = payment.id
            molliePayment.expiry_date = payment.get("expiresAt")
            molliePayment.save()
            return redirect(payment.checkout_url)

    content = {"form": form}
    return render(request, "users/paymentUpgrade.html", content)


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
def showProduct(request, pk):
    product = Product.objects.get(id=pk)
    purchases = Purchase.objects.filter(orders__product__id=pk).filter(buyer=request.user.holder)
    content = {
        "product": product,
        "purchases": purchases,
    }
    return render(request, "purchase/product.html", content)
