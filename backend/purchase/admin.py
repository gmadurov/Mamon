from datetime import datetime

from django.contrib import admin
from django.db.models import Q
from nonrelated_inlines.admin import NonrelatedTabularInline

from .actions import set_to_close, set_to_open
from .models import Barcycle, Category, HapOrder, HapPayment, Happen, Order, Product, Purchase, Report

from simple_history.admin import SimpleHistoryAdmin

# Register your models here.
import pytz

utc = pytz.UTC


class ReportInlineAdmin(NonrelatedTabularInline):
    model = Report
    readonly_fields = [
        "date",
        "personel",
        "action",
        "total_cash",
        "flow_meter1",
        "flow_meter2",
        "comment",
    ]
    extra = 0

    def get_form_queryset(self, obj):
        # if obj.closing_report:
        #     return self.model.objects.filter(
        #         Q(id=obj.opening_report.id) | Q(id=obj.closing_report.id)
        #     )
        return self.model.objects.filter(
            date__range=[
                obj.opening_report.date,
                obj.closing_report.date if obj.closing_report else datetime.now(),
            ]
        )

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        if obj:
            if not obj.closing_report:
                return True
        return False

    def save_new_instance(self, parent, instance):
        parent.closing_report.id = instance.id


class PurchaseBarCycleInline(NonrelatedTabularInline):
    model = Purchase
    readonly_fields = [
        "pin",
        "cash",
        "seller",
        "created",
        "balance",
        "orders",
        "remaining_after_purchase",
    ]
    exclude = ["buyer"]

    def get_form_queryset(self, obj):
        return self.model.objects.filter(
            created__range=[
                obj.opening_report.date,
                obj.closing_report.date if obj.closing_report else datetime.now(),
            ]
        )

    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class BarcycleAdmin(SimpleHistoryAdmin):
    list_display = [
        "__str__",
        "opening_personel",
        "closing_personel",
        "total_dif_cash",
        "get_total_sales",
        "total_dif_flowmeter1",
        "total_dif_flowmeter2",
    ]

    inlines = [ReportInlineAdmin, PurchaseBarCycleInline]

    def opening_personel(self, obj):
        if not obj.opening_report:
            return "Not closed yet"
        return obj.opening_report.personel.name

    def closing_personel(self, obj):
        if not obj.closing_report:
            return "Not closed yet"
        return obj.closing_report.personel.name

    def get_purchases(self, obj):
        # get all purchases that are withing the opning and closing report date range
        return Purchase.objects.filter(
            created__range=[
                obj.opening_report.date,
                obj.closing_report.date if obj.closing_report else datetime.now(),
            ]
        )

    def get_total_sales(self, obj):
        return sum([purchase.total for purchase in self.get_purchases(obj)])

    def get_readonly_fields(self, request, obj=None):
        if not obj:
            return self.readonly_fields + (
                "total_dif_flowmeter1",
                "total_dif_flowmeter2",
            )
        elif obj.closing_report:
            return self.readonly_fields + (
                "opening_report",
                "closing_report",
                "total_dif_cash",
                "get_total_sales",
                "total_dif_flowmeter1",
                "total_dif_flowmeter2",
            )
        return self.readonly_fields + (
            "opening_report",
            "get_total_sales",
            "total_dif_cash",
            "total_dif_flowmeter1",
            "total_dif_flowmeter2",
        )

    def total_dif_cash(self, obj):
        if not obj.closing_report:
            return "Available at closing"
        return obj.closing_report.total_cash - obj.opening_report.total_cash

    def total_dif_flowmeter1(self, obj):
        if not obj.closing_report:
            return "Available at closing"
        return obj.opening_report.flow_meter1 - obj.closing_report.flow_meter1

    def total_dif_flowmeter2(self, obj):
        if not obj.closing_report:
            return "Available at closing"
        return obj.opening_report.flow_meter2 - obj.closing_report.flow_meter2

    opening_personel.short_description = "Opening Personel"
    closing_personel.short_description = "Closing Personel"
    total_dif_cash.short_description = "Difference in total cash"
    get_total_sales.short_description = "Total Sales"
    total_dif_flowmeter1.short_description = "Total difference flowmeter 1"
    total_dif_flowmeter2.short_description = "Total difference flowmeter 2"

    def has_delete_permission(self, request, obj=None):
        return False


class CategoryAdmin(SimpleHistoryAdmin):
    list_display = [
        "name",
        "description",
    ]
    filter_horizontal = ["products"]
    # list_editable = ["description"]
    list_filter = ["products"]
    search_fields = ["name", "description", "products"]


class ProductAdmin(SimpleHistoryAdmin):
    list_display = ["name", "price", "image", "color", "active"]
    # list_display = ['name', 'price', 'category', 'barcode']
    list_editable = ["image", "color", "active"]
    list_filter = ["cat_products"]
    search_fields = ["name", "price", "id"]
    add_readonly_fields = []

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("price", "id")
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        return False


class PurchaseAdmin(SimpleHistoryAdmin):
    list_display = [
        "buyer",
        "total",
        "balance",
        "created",
        "seller",
    ]
    filter_horizontal = ["orders"]
    list_filter = ["buyer", "balance"]
    search_fields = ["buyer", "balance", "id"]
    exclude = ("remaining_after_purchase",)

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("orders", "seller", "buyer")
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        return False


# make a ReportAdmin template
class ReportAdmin(SimpleHistoryAdmin):
    list_display = [
        "date",
        "personel",
        "action",
        "total_cash",
        "flow_meter1",
        "flow_meter2",
        "comment",
    ]
    list_filter = ["action"]
    search_fields = ["name", "price", "date", "personel", "action", "comment"]
    actions = [set_to_open, set_to_close]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + (
                "personel",
                "date",
                "action",
                "total_cash",
                "flow_meter1",
                "flow_meter2",
            )
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        return False


class HapOrderInline(admin.TabularInline):
    model = HapOrder


class HapPaymentInline(admin.TabularInline):
    model = HapPayment


class HapAdmin(SimpleHistoryAdmin):
    list_display = [
        "title",
        "description",
        "cost",
        "active",
    ]
    list_filter = ["title"]
    search_fields = ["title", "description", "cost", "id"]

    filter_horizontal = ["participants", "deducted_from"]
    inlines = [HapOrderInline, HapPaymentInline]
    # def active(self, obj):
    #     return obj.opening_date <= utc.localize(datetime.now()) and utc.localize(datetime.now()) <= obj.closing_date

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("cost", "id")
        return self.readonly_fields

    # def has_delete_permission(self, request, obj=None):
    #     return False


admin.site.register(Barcycle, BarcycleAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Happen, HapAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(Report, ReportAdmin)
# admin.site.register(Order)  # do not enable
