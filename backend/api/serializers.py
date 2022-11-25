from collections import OrderedDict
from rest_framework import serializers
from users.models import Card, Holder, WalletUpgrades
from purchase.models import HapOrder, Happen, Order, Product, Purchase, Category, Report
from django.contrib.auth.models import User

from django.shortcuts import get_list_or_404


def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


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


class HapPaymentHolderSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, holder):
        return holder.user.first_name + " " + holder.user.last_name

    class Meta:
        model = Holder
        # fields = "__all__"
        exclude = ["image_ledenbase", "stand", "image", "user"]


# class HapOrderHolderSerializer(serializers.ModelSerializer):
#     holder = SimpleHolderSerializer(read_only=True)
#     holder_ledenbase_id = serializers.SerializerMethodField()

#     def get_holder_ledenbase_id(self, obj):
#         return obj.holder.ledenbase_id

#     class Meta:
#         model = HapOrder
#         fields = "__all__"
#         # exclude = ["happen"]


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


class HapOrderHolderSerializer(serializers.ModelSerializer):
    holder = SimpleHolderSerializer()
    # holder_ledenbase_id = serializers.IntegerField(source="holder.ledenbase_id")

    def get_holder_ledenbase_id(self, obj):
        return obj.holder.ledenbase_id

    def validate_holder_ledenbase_id(self, value):
        holder = Holder.objects.filter(ledenbase_id=value)
        return bool(holder)

    def create(self, validated_data):
        print("validated_data", validated_data)
        holder = Holder.objects.get(ledenbase_id=validated_data["holder"]["ledenbase_id"])
        validated_data["holder"] = holder
        return HapOrder.objects.create(**validated_data)

    class Meta:
        model = HapOrder
        # fields = "__all__"
        exclude = ["happen"]


class HappenSerializer(serializers.ModelSerializer):
    def create(self, validated_data: list[str]):
        # removing the participants ids from the about to be created Hap obj
        print("Happen", validated_data)
        participants = validated_data.pop("haporder_set", [])
        print("partici", participants)
        # creating the Courier object
        hap = Happen.objects.create(**validated_data)
        if participants:
            # getting the participant objs
            holders = get_list_or_404(Holder, ledenbase_id__in=[participant.get("holder").get('ledenbase_id') for participant in participants])
            # adding the regions relations to it
            participants = tuple(
                hap.haporder_set.create(
                    holder=list(filter(lambda holder: holder.ledenbase_id == participant.get("holder").get('ledenbase_id'), holders))[0],
                    comment=participant.get("comment"),
                    quantity=participant.get("quantity"),
                )
                for participant in participants
            )
            print(participants)

        return hap

    def update(self, instance: Happen, validated_data):
        if instance.is_editabled():
            instance.title = validated_data.get("title", instance.title)
            instance.description = validated_data.get("description", instance.description)
            instance.date = validated_data.get("date", instance.date)
            instance.opening_date = validated_data.get("opening_date", instance.opening_date)
            instance.closing_date = validated_data.get("closing_date", instance.closing_date)
            instance.max_participants = validated_data.get("max_participants", instance.max_participants)
            instance.cost = validated_data.get("cost", instance.cost)
            if validated_data.get("haporder_set"):
                # removing the participants ids from the about to be created Hap obj
                participants = validated_data.pop("haporder_set")
                # getting the participant objs
                holders = get_list_or_404(Holder, ledenbase_id__in=[participant.get("holder").get('ledenbase_id') for participant in participants])
                participants = tuple(
                    HapOrder.objects.get_or_create(
                        holder=list(filter(lambda holder: holder.ledenbase_id == participant.get("holder").get('ledenbase_id'), holders))[0],
                        happen_id=instance.id,
                        comment=participant.get("comment"),
                        quantity=participant.get("quantity"),
                    )[0]
                    for participant in participants
                )
                instance.haporder_set.set(participants, bulk=True, clear=True)
            else:
                instance.haporder_set.all().delete()
                print("no participants")

        return instance

    class Meta:
        model = Happen
        fields = "__all__"
        read_only_fields = ["deducted_from"]
        # exclude = ["participants"]

    deducted_from = SimpleHolderSerializer(many=True, read_only=True)
    date = serializers.DateTimeField()
    opening_date = serializers.DateTimeField()
    closing_date = serializers.DateTimeField()
    active = serializers.BooleanField(read_only=True)
    participants = HapOrderHolderSerializer(many=True, source="haporder_set")
