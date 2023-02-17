from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path("", views.showOverview, name="overview"),
    path("purchases/", views.showProducts, name="purchases"),
    path(
        "purchases/<str:pk>", views.showPurchase, name="purchase"
    ),  # this would be for a single purchase where pk is a variable representing the purchase id(this is how you can pass parameters to the view function)
    path("overview/products/<str:pk>", views.showProductOverviews, name="overviewProduct"),
    path("overview/daily/", views.dailyOverview, name="daily overview"),
    path("products/", views.showProducts, name="products overview"),
    path("create-product/", views.product_form, name="product creation"),
    path("edit-product/<int:pk>", views.product_form, name="product edit"),
    path("product/<int:pk>", views.showProduct, name="product overview"),
    path("barcycles/", views.showBarcycles, name="barcycles"),
    path("barcycle/<str:pk>", views.showBarcycle, name="barcycle"),
    path('upgrade/', views.showUpgrades, name="upgrades"),
]
