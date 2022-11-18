import datetime
from operator import mod

# from re import U
# import uuid
from django.db import models
from colorfield.fields import ColorField
from django.db.models import Q

from users.models import Holder, Personel

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.FloatField(default=0)
    color = ColorField(default="#ffdd00")
    active = models.BooleanField(default=True)
    # add image field without category field
    image = models.ImageField(
        upload_to="products/", null=True, blank=True, default="products/default.png"
    )

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
        related_name="purchases",
    )
    seller = models.ForeignKey(
        Personel,
        on_delete=models.SET(Personel),
        related_name="sold",
    )
    payed = models.BooleanField(default=False)
    cash = models.BooleanField(default=False)
    pin = models.BooleanField(default=False)

    orders = models.ManyToManyField("Order", related_name="ordered")

    created = models.DateTimeField(auto_now_add=True)
    remaining_after_purchase = models.FloatField(default=0)

    def __str__(self):
        return (
            str('Total:')
            + " €"
            + str(
                sum([item.quantity * item.product.price for item in self.orders.all()])
            )
        )

    @property
    def total(self):
        return sum([item.quantity * item.product.price for item in self.orders.all()])

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
    ACTIONS = (
        ("Open", "Open"),
        ("Close", "Close"),
        ("Middle", "Middle"),
    )
    date = models.DateTimeField(auto_now_add=True)
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

    @classmethod
    def opening_reports(self):
        return self.filter(action="Open")


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

    # return date as name of object
    def __str__(self):
        if not self.closing_report:
            return f'Open {self.opening_report.date.strftime("%a %d %b %Y, %H:%M:%S")} '
        return f' {self.opening_report.date.strftime("%a %d %b %Y, %H:%M:%S")} - {self.closing_report.date.strftime("%a %d %b %Y, %H:%M:%S")}'

    @property
    def purchases(self):
        # get all purchases that are withing the opning and closing report date range
        return Purchase.objects.filter(
            created__range=[
                self.opening_report.date,
                self.closing_report.date if self.closing_report else datetime.datetime.now(),
            ]
        )

    @property
    def total_dif_cash(self):
        if not self.closing_report:
            return "Available at closing"
        return self.closing_report.total_cash - self.opening_report.total_cash

    @property
    def total_dif_flowmeter1(self):
        if not self.closing_report:
            return "Available at closing"
        return self.opening_report.flow_meter1 - self.closing_report.flow_meter1

    @property
    def total_dif_flowmeter2(self):
        if not self.closing_report:
            return "Available at closing"
        return self.opening_report.flow_meter2 - self.closing_report.flow_meter2

    @property
    def total_sales(self):
        return sum([purchase.total for purchase in self.purchases])

    class Meta:
        ordering = ["-opening_report__date"]
