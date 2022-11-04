from django.urls import path
from . import views, views_holders, views_products, views_purchases, views_bar
from api.tokens import MyTokenObtainPairView, MyRefreshPairView

# from django.views.decorators.csrf import csrf_exempt
urlpatterns = [
    path("", views.getRoutes),
    path("product/", views_products.showProducts),
    path("product/<str:pk>", views_products.showProduct),
    path("purchase/", views_purchases.showPurchases),
    path("report/", views_bar.handle_report),
    path("category/", views_products.cateories),
    path("purchase/<str:pk>", views_purchases.showPurchase),
    path("holder/", views_holders.showHolders),
    path("holder/<str:pk>", views_holders.showHolder),
    path("users/token/", MyTokenObtainPairView.as_view()),
    path("users/token/refresh/", MyRefreshPairView.as_view()),
    path("walletupgrade/", views_holders.handle_WalletUpgrades),
    path(r"login/", views.LoginAllUsers),
]
