from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path("", views.showPurchases, name="purchases"),
    path(
        "purchases/<str:pk>", views.showPurchase, name="purchase"
    ),  # this would be for a single purchase where pk is a variable representing the purchase id(this is how you can pass parameters to the view function)
    path("products/", views.showProducts, name="products"),
    path("product/<int:pk>", views.showProduct, name="product"),
]
