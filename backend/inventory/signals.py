from django.db.models.signals import post_delete, post_save, m2m_changed
from inventory.models import StockMutations, Order

from users.models import Holder
from purchase.models import Purchase


def updateStock(sender, instance: Purchase, **kwargs):
    purchase = instance
    order: Order
    
    for order in purchase.orders.all():
        if order.product.master_stock:
            order.product.master_stock.quantity -= order.quantity * order.product.units
            order.product.master_stock.save()


# post_save.connect(updateStock, sender=Purchase)
m2m_changed.connect(updateStock, sender=Purchase.orders.through)


def updateStock_from_mutation(sender, instance, created, **kwargs):
    if created:
        stock = instance.stock
        stock.quantity += instance.quantity
        stock.save()


post_save.connect(updateStock_from_mutation, sender=StockMutations)
