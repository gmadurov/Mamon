from django.urls import path
from . import views, views_holders, views_products, views_purchases, views_bar
from api.tokens import MyTokenObtainPairView, MyRefreshPairView

# from django.views.decorators.csrf import csrf_exempt
urlpatterns = [
    path("", views.getRoutes),
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
    # CARDS ######################
    path("cards/", views_holders.handle_Cards),
    path("cards/<str:pk>", views_holders.handle_Card),
    # User login ######################
    path(r"login/", views.LoginAllUsers),
    # path("users/token/", MyTokenObtainPairView.as_view()),
    path("users/token/refresh/", MyRefreshPairView.as_view()),
    path("environment/<str:name>/", views.getEnvironment),
]
