from django.contrib import admin

from .models import Order, Product, Purchase

# Register your models here.

admin.site.register(Product)
admin.site.register(Purchase)
# admin.site.register(Order)
