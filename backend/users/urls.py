from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("users/", views.showUsers, name="users"),
    path("login/", views.loginUser, name="login"),
    path("logout/", views.logoutUser, name="logout"),
]
