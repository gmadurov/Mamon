from datetime import datetime

from django.contrib import admin
from django.db.models import Q
from nonrelated_inlines.admin import NonrelatedTabularInline

from .actions import set_to_close, set_to_open
from .models import Barcycle, Category, Order, Product, Purchase, Report

# Register your models here.


class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "price", "image", "color"]
    # list_display = ['name', 'price', 'category', 'barcode']
    list_editable = ["image", "color"]
    list_filter = ["cat_products"]
    search_fields = ["name", "price", "id"]
    add_readonly_fields = []

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("price", "id")
        return self.readonly_fields


# you can use the ProductAdmin as a template
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "description",
    ]
    # list_editable = ["description"]
    list_filter = ["products"]
    search_fields = ["name", "description", "products"]


class PurchaseAdmin(admin.ModelAdmin):
    list_display = [
        "buyer",
        "payed",
        "created",
    ]
    list_editable = ["payed"]
    list_filter = ["buyer", "payed"]
    search_fields = ["buyer", "payed", "id"]


# make a ReportAdmin template
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        "date",
        "personel",
        "action",
        "total_cash",
        "flow_meter1",
        "flow_meter2",
        "comment",
    ]
    list_editable = ["action", "comment"]
    list_filter = ["action"]
    search_fields = ["name", "price", "date", "personel", "action", "comment"]
    actions = [set_to_open, set_to_close]


class PurchaseBarCycleInline(NonrelatedTabularInline):
    model = Purchase
    # extra = 1
    # filter_horizontal = ["created", "payed", "buyer", "orders"]
    readonly_fields = ["created", "payed", "buyer", "orders"]
    # exclude = ["product", "quantity"]
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
        if obj.closing_report:
            return self.model.objects.filter(
                Q(id=obj.opening_report.id) | Q(id=obj.closing_report.id)
            )
        return self.model.objects.filter(id=obj.opening_report.id)

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request, obj=None):
        if obj.closing_report:
            return False
        return True

    def save_new_instance(self, parent, instance):
        parent.closing_report.id = instance.id


# make a BarcycleAdmin template
class BarcycleAdmin(admin.ModelAdmin):
    list_display = [
        "__str__",
        "opening_personel",
        "closing_personel",
        "get_total_sales",
        "total_dif_flowmeter1",
        "total_dif_flowmeter2",
    ]

    inlines = [ReportInlineAdmin, PurchaseBarCycleInline]

    def opening_personel(self, obj):
        if obj.opening_report:
            return obj.opening_report.personel.name
        return "Not closed yet"

    def closing_personel(self, obj):
        if obj.closing_report:
            return obj.closing_report.personel.name
        return "Not closed yet"

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
                "opening_report",
                "closing_report",
                "total_dif_flowmeter1",
                "total_dif_flowmeter2",
            )
        if obj.closing_report:
            return self.readonly_fields + (
                "opening_report",
                "closing_report",
                "get_total_sales",
                "total_dif_flowmeter1",
                "total_dif_flowmeter2",
            )
        return self.readonly_fields + (
            "opening_report",
            "get_total_sales",
            "total_dif_flowmeter1",
            "total_dif_flowmeter2",
        )

    def total_dif_flowmeter1(self, obj):
        if obj.closing_report:
            return obj.closing_report.flow_meter1 - obj.opening_report.flow_meter1
        return "Available at closing"

    def total_dif_flowmeter2(self, obj):
        if obj.closing_report:
            return obj.closing_report.flow_meter2 - obj.opening_report.flow_meter2
        return "Available at closing"

    opening_personel.short_description = "Opening Personel"
    closing_personel.short_description = "Closing Personel"
    get_total_sales.short_description = "Total Sales"
    total_dif_flowmeter1.short_description = "Total difference flowmeter 1"
    total_dif_flowmeter2.short_description = "Total difference flowmeter 2"


admin.site.register(Product, ProductAdmin)
admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Barcycle, BarcycleAdmin)
# admin.site.register(Order)  # do not enable
