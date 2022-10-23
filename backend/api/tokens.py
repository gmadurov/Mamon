import os
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["name"] = user.holder.name
        # print(user, user.lid, user.lid.name)
        token["roles"] = [group.name for group in user.groups.all()]
        try:
            token["holder_id"] = user.holder.id
        except:
            token["holder_id"] = None
        try:
            token["personel_id"] = user.personel.id
        except:
            token["personel_id"] = None
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
