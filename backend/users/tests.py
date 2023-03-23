from django.test import TestCase
from django.core import management
from django.contrib.auth.models import User
from .models import MolliePayments, Holder, Personel, WalletUpgrades

# Create your tests here.


class BaseCase(TestCase):
    def setUp(self):
        # delete every entry in the database
        # management.call_command("flush", interactive=False)
        # automated users
        self.user_mollie = User.objects.create(username="mollie", first_name="mollie", last_name="payments")
        self.user_website = User.objects.create(username="website", first_name="website", last_name="theta")
        self.personel_mollie = Personel.objects.create(user=self.user_mollie, nickname="mollie")
        self.personel_website = Personel.objects.create(user=self.user_website, nickname="website")

        # Create users and holders
        self.user_holder_1 = User.objects.create(username="holder_1", first_name="holder", last_name="1")
        self.user_holder_2 = User.objects.create(username="holder_2", first_name="holder", last_name="2")
        self.user_holder_3 = User.objects.create(username="holder_3", first_name="holder", last_name="3")
        self.user_bezoeker = User.objects.create(username="bezoeker", first_name="bezoeker", last_name="1")

        self.holder_1 = Holder.objects.create(user=self.user_holder_1)
        self.holder_2 = Holder.objects.create(user=self.user_holder_2)
        self.holder_3 = Holder.objects.create(user=self.user_holder_3)
        self.holder_bezoeker = Holder.objects.create(user=self.user_bezoeker)
        # create admin users and/or tappers
        self.user_superAdmin = User.objects.create(username="superAdmin", is_superuser=True, is_staff=True, first_name="superAdmin", last_name="1")
        self.user_bestuur = User.objects.create(username="bestuur", is_staff=True, first_name="bestuur", last_name="1")
        self.user_praeses_imperfectus = User.objects.create(username="praeses_imperfectus", is_staff=True, first_name="praeses_imperfectus", last_name="1")
        self.user_tapper = User.objects.create(username="tapper", is_staff=True, first_name="tapper", last_name="1")

        self.personel_superAdmin = Personel.objects.create(user=self.user_superAdmin, nickname="superAdmin")
        self.personel_bestuur = Personel.objects.create(user=self.user_bestuur, nickname="bestuur")
        self.personel_praeses_imperfectus = Personel.objects.create(user_id=self.user_praeses_imperfectus.id, nickname="praeses imp")
        self.personel_tapper = Personel.objects.create(user=self.user_tapper, nickname="tapper")

    def test_user_get(self):
        user_holder_username = User.objects.get(username=self.user_holder_1.username)
        user_holder_id = User.objects.get(id=self.user_holder_1.id)

        self.assertEqual(self.user_holder_1.last_name, user_holder_username.last_name)
        self.assertEqual(self.user_holder_1.first_name, user_holder_username.first_name)
        self.assertEqual(self.user_holder_1.last_name, user_holder_id.last_name)
        self.assertEqual(self.user_holder_1.first_name, user_holder_id.first_name)

    def test_name(self):
        self.assertEqual(self.user_holder_1.first_name, "holder")
        self.assertEqual(self.user_holder_1.last_name, "1")
        self.assertEqual(self.holder_1.name, "holder 1")


class MolliTestCase(BaseCase):
    def setUp(self):
        super().setUp()
        self.payment_1 = MolliePayments.objects.create(holder=self.holder_1, amount=2020_4, comment="Django tests 1", payment_id=1)
        self.payment_2 = MolliePayments.objects.create(holder=self.holder_2, amount=6_8_001, comment="Django tests 2", payment_id=2)
        self.payment_3 = MolliePayments.objects.create(holder_id=self.holder_3.id, amount=23_7_88, comment="Django tests 3", payment_id=3)

    def test_amounts(self):
        self.assertEqual(self.payment_1.amount, 2020_4)
        self.assertEqual(self.payment_2.amount, 6_8_001)
        self.assertEqual(self.payment_3.amount, 23_7_88)


class WalletUpgradesTestCase(BaseCase):
    def setUp(self):
        super().setUp()
        self.wallet_upgrade_1 = WalletUpgrades.objects.create(
            holder=self.holder_1, personel=self.personel_tapper, amount=2020_4, comment="Django tests 1", pin=True
        )
        self.wallet_upgrade_2 = WalletUpgrades.objects.create(
            holder=self.holder_2, personel=self.personel_tapper, amount=6_8_001, comment="Django tests 2", cash=True
        )
        self.wallet_upgrade_3 = WalletUpgrades.objects.create(
            holder=self.holder_3,
            personel=self.personel_tapper,
            amount=23_7_88,
            comment="Django tests 3",
            pin=True,
        )

    def test_attributes(self):
        self.assertEqual(self.wallet_upgrade_1.amount, 2020_4)
        self.assertEqual(self.wallet_upgrade_2.amount, 6_8_001)
        self.assertEqual(self.wallet_upgrade_3.amount, 23_7_88)
        self.assertEqual(self.wallet_upgrade_1.personel, self.personel_tapper)
        self.assertEqual(self.wallet_upgrade_2.personel, self.personel_tapper)
        self.assertEqual(self.wallet_upgrade_3.personel, self.personel_tapper)

    def test_upgraded_stands(self):
        self.assertEqual(self.holder_1.stand, 2020_4)
        self.assertEqual(self.holder_2.stand, 6_8_001)
        self.assertEqual(self.holder_3.stand, 23_7_88)

    