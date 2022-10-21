from django.db import models

# Create your models here.
from django.contrib.auth.models import User


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
        return str(self.user.first_name or "" + " " + self.user.last_name or "")

    def __str__(self):
        try:
            return (
                str(self.user.first_name + " " + self.user.last_name)
                + ", €"
                + str(self.stand)
            )
        except:
            return "Holder"


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
    def name(self):
        return str(self.user.first_name + " " + self.user.last_name)

    def __str__(self):
        try:
            return str(self.user.first_name + " " + self.user.last_name) + " (Personel)"
        except:
            return "Personel"
