from django.db.models.signals import post_delete, post_save
from django.contrib.auth.models import User

from purchase.models import HapPayment
from .models import Holder, WalletUpgrades


def create_stand(sender, instance, created, **kwargs):
    if created:
        Holder.objects.create(user=instance, stand=0)
        user = instance
        if user.first_name:
            user.first_name = user.username[0]
        if user.last_name:
            user.last_name = user.username[1:]
        user.save()


def update_wallet(sender, instance, created, **kwargs):
    if created:
        holder = instance.holder
        holder.stand += instance.amount
        holder.save()


def charge_happen(sender, instance, created, **kwargs):
    if created:
        holder = instance.holder
        holder.stand -= instance.happen.cost * instance.quantity
        holder.save()


# post_save.connect(create_stand, sender=User)
post_save.connect(update_wallet, sender=WalletUpgrades)
post_save.connect(charge_happen, sender=HapPayment)
