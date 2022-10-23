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
def getTotal(purchases, product):
    return sum(
        [
            purchase.orders.filter(product=product)
            .aggregate(Sum("quantity"))
            .get("quantity__sum")
            for purchase in purchases
        ]
    )
