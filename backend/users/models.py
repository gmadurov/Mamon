from django.db import models

# Create your models here.
from django.contrib.auth.models import User


# Create your models here.


class Holder(models.Model):
    """stand, user{first_name, last_name}"""

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    stand = models.FloatField(default=0.0)
    ledenbase_id = models.IntegerField(default=0, null=True, blank=True)

    @property
    def name(self):
        return str(self.user.first_name + " " + self.user.last_name)

    def __str__(self):
        return (
            str(self.user.first_name + " " + self.user.last_name)
            + ", €"
            + str(self.stand)
        )
