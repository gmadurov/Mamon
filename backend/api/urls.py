from django.contrib import admin
from django.urls import path
from . import views
from api.tokens import MyTokenObtainPairView, MyRefreshPairView
from rest_framework_simplejwt.views import TokenRefreshView

# from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("", views.getRoutes),
    path("product/", views.showProducts),
    path("product/<str:pk>", views.showProduct),
    path("purchase/", (views.showPurchases)),
    path("category/", views.cateories),
    path("purchase/<str:pk>", views.showPurchase),
    path("holder/", views.showHolders),
    path("holder/<str:pk>", views.showHolder),
    path("users/token/", MyTokenObtainPairView.as_view()),
    path("users/token/refresh/", MyRefreshPairView.as_view()),
    path(r"login/", views.LoginAllUsers),
]
