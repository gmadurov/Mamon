from typing import Any, List, Optional, Tuple, Union
from django.contrib import admin
from django.http.request import HttpRequest

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


class ProductInline(admin.TabularInline):
    model = Product
    extra = 0

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


class StockAdmin(SimpleHistoryAdmin):
    list_display = ("name", "quantity", "units", "description")
    list_filter = ("units",)
    search_fields = ("units", "description")
    ordering = ("units",)
    inlines = [ProductInline, StockMutationsInline]

    def get_readonly_fields(self, request: HttpRequest, obj: Any | None = ...) -> List[str] | Tuple[Any, ...]:
        if obj:
            return self.readonly_fields + ("units", "quantity")
        return super().get_readonly_fields(request, obj)


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
    autocomplete_fields = ["stock"]


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
    autocomplete_fields = ["master_stock"]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("price", "id")
        return self.readonly_fields

    def has_delete_permission(self, request, obj=None):
        return False



admin.site.register(Stock, StockAdmin)
admin.site.register(StockMutations, StockMutationsAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
