from django.urls import path

# from django.conf.urls import url

from . import views, views_holders, views_products, views_purchases, views_bar, views_hap
from api.tokens import MyRefreshPairView
from django.views.generic import TemplateView

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    # User login ######################
    path("login/", views.LoginAllUsers),
    path("login/refresh/", MyRefreshPairView.as_view()),
    path("environment/<str:name>/", views.getEnvironment),
    # Products ###############################
    path("products/", views_products.ProductView.as_view()),
    path("products/overview/", views_holders.ProductsOverview),
    path("products/<str:pk>/", views_products.ProductView.as_view()),
    path("categories/", views_products.CategoryView.as_view()),
    # Reports #############################
    path("reports/", views_bar.ReportView.as_view()),
    # Puchases #############################
    path("purchases/", views_purchases.PurchaseView.as_view()),
    path("purchases/<str:pk>/", views_purchases.PurchaseView.as_view()),
    # Holders ###############################
    path("holders/", views_holders.HolderView.as_view()),
    path("holders/cards/", views_holders.HolderCardView.as_view()),
    path("holders/<str:pk>/", views_holders.HolderView.as_view()),
    # WalletUpgrades ###############################
    path("walletupgrades/", views_holders.WalletUpgradesView.as_view()),
    path("wallet/opwarderen/", views_holders.SelfMolliePaymentsView.as_view()),
    # CARDS ######################
    path("cards/", views_holders.CardView.as_view()),
    path("cards/<str:pk>/", views_holders.CardView.as_view()),
    # Happens ###############################
    path("happen/", views_hap.HapView.as_view()),
    path("happen/<str:pk>/", views_hap.HapView.as_view()),
    path("happen/<str:pk>/pay/", views_hap.HapPaymentView.as_view()),
    path("happen/<str:pk>/leden/", views_hap.HapRegisterView.as_view()),
    path("happen/<str:pk>/leden/<int:lid_id>/", views_hap.HapRegisterView.as_view()),
]
