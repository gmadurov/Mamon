import datetime
from colorfield.fields import ColorField
from django.db import models

from simple_history.models import HistoricalRecords

# Create your models here.


UNITS = (
    ("units", "units"),
    ("liters", "liters"),
    ("grams", "grams"),
    ("meters", "meters"),
    ("pieces", "pieces"),
    ("bottles", "bottles"),
    ("packs", "packs"),
    ("bags", "bags"),
    ("boxes", "boxes"),
)


class Product(models.Model):
    id: int
    name: models.CharField | str = models.CharField(max_length=50, unique=True)
    price: models.FloatField = models.FloatField(default=0)
    color: ColorField = ColorField(default="#ffdd00")
    active: models.BooleanField = models.BooleanField(default=True)
    # add image field without category field
    image: models.ImageField = models.ImageField(upload_to="products/", null=True, blank=True, default="products/default.png")
    units: models.FloatField = models.FloatField(default=1)
    master_stock: models.ForeignKey["Stock"] = models.ForeignKey("Stock", null=True, blank=True, default=None, on_delete=models.SET_NULL)
    grootboek_waarde: models.TextField = models.TextField(blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name) + f" €({self.price})"

    class Meta:
        verbose_name_plural = "Producten"
        ordering = ["name"]
    
    def total_sales(self):
        total = 0
        order: Order
        for order in self.order_set.all():
            total += order.quantity_product_sold()
        return total * self.price
    


class Category(models.Model):
    id: int
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

    def total_sales(self):
        total = 0
        for product in self.products.all():
            total += product.total_sales()
        return total

class Order(models.Model):
    id: int
    # purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    history = HistoricalRecords()

    @property
    def name(self):
        return str(self.quantity) + " x " + str(self.product)

    def __str__(self):
        return self.name

    @property
    def cost(self):
        return self.quantity * self.product.price
    
    def quantity_product_sold(self):
        # count how many times this has been sold in the past
        return len(self.ordered.all()) * self.quantity 
           
    


class Stock(models.Model):
    id: int
    name: str = models.CharField(max_length=20, unique=True)
    quantity: int = models.FloatField()
    units: models.CharField = models.CharField(choices=UNITS, max_length=10, default="units")
    description: str = models.TextField(blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return f"Stock of {self.name}, {self.quantity} {self.units}"


class StockMutations(models.Model):
    id: int
    stock: Stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity: int = models.FloatField()
    units: models.CharField = models.CharField(choices=UNITS, max_length=10, default="units")
    comment: str = models.TextField(blank=True, null=True)
    date: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    cost: float = models.FloatField(blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return f"Mutation of {self.stock.name}, {self.quantity} {self.units} "
