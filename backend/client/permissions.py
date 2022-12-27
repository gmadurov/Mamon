from rest_framework.permissions import BasePermission

import jwt

from core.settings import JWT_KEY
from .models import ClientApplication
from models import Token


class AccountTokenPermission(BasePermission):

    def has_permission(self, request, view):
        encoded_jwt = request.META.get('HTTP_AUTHORIZATION', None)
        decoded_jwt = jwt.decode(encoded_jwt, JWT_KEY, algorithms='HS256')
        client_application = ClientApplication.objects.get(identifier=decoded_jwt.get('IDENTIFIER'))
        account_token = request.data.get('token')

        try:
            if client_application == Token.objects.get(token=account_token).client_application:
                return True
            else:
                self.message = "Geen match tussen Header Authorization Token en account Token"
                return False
        except Token.DoesNotExist:
            self.message = "Geen account/persoon gevonden met deze Token."
            return False
