from django import template
from django.db.models import Sum

register = template.Library()


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
def getOrderInfo(querySet, product):
    return querySet.get(product_id=product).quantity


@register.filter
def multiply(quantity, price):
    return round(quantity * price, 2)


@register.filter
def round_to(amount, sigfigs):
    return round((amount or 0), sigfigs)


@register.filter
def getTotal(purchases, product):
    return sum([purchase.orders.filter(product=product).aggregate(Sum("quantity")).get("quantity__sum") for purchase in purchases])
