from operator import mod

# from re import U
# import uuid
from django.db import models
from colorfield.fields import ColorField

from users.models import Holder, Personel

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.FloatField(default=0)
    color = ColorField(default="#FF0000")

    def __str__(self):
        return str(self.name) + ", €" + str(self.price)


class Category(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField(null=True, blank=True)
    products = models.ManyToManyField(
        Product,
        related_name="cat_products",
        blank=True,
    )

    def __str__(self):
        return str(self.name)


class Purchase(models.Model):
    buyer = models.ForeignKey(
        Holder,
        on_delete=models.SET(Holder),
    )
    payed = models.BooleanField(default=False)
    orders = models.ManyToManyField("Order", related_name="ordered")

    created = models.DateTimeField(auto_now_add=True)
    # id = models.UUIDField(
    #     default=uuid.uuid4, unique=True, primary_key=True, editable=False
    # )

    def __str__(self):
        return (
            str(self.buyer.name)
            + ", €"
            + str(
                sum([item.quantity * item.product.price for item in self.orders.all()])
            )
        )

    class Meta:
        ordering = ["-created"]


class Order(models.Model):
    # purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return str(self.quantity) + " " + str(self.product)


class Report(models.Model):
    # bar_cycle = models.ForeignKey("Barcycle", verbose_name=("bar cycle"), on_delete=models.CASCADE)
    ACTIONS = (("Open", "Open"), ("Close", "Close"))
    date = models.DateField(auto_now_add=True)
    personel = models.ForeignKey(
        Personel, verbose_name=("creator"), on_delete=models.CASCADE
    )
    action = models.CharField(("action"), choices=ACTIONS, max_length=50)
    total_cash = models.FloatField(("total Cash"))
    flow_meter1 = models.IntegerField(("flow meter 1"))
    flow_meter2 = models.IntegerField(("flow meter 2"))
    comment = models.TextField(("comment"), null=True, blank=True)

    def __str__(self):
        return f"{self.personel.name}, {self.date.isoformat()} {self.action}"


class Barcycle(models.Model):
    opening_report = models.OneToOneField(
        Report,
        verbose_name=("opening_report"),
        on_delete=models.CASCADE,
        related_name="opening",
    )
    closing_report = models.OneToOneField(
        Report,
        verbose_name=("closing_report"),
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="closing",
    )

    @property
    def purchases(self):
        purchase = Purchase.objects.distinct().filter(
            Q(created__gte=self.opening_report.date)
            | Q(created__lte=self.closing_report.date)
        )
        return purchase
