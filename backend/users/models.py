from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.


class Holder(models.Model):
    """stand, user{first_name, last_name}"""

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stand = models.FloatField(default=0.0)
    ledenbase_id = models.IntegerField(default=0, null=True, blank=True)
    image = models.ImageField(
        upload_to="holder/",
        null=True,
        blank=True,
        default="holder/user-default.jpg",
    )
    image_ledenbase = models.CharField(max_length=100, null=True, blank=True)

    @property
    def name(self):
        return str(self.user.first_name + " " + self.user.last_name)

    def __str__(self):
        try:
            return (
                str(self.user.first_name + " " + self.user.last_name)
                + ", €"
                + str(self.stand)
            )
        except:
            return "Holder"

    @property
    def image_url(self):
        try:
            return self.image.url
        except:
            if self.image_ledenbase:
                return self.image_ledenbase
            return settings.MEDIA_URL + "holder/user-default.jpg"


class Personel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=15)
    image = models.ImageField(
        upload_to="personel/",
        null=True,
        blank=True,
        default="personel/user-default.jpg",
    )

    @property
    def image_url(self):
        try:
            return self.image.url
        except:
            return settings.MEDIA_URL + "personel/user-default.jpg"

    @property
    def name(self):
        return str(self.user.first_name + " " + self.user.last_name)

    def __str__(self):
        try:
            return str(self.user.first_name + " " + self.user.last_name) + " (Personel)"
        except:
            return "Personel"


class WalletUpgrades(models.Model):
    holder = models.ForeignKey(Holder, on_delete=models.CASCADE)
    seller = models.ForeignKey(Personel, on_delete=models.CASCADE)
    amount = models.FloatField()
    refund = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.holder.name) + " upgraded wallet with €" + str(self.amount)


class Card(models.Model):
    holder = models.ForeignKey(Holder, on_delete=models.CASCADE)
    card_id = models.CharField(max_length=50, unique=True)
    card_name = models.CharField(max_length=15)

    def __str__(self):
        return str(self.holder.name) + " has card " + str(self.card_name)
