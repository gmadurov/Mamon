import datetime
from operator import mod

# from re import U
# import uuid
from django.db import models
from colorfield.fields import ColorField
from django.db.models import Q

from users.models import Holder, Personel
import pytz
from simple_history.models import HistoricalRecords


# Create your models here.

utc = pytz.UTC


class Product(models.Model):
    name = models.CharField(max_length=20, unique=True)
    price = models.FloatField(default=0)
    color = ColorField(default="#ffdd00")
    active = models.BooleanField(default=True)
    # add image field without category field
    image = models.ImageField(upload_to="products/", null=True, blank=True, default="products/default.png")
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name) + ", €" + str(self.price)

    class Meta:
        verbose_name_plural = "Producten"


class Category(models.Model):

    name = models.CharField(max_length=20)
    description = models.TextField(null=True, blank=True)
    products = models.ManyToManyField(
        Product,
        related_name="cat_products",
        blank=True,
    )
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = "Categories"


class Purchase(models.Model):
    buyer = models.ForeignKey(Holder, on_delete=models.SET(Holder), related_name="purchases")
    seller = models.ForeignKey(Personel, on_delete=models.SET(Personel), related_name="sold")
    balance = models.BooleanField(default=False)
    cash = models.BooleanField(default=False)
    pin = models.BooleanField(default=False)
    orders = models.ManyToManyField("Order", related_name="ordered")
    
    created = models.DateTimeField(auto_now_add=True)
    remaining_after_purchase = models.FloatField(default=0)
    history = HistoricalRecords()

    def __str__(self):
        return str("Total:") + " €" + str(sum([item.quantity * item.product.price for item in self.orders.all()]))

    @property
    def total(self):
        return sum([item.quantity * item.product.price for item in self.orders.all()])

    class Meta:
        ordering = ["-created"]


class Order(models.Model):
    # purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return str(self.quantity) + " " + str(self.product)

    @property
    def cost(self):
        return self.quantity * self.product.price


class Report(models.Model):
    # bar_cycle = models.ForeignKey("Barcycle", verbose_name=("bar cycle"), on_delete=models.CASCADE)
    ACTIONS = (
        ("Open", "Open"),
        ("Close", "Close"),
        ("Middle", "Middle"),
    )
    date = models.DateTimeField(auto_now_add=True)
    personel = models.ForeignKey(Personel, verbose_name=("creator"), on_delete=models.CASCADE)
    action = models.CharField(("action"), choices=ACTIONS, max_length=50)
    total_cash = models.FloatField(("total Cash"))
    flow_meter1 = models.IntegerField(("flow meter 1"))
    flow_meter2 = models.IntegerField(("flow meter 2"))
    comment = models.TextField(("comment"), null=True, blank=True)
    history = HistoricalRecords()

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
    history = HistoricalRecords()

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


class Happen(models.Model):
    """date title description opening_date closing_date cost max_participants participants deducted_from"""

    date = models.DateTimeField()
    title = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    opening_date = models.DateTimeField()
    closing_date = models.DateTimeField()
    cost = models.FloatField(default=0)
    max_participants = models.IntegerField(default=0)
    participants = models.ManyToManyField(Holder, through="HapOrder", related_name="ingeschreven_happen", blank=True)
    deducted_from = models.ManyToManyField(Holder, through="HapPayment", related_name="payed_for", blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return self.title + " " + self.date.strftime("%a %d %b %Y")

    @property
    def active(self):
        return self.opening_date <= utc.localize(datetime.datetime.now()) and utc.localize(datetime.datetime.now()) <= self.closing_date

    def is_editabled(self):
        return self.closing_date >= utc.localize(datetime.datetime.now())

    def pay(self):
        failed = []
        for happayment in self.haporder_set.all():
            if happayment.holder not in self.deducted_from.all():
                if happayment.holder.stand >= self.cost * happayment.quantity:
                    HapPayment.objects.create(holder=happayment.holder, happen=self, quantity=happayment.quantity)
                else:
                    failed.append(happayment.holder)

        return failed

    class Meta:
        verbose_name = "Hap"
        verbose_name_plural = "Happen"


class HapOrder(models.Model):
    happen = models.ForeignKey(Happen, on_delete=models.CASCADE)
    holder = models.ForeignKey(Holder, on_delete=models.CASCADE)
    # how many are to be deducted from the holder
    quantity = models.IntegerField()
    comment = models.CharField(max_length=30, null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.holder) + " " + str(self.quantity) + " " + str(self.happen)

    @property
    def total(self):
        return self.quantity * self.happen.cost


class HapPayment(models.Model):
    happen = models.ForeignKey(Happen, on_delete=models.CASCADE)
    holder = models.ForeignKey(Holder, on_delete=models.CASCADE)
    # how many were deducted from the holder
    quantity = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return str(self.holder) + " " + str(self.quantity) + " " + str(self.happen)

    @property
    def total(self):
        return self.quantity * self.happen.cost
