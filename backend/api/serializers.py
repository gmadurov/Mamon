from django.shortcuts import get_object_or_404
from rest_framework import serializers
from users.models import Card, Holder, Personel, WalletUpgrades
from purchase.models import HapOrder, HapPayment, Happen, Purchase, Report
from inventory.models import Category, Order, Product
from django.contrib.auth.models import User


def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class PersonelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personel
        fields = "__all__"

    # disable the create method
    def create(self, validated_data):
        pass


class ProductSerializer(serializers.ModelSerializer):
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def update(self, instance: Product, validated_data: dict):
        "you should only be able to update the name and color of a product"
        instance.name = validated_data.get("name", instance.name)
        instance.color = validated_data.get("color", instance.color)
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    holder = serializers.SerializerMethodField()
    personel = serializers.SerializerMethodField()
    nickname = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    def get_name(self, user: User):
        return user.first_name + " " + user.last_name

    def get_nickname(self, user: User):
        personel = Personel.objects.filter(user=user).first()
        return personel.nickname if personel else None

    def get_personel(self, user: User):
        personel = Personel.objects.filter(user=user).first()
        return personel.id if personel else None

    def get_holder(self, user: User):
        holder = Holder.objects.get(user=user)
        return holder.id

    image_url = serializers.SerializerMethodField()

    def get_image_url(self, user: User):
        request = self.context.get("request")
        return request.build_absolute_uri(Personel.objects.filter(user=user).first().image_url if Personel.objects.filter(user=user).first() else "")

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "holder", "personel", "nickname", "image_url", "name"]


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


class PurchaseSerializer(serializers.ModelSerializer):
    buyer = HolderSerializer(read_only=True)
    seller = PersonelSerializer(read_only=True)

    buyer = serializers.IntegerField(write_only=True)

    def validate_buyer(self, value):
        return Holder.objects.get(id=value)

    def create(self, validated_data):
        orders = validated_data.pop("orders")
        purchase = Purchase.objects.create(seller=self.context.get("request").user.personel, **validated_data)
        for order in orders:
            order, created = Order.objects.get_or_create(quantity=order.get("quantity"), product=order.get("product"))
            purchase.orders.add(order)
        return purchase

    orders = OrderSerializer(many=True)

    class Meta:
        model = Purchase
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True)

    class Meta:
        model = Category
        fields = "__all__"

    def create(self, validated_data):
        products = validated_data.pop("products")
        category = Category.objects.create(**validated_data)
        for product in products:
            product = Product.objects.get(id=product.id)
            category.products.add(product)
        return category


class ReportSerializer(serializers.ModelSerializer):
    personel = PersonelSerializer(read_only=True)

    class Meta:
        model = Report
        fields = "__all__"

    def create(self, validated_data):
        return super().create(dict(personel=self.context.get("request").user.personel, **validated_data))


# make walletupdate  serializer
class WalletUpgradesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletUpgrades
        fields = "__all__"

    holder = SimpleHolderSerializer()
    #  dont create new personel

    # holder = serializers.IntegerField(write_only=True)
    # personel = serializers.IntegerField(write_only=True, required=False)

    # def validate_personel(self, value):
    #     return Personel.objects.get(id=value.id)

    def create(self, validated_data):
        holder = validated_data.pop("holder")
        holder = Holder.objects.get(ledenbase_id=holder.get("ledenbase_id"))
        return super().create(dict(holder=holder, **validated_data))


class CardSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Card
        fields = "__all__"

    def create(self, validated_data):
        if self.context.get("request").path == "/api/cards/":
            return super().create(dict(user=self.context.get("request").user, **validated_data))
        return super().create(validated_data)


class HapPaymentHolderSerializer(serializers.ModelSerializer):
    holder = SimpleHolderSerializer()

    class Meta:
        model = HapPayment
        fields = "__all__"
        # exclude = ["holder"]


class HapOrderHolderSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        hap = get_object_or_404(Happen, id=validated_data.pop("happen"))
        holder = Holder.objects.get(ledenbase_id=validated_data.get("holder").get("ledenbase_id"))
        if not holder in hap.participants.all():
            validated_data["holder"] = holder
            validated_data["happen"] = hap
            return HapOrder.objects.create(**validated_data)
        else:
            hap.participants.remove(holder)
            validated_data["holder"] = holder
            validated_data["happen"] = hap
            return HapOrder.objects.create(**validated_data)

    holder = SimpleHolderSerializer()

    def validate_holder(self, value):
        try:
            holder = Holder.objects.get(ledenbase_id=value.get("ledenbase_id"))
            return value
        except:
            raise serializers.ValidationError(f"Holder with ledenbase id {value.get('ledenbase_id')} does not exist")

    class Meta:
        model = HapOrder
        exclude = ["happen"]


class HappenSerializer(serializers.ModelSerializer):
    def create(self, validated_data: list[str]):
        # removing the participants ids from the about to be created Hap obj
        # print("here", validated_data)
        participants = validated_data.pop("haporder_set", [])
        # creating the Courier object
        hap = Happen.objects.create(**validated_data)

        if participants:
            hapOrder = HapOrderHolderSerializer(data=participants, many=True)
            if hapOrder.is_valid(True):
                hapOrder.save(happen=hap)
            else:
                raise serializers.ValidationError("HapOrder is not valid")
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
                hapOrder = HapOrderHolderSerializer(data=participants, many=True)
                if hapOrder.is_valid(True):
                    hapOrder.save(happen=instance)
            else:
                instance.haporder_set.all().delete()

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
    participants = HapOrderHolderSerializer(many=True, source="haporder_set", required=False)
