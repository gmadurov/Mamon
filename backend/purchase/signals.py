from django.db.models.signals import post_delete, post_save

from users.models import Holder
from .models import Purchase


def PayForPurchse(sender, instance, created, **kwargs):
    # first send something that says when it was created and 2 when it was payed
    purchase = instance
    if not created and purchase.payed:
        id = purchase.buyer.id
        holder = Holder.objects.get(id=id)
        holder.stand -= round(
            sum([item.quantity * item.product.price for item in purchase.orders.all()]),
            3,
        )
        if holder.stand > 0:
            holder.save()
        else:
            raise ("not enought money")


post_save.connect(PayForPurchse, sender=Purchase)
