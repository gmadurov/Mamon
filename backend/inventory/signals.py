from django.db.models.signals import post_delete, post_save
from inventory.models import StockMutations

from users.models import Holder
from purchase.models import Purchase


def updateStock(sender, instance, created, **kwargs):
    purchase = instance
    if created:
        for order in purchase.orders.all():
            order.product.stock -= order.quantity
            order.product.save()


post_save.connect(updateStock, sender=Purchase)


def updateStock_from_mutation(sender, instance, created, **kwargs):
    if created:
        stock = instance.stock
        stock.quantity += instance.quantity
        stock.save()

post_save.connect(updateStock_from_mutation, sender=StockMutations)
