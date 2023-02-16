from django.contrib import admin
from django.urls import path, re_path
from . import views
from . import user_views

urlpatterns = [
    path("", user_views.home, name="userHome"),
    path("geldopwarderen/", user_views.paymentUpgrade, name="paymentUpgrade"),
    path("users/", views.showUsers, name="users"),
    path("products/", user_views.showProducts, name="products"),
    path("product/<int:pk>", user_views.showProduct, name="product"),



    
    path("app/", views.app, name="app"),
    re_path(
        r"^geldopwarderen-return/(?P<identifier>[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})/$",
        views.mollieReturn,
        name="mollie-return",
    ),
    re_path(
        r"^geldopwarderen-webhook/(?P<identifier>[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})/$",
        views.mollieWebhook,
        name="mollie-webhook",
    ),
    path("login/", views.loginUser, name="login"),
    path("logout/", views.logoutUser, name="logout"),
]
