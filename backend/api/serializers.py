from rest_framework import serializers
from users.models import Holder
from purchase.models import Order, Product, Purchase
from django.contrib.auth.models import User


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True)

    class Meta:
        model = Purchase
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class HolderSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    name = serializers.ReadOnlyField()
    class Meta:
        model = Holder
        fields = "__all__"