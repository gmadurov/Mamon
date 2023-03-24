from django.contrib import admin

# Register your models here.
from simple_history.admin import SimpleHistoryAdmin

from .models import Stock, StockMutations, Product, Category


class StockMutationsInline(admin.TabularInline):
    model = StockMutations
    extra = 0

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(Stock)
class StockAdmin(SimpleHistoryAdmin):
    list_display = ("name", "quantity", "units", "description")
    list_filter = ("units",)
    search_fields = ("units", "description")
    ordering = ("units",)
    inlines = [StockMutationsInline]


@admin.register(StockMutations)
class StockMutationsAdmin(SimpleHistoryAdmin):
    list_display = ("stock", "quantity", "units", "comment", "date", "cost")
    list_filter = ("stock", "units")
    search_fields = (
        "stock",
        "units",
        "comment",
    )
    ordering = (
        "stock",
        "units",
    )


@admin.register(Category)
class CategoryAdmin(SimpleHistoryAdmin):
    list_display = [
        "name",
        "description",
    ]
    filter_horizontal = ["products"]
    # list_editable = ["description"]
    list_filter = ["products"]
    search_fields = ["name", "description", "products"]


@admin.register(Product)
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
