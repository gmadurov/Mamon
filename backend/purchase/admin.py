from django.contrib import admin

from .models import Category, Order, Product, Purchase

# Register your models here.

admin.site.register(Product)
admin.site.register(Purchase)
admin.site.register(Category)
# admin.site.register(Order) #do not enable
