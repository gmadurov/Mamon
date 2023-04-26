from django.test import TestCase
from .models import Product, Stock
from users.tests import BaseCase

# Create your tests here.


class InventoryBaseTest(BaseCase):
    def setUp(self):
        super().setUp()

        self.master_stock_units = Stock.objects.create(name="master_stock_units", units="units", quantity=100)
        self.master_stock_liters = Stock.objects.create(name="master_stock_liters", units="liters", quantity=100)
        self.master_stock_bottles = Stock.objects.create(name="master_stock_bottles", units="bottles", quantity=100)

        # creating products
        self.product_1 = Product.objects.create(name="product_1", price=1.00, master_stock=self.master_stock_units, units=1)
        self.product_2 = Product.objects.create(name="product_2", price=2.00, master_stock=self.master_stock_liters, units=1)
        self.product_3 = Product.objects.create(name="product_3", price=3.00, master_stock=self.master_stock_bottles, units=1)
        self.product_40 = Product.objects.create(name="product_40", price=40.00, master_stock=self.master_stock_liters, units=1)
        self.product_50 = Product.objects.create(name="product_50", price=50.00, master_stock=self.master_stock_units, units=1)
