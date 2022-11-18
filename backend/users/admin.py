from django.contrib import admin

from .models import Card, Holder, MolliePayments, Personel, WalletUpgrades


class CardAdmin(admin.ModelAdmin):
    list_display = ("__str__", "card_id")
    search_fields = (
        # "holder__user__username",
        # "holder__user__first_name",
        # "holder__user__last_name",
        "card_id",
        # "holder__ledenbase_id",
    )

    def get_readonly_fields(self, request, obj=None):
        return [
            "holder",
            "card_id",
        ]

    def has_delete_permission(self, request, obj=None):
        return False


class HolderAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "image")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "ledenbase_id",
    )
    exclude = ("stand",)

    def get_readonly_fields(self, request, obj=None):
        return [
            "user",
            "ledenbase_id",
        ]

    def has_delete_permission(self, request, obj=None):
        return False


class PersonelAdmin(admin.ModelAdmin):
    list_display = ("user", "nickname", "image")
    search_fields = ("user__username", "user__first_name", "user__last_name")

    def get_readonly_fields(self, request, obj=None):
        return [
            "user",
        ]

    def has_delete_permission(self, request, obj=None):
        return False


# create WalletUpdateAdmin if you want to see the wallet upgrades in the admin
class WalletUpdateAdmin(admin.ModelAdmin):
    list_display = ("__str__", "date", "seller", "refund")
    search_fields = (
        "holder__user__username",
        "holder__user__first_name",
        "holder__user__last_name",
        "holder__ledenbase_id",
    )
    exclude = ("amount",)
    # has no change and delete rights
    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_readonly_fields(self, request, obj=None):
        return [
            "holder",
            "seller",
            "refund",
            "date",
            "cash",
            "pin",
            "molliePayment",
        ]


class MolliePaymentsAdmin(admin.ModelAdmin):
    list_display = ("__str__", "date", "payment_id", "is_paid", "payed_on")
    search_fields = (
        "holder__user__username",
        "holder__user__first_name",
        "holder__user__last_name",
        "holder__ledenbase_id",
        "payment_id",
        "payed_on",
        "is_paid",
        "identifier",
    )
    exclude = ("amount",)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [
                "date",
                "payment_id",
                "payed_on",
                "expiry_date",
                "is_paid",
                "holder",
            ]
        else:
            return [
                "is_paid",
                "payment_id",
                "date",
            ]

    def has_delete_permission(self, request, obj=None):
        return False


# Register your models here.
admin.site.register(Holder, HolderAdmin)
admin.site.register(Personel, PersonelAdmin)

admin.site.register(WalletUpgrades, WalletUpdateAdmin)
admin.site.register(Card, CardAdmin)

admin.site.register(MolliePayments, MolliePaymentsAdmin)
