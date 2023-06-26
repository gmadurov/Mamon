from django.db.models.signals import post_delete, post_save

from users.models import Holder
from .models import Purchase


def PayForPurchse(sender, instance, created, **kwargs):
    # first send something that says when it was created and 2 when it was payed
    purchase = instance
    # print('run', not created and purchase.balance, created , purchase.balance)
    if not created and purchase.balance:
        id = purchase.buyer.id
        holder = Holder.objects.get(id=id)
        # print(holder.stand)
        holder.stand -= round(
            sum([item.quantity * item.product.price for item in purchase.orders.all()]),
            3,
        )
        if holder.stand > 0:
            holder.save()
        else:
            raise ("not enought money")
        # print(holder.stand)


post_save.connect(PayForPurchse, sender=Purchase)
