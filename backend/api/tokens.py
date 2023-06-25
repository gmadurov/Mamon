import os, jwt
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserSerializer
from django.contrib.auth.models import User


def fill_token(token, user):
    # Add custom claims
    token["name"] = user.holder.name
    # print(user, user.lid, user.lid.name)
    token["roles"] = [group.name for group in user.groups.all()]
    try:
        image = user.personel.image_url
        nickname = user.personel.nickname
        id = user.personel.id
    except:
        image = ""
        nickname = ""
        id = 0
    token["image"] = image
    token["nickname"] = nickname
    token["personel_id"] = id
    token["username"] = user.username
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

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        decode = jwt.decode(str(response.data.get("refresh")), verify=False)
        user = User.objects.get(id=decode["user_id"])
        user_d = UserSerializer(user, context={"request": request})
        response.data["user"] = dict(
            **user_d.data,
            exp=decode["exp"],
            roles=decode["roles"],
        )
        return response
