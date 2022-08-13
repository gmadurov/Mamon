from operator import mod
from re import U
from django.db import models
from colorfield.fields import ColorField

from users.models import Holder

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.FloatField(default=0)
    color = ColorField(default="#FF0000")

    def __str__(self):
        return str(self.name) + ", €" + str(self.price)


class Purchase(models.Model):
    buyer = models.ForeignKey(
        Holder,
        on_delete=models.SET(Holder),
    )
    payed = models.BooleanField(default=False)
    orders = models.ManyToManyField("Order", related_name="ordered")

    def __str__(self):
        return (
            str(self.buyer.name)
            + ", €"
            + str(
                sum([item.quantity * item.product.price for item in self.orders.all()])
            )
        )


class Order(models.Model):
    # purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return str(self.quantity) + " " + str(self.product)
