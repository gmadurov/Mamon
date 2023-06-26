import jwt
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import UserSerializer
from django.contrib.auth.models import User


def fill_token(token, user):
    # Add custom claims
    token["name"] = user.holder.name
    token["roles"] = [group.name for group in user.groups.all()]
    try:
        if not user.personel.active:
            raise Exception("Personel is not active")
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
