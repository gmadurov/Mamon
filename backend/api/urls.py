from django.contrib import admin
from django.urls import path
from . import views
from api.tokens import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("product/", views.showProducts, name="products"),
    path("product/<str:pk>", views.showProduct, name="product"),
    path("purchase/", views.showPurchases, name="purchases"),
    path("category/", views.cateories, name="categories"),
    path("purchase/<str:pk>", views.showPurchase, name="purchase"),
    path("holder/", views.showHolders, name="holders"),
    path("holder/<str:pk>", views.showHolder, name="holder"),
    path("users/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("users/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(r"login/", views.LoginAllUsers, name="ledenToken"),
]
