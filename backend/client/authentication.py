from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from rest_framework import exceptions
from django.contrib.auth.models import User

import jwt, re

from .models import ClientApplication
from core.settings import JWT_KEY


class ClientAuthentication(BaseAuthentication):
    def authenticate(self, request):
        encoded_jwt = request.META.get("HTTP_AUTHORIZATION", None)

        # Check validity JWT
        try:
            decoded_jwt = jwt.decode(encoded_jwt, JWT_KEY, algorithms="HS256")
        except jwt.exceptions.DecodeError:
            raise exceptions.AuthenticationFailed("Invalid JWT in header.")

        # Check if ClientApplication exists
        try:
            client_application = ClientApplication.objects.get(identifier=decoded_jwt.get("IDENTIFIER"))
        except (ClientApplication.DoesNotExist, ValidationError):
            raise exceptions.AuthenticationFailed("IDENTIFIER unkown.")

        # Check if URI path is allowed
        for path in decoded_jwt.get("PATHS"):
            try:
                if re.fullmatch(path, request.path):
                    # All give them the theta website user
                    return (client_application.user, None)
            except re.error:
                raise exceptions.AuthenticationFailed("Invalid URL in JWT.PATHS.")
        # No matches
        raise exceptions.AuthenticationFailed("URL not allowed.")
