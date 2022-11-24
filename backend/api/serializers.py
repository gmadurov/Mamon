from rest_framework import serializers
from users.models import Card, Holder, WalletUpgrades
from purchase.models import Happen, Order, Product, Purchase, Category, Report
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


class SimpleHolderSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, holder):
        return holder.user.first_name + " " + holder.user.last_name

    class Meta:
        model = Holder
        # fields = "__all__"
        exclude = ["image_ledenbase", "stand", "image", "user"]


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = "__all__"


# make serializer for Report
class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"


# make walletupdate  serializer
class WalletUpgradesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletUpgrades
        fields = "__all__"


class CardSerializer(serializers.ModelSerializer):
    holder = HolderSerializer()

    class Meta:
        model = Card
        fields = "__all__"


class HappenSerializer(serializers.ModelSerializer):
    participants = SimpleHolderSerializer(many=True)
    deducted_from = SimpleHolderSerializer(many=True, read_only=True)
    date = serializers.DateTimeField(format="%d-%m-%Y, %H:%M")
    opening_date = serializers.DateTimeField(format="%d-%m-%Y, %H:%M")
    closing_date = serializers.DateTimeField(format="%d-%m-%Y, %H:%M")

    active = serializers.BooleanField(read_only=True)

    def create(self, validated_data:list[str]):
        # removing the participants ids from the about to be created Hap obj
        parts =validated_data.pop("participants") 
        print(type(parts) == list, type(parts[0]) == int)
        participants = (
            parts
            if type(parts) == list and type(parts[0]) == int
            else [participiant.popitem()[1] for participiant in parts]
        )
        print("apiSerializer", participants)
        # getting the participant objs
        participants = tuple(Holder.objects.filter(ledenbase_id__in=participants))
        # creating the Courier object
        hap = Happen.objects.create(**validated_data)
        # adding the regions relations to it
        hap.participants.add(*participants)
        return hap

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.date = validated_data.get("date", instance.date)
        instance.opening_date = validated_data.get("opening_date", instance.opening_date)
        instance.closing_date = validated_data.get("closing_date", instance.closing_date)
        # removing the participants ids from the about to be created Hap obj
        participants = validated_data.pop("regions", None)
        # getting the participant objs
        participants = tuple(Holder.objects.filter(id__in=participants))
        instance.participants.add(*participants)
        return instance

    class Meta:
        model = Happen
        fields = "__all__"
        depth = 1
