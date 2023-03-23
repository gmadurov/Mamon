from django.contrib import admin
from django.urls import path, re_path
from . import views

urlpatterns = [
    path("products/", views.showProducts, name="products overview"),
    path("create-product/", views.product_create, name="product creation"),
    path("product/<int:pk>/toggle", views.toggle_product_activity, name="product activity toggle"),
    path("product/<int:pk>", views.showProduct, name="product overview"),
    path("overview/products/<str:pk>", views.showProductOverviews, name="overviewProduct"),
    path("purchases/", views.showProducts, name="purchases"),
]
