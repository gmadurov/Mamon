from django.urls import path, re_path, include

# from django.conf.urls import url

from . import views, views_holders, views_products, views_purchases, views_bar, views_hap
from api.tokens import MyTokenObtainPairView, MyRefreshPairView
from django.views.generic import TemplateView

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    # User login ######################
    path("login/", views.LoginAllUsers),
    # Products ###############################
    path("product/", views_products.showProducts),
    path("product/<str:pk>", views_products.showProduct),
    path("category/", views_products.cateories),
    # Reports #############################
    path("report/", views_bar.handle_report),
    # Puchases #############################
    path("purchase/", views_purchases.showPurchases),
    path("purchase/<str:pk>", views_purchases.showPurchase),
    # Holders ###############################
    path("holder/", views_holders.showHolders),
    path("holder/<str:pk>", views_holders.showHolder),
    path("holder/<str:pk>/cards", views_holders.showHolderCards),
    # WalletUpgrades ###############################
    path("walletupgrade/", views_holders.handle_WalletUpgrades),
    path("walletupgrade/password/", views_holders.handle_WalletUpgradesPassword),
    # CARDS ######################
    path("cards/", views_holders.handle_Cards),
    path("cards/<str:pk>", views_holders.handle_Card),
    # path("users/token/", MyTokenObtainPairView.as_view()),
    path("users/token/refresh/", MyRefreshPairView.as_view()),
    path("environment/<str:name>/", views.getEnvironment),
    # Happens ###############################
    path("happen/", views_hap.handleHaps),
    path("happen/<str:pk>/", views_hap.handleHap),
    path("happen/<str:pk>/pay/", views_hap.payHappen),
    path("happen/<str:pk>/leden/", views_hap.registerHappen),
    path("happen/<str:pk>/leden/<int:lid_id>/", views_hap.registerHappen),
    path("happen/<str:pk>/leden/<int:lid_id>/", views_hap.registerHappen),
    # Swagger ################################
    path("apidocs/", TemplateView.as_view(template_name="swagger-ui.html", extra_context={"schema_url": "routes"}), name="swagger-ui"),
]
