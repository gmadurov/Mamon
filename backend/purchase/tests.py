from time import sleep
import unittest
from inventory.tests import InventoryBaseTest
from inventory.models import Order, Product
from .models import Purchase

# Create your tests here.


class PurchaseTest(InventoryBaseTest):
    def setUp(self):
        super().setUp()
        # add standen to holders
        self.holder_1.stand = 1000
        self.holder_1.save()
        self.holder_2.stand = 1000
        self.holder_2.save()
        self.holder_3.stand = 1000
        self.holder_3.save()

        # creating orders
        self.order_prod_1 = Order.objects.create(product=self.product_1, quantity=3)
        self.order_prod_2 = Order.objects.create(product=self.product_2, quantity=2)
        self.order_prod_3 = Order.objects.create(product=self.product_3, quantity=3)
        self.order_prod_40 = Order.objects.create(product=self.product_40, quantity=2)
        self.order_prod_50 = Order.objects.create(product=self.product_50, quantity=1)

        # creating
        self.purchase_1 = Purchase.objects.create(buyer=self.holder_1, seller=self.personel_tapper, balance=True)
        self.purchase_3 = Purchase.objects.create(buyer=self.holder_1, seller=self.personel_website, balance=True)
        self.purchase_2 = Purchase.objects.create(buyer=self.holder_2, seller=self.personel_praeses_imperfectus, balance=True)
        self.purchase_40 = Purchase.objects.create(buyer=self.holder_3, seller=self.personel_tapper, balance=True)
        self.purchase_50 = Purchase.objects.create(buyer=self.holder_3, seller=self.personel_tapper, balance=True)
        self.purchase_2_orders = Purchase.objects.create(buyer=self.holder_2, seller=self.personel_tapper, balance=True)
        self.purchase_3_orders = Purchase.objects.create(buyer=self.holder_1, seller=self.personel_tapper, balance=True)
        self.purchase_5_orders = Purchase.objects.create(buyer=self.holder_3, seller=self.personel_tapper, balance=True)

        self.purchase_1.orders.set([self.order_prod_1])
        self.purchase_2.orders.set([self.order_prod_2])
        self.purchase_3.orders.set([self.order_prod_3])
        self.purchase_40.orders.set([self.order_prod_40])
        self.purchase_50.orders.set([self.order_prod_50])
        self.purchase_2_orders.orders.set([self.order_prod_1, self.order_prod_2])
        self.purchase_3_orders.orders.set([self.order_prod_1, self.order_prod_2, self.order_prod_3])
        self.purchase_5_orders.orders.set([self.order_prod_1, self.order_prod_2, self.order_prod_3, self.order_prod_40, self.order_prod_50])

        self.purchase_2.save()
        self.purchase_3.save()
        self.purchase_40.save()
        self.purchase_50.save()
        self.purchase_2_orders.save()
        self.purchase_3_orders.save()
        # self.purchase_5_orders.save()

    def test_product_name(self):
        product_1 = Product.objects.get(id=self.product_1.id)
        product_2 = Product.objects.get(id=self.product_2.id)
        product_3 = Product.objects.get(id=self.product_3.id)
        self.assertEqual(product_1.__str__(), "product_1 €(1.0)")
        self.assertEqual(product_2.__str__(), "product_2 €(2.0)")
        self.assertEqual(product_3.__str__(), "product_3 €(3.0)")

    def test_order_costs(self):
        order_prod_1 = Order.objects.get(id=self.order_prod_1.id)
        order_prod_2 = Order.objects.get(id=self.order_prod_2.id)
        order_prod_3 = Order.objects.get(id=self.order_prod_3.id)
        order_prod_40 = Order.objects.get(id=self.order_prod_40.id)
        order_prod_50 = Order.objects.get(id=self.order_prod_50.id)
        self.assertEqual(order_prod_1.cost, 3.00)
        self.assertEqual(order_prod_2.cost, 4.00)
        self.assertEqual(order_prod_3.cost, 9.00)
        self.assertEqual(order_prod_40.cost, 80.00)
        self.assertEqual(order_prod_50.cost, 50.00)

    def test_purchase_totals(self):
        purchase_1 = Purchase.objects.get(id=self.purchase_1.id)
        purchase_2 = Purchase.objects.get(id=self.purchase_2.id)
        purchase_3 = Purchase.objects.get(id=self.purchase_3.id)
        purchase_40 = Purchase.objects.get(id=self.purchase_40.id)
        purchase_50 = Purchase.objects.get(id=self.purchase_50.id)
        purchase_2_orders = Purchase.objects.get(id=self.purchase_2_orders.id)
        purchase_3_orders = Purchase.objects.get(id=self.purchase_3_orders.id)
        purchase_5_orders = Purchase.objects.get(id=self.purchase_5_orders.id)

        self.assertEqual(purchase_1.total, 3.00)
        self.assertEqual(purchase_2.total, 4.00)
        self.assertEqual(purchase_3.total, 9.00)
        self.assertEqual(purchase_40.total, 80.00)
        self.assertEqual(purchase_50.total, 50.00)
        self.assertEqual(purchase_2_orders.total, 7.00)
        self.assertEqual(purchase_3_orders.total, 16.00)
        self.assertEqual(purchase_5_orders.total, 146.00)

    def test_purchase_balance(self):

        purchase_1 = Purchase.objects.get(id=self.purchase_1.id)
        purchase_2 = Purchase.objects.get(id=self.purchase_2.id)
        purchase_3 = Purchase.objects.get(id=self.purchase_3.id)
        purchase_40 = Purchase.objects.get(id=self.purchase_40.id)
        purchase_50 = Purchase.objects.get(id=self.purchase_50.id)
        purchase_2_orders = Purchase.objects.get(id=self.purchase_2_orders.id)
        purchase_3_orders = Purchase.objects.get(id=self.purchase_3_orders.id)
        purchase_5_orders = Purchase.objects.get(id=self.purchase_5_orders.id)

        self.assertEqual(purchase_1.balance, True)
        self.assertEqual(purchase_2.balance, True)
        self.assertEqual(purchase_3.balance, True)
        self.assertEqual(purchase_40.balance, True)
        self.assertEqual(purchase_50.balance, True)
        self.assertEqual(purchase_2_orders.balance, True)
        self.assertEqual(purchase_3_orders.balance, True)
        self.assertEqual(purchase_5_orders.balance, True)
