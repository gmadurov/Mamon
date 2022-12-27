import random
from uuid import uuid4
from django.db import models
from django.utils.safestring import mark_safe
import jwt
from core.settings import JWT_KEY

# Create your models here.


class ClientApplication(models.Model):
    class Meta:
        verbose_name = "client applicatie"
        verbose_name_plural = "client applicaties"

    name = models.CharField(max_length=255, blank=False)

    identifier = models.UUIDField(default=uuid4, unique=True, editable=False)

    paths = models.TextField(
        "paths",
        blank=False,
    )

    def __str__(self):
        return self.name

    def JWT(self):
        try:
            encoded_jwt = str(jwt.encode({"IDENTIFIER": str(self.identifier), "PATHS": self.paths.replace("\n", "").split(",")}, JWT_KEY, algorithm="HS256"))[2:-1]

            return mark_safe(f'<input readOnly="readOnly" type="text" style="width:600px;" value="{encoded_jwt}"/>')
        except TypeError:
            return ""

    JWT.short_description = "JWT"


from users.models import User


class ClientApplicationAdministrator(models.Model):
    class Meta:
        verbose_name = "Administrator"
        verbose_name_plural = "Administrators"

    user = models.ForeignKey(User, verbose_name="user", related_name="client_applications", on_delete=models.CASCADE)
    client_application = models.ForeignKey(
        ClientApplication, verbose_name="client applicatie", related_name="client_application_administrators", on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.user.first_name + " " + self.user.last_name)


UNICODE_ASCII_CHARACTER_SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


class Token(models.Model):
    class Meta:
        verbose_name = "Token"
        verbose_name_plural = "Tokens"

    def generate_token(self):
        rand = random.SystemRandom()
        return "".join(rand.choice(UNICODE_ASCII_CHARACTER_SET) for x in range(40))

    token = models.CharField("token", max_length=40, primary_key=True, editable=False)

    account = models.ForeignKey(User, related_name="client_application_tokens", on_delete=models.CASCADE, blank=False)

    client_application = models.ForeignKey(ClientApplication, related_name="account_tokens", on_delete=models.CASCADE, blank=False)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.token
