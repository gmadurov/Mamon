import os
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def fill_token(token, user):
    # Add custom claims
    token["name"] = user.holder.name
    # print(user, user.lid, user.lid.name)
    token["roles"] = [group.name for group in user.groups.all()]
    token["image"] = user.personel.image_url
    token["nickname"] = user.personel.nickname
    # print('RefreshToken', token)
    return token


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return fill_token(token, user)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class MyTokenRefreshPairSerializer(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return fill_token(token, user)


class MyRefreshPairView(TokenRefreshView):
    serializer_class = MyTokenRefreshPairSerializer
    