from rest_framework import serializers
from users.models import Holder
from purchase.models import Order, Product, Purchase, Category
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
    # image_url = serializers.SerializerMethodField()

    # def get_image_url(self, obj):
    #     request = self.context.get("request")
    #     return request.build_absolute_uri(obj.image.url)

    class Meta:
        model = Product
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]


class HolderSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image_url)

    def get_name(self, holder):
        return holder.user.first_name + " " + holder.user.last_name

    class Meta:
        model = Holder
        # fields = "__all__"
        exclude = [
            "image_ledenbase",
        ]


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = "__all__"
