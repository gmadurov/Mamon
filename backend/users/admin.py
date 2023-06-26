from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin

from .models import Card, Holder, MolliePayments, Personel, WalletUpgrades

# admin.site.login_form =
# admin.site.


class CardAdmin(admin.ModelAdmin):
    list_display = ("__str__", "card_id")
    search_fields = (
        # "holder__user__username",
        # "holder__user__first_name",
        # "holder__user__last_name",
        "card_id",
        # "holder__ledenbase
    )
    autocomplete_fields = ["user"]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [
                "user",
                "card_id",
            ]
        return [
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
    autocomplete_fields = ["user"]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [
                "user",
                "ledenbase_id",
            ]
        return []

    def has_delete_permission(self, request, obj=None):
        return False


class PersonelAdmin(admin.ModelAdmin):
    list_display = ("user", "nickname", "image")
    search_fields = ("user__username", "user__first_name", "user__last_name")
    autocomplete_fields = ["user"]
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return [
                "user",
            ]
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        return False


# create WalletUpdateAdmin if you want to see the wallet upgrades in the admin
class WalletUpdateAdmin(admin.ModelAdmin):
    list_display = ("__str__", "date", "personel", "refund")
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
            "personel",
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
    autocomplete_fields = ["holder"]

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

class GroupUserInline(admin.TabularInline):
    model = Group.user_set.through
    extra = 0
    autocomplete_fields = ["user"]


class CustomGroupAdmin(GroupAdmin):
    inlines = [GroupUserInline]


class CustomUserAdmin(UserAdmin):
    # add holders to feild sets
    fieldsets = (("Info", {"fields": ("holder",)}),) + UserAdmin.fieldsets

    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields + ("holder",)

    def holder(self, obj):
        return obj.user.holder

admin.site.unregister(Group)
admin.site.unregister(User)
admin.site.register(Group, CustomGroupAdmin)
admin.site.register(User, CustomUserAdmin)
