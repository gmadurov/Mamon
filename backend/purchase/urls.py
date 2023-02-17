from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path("", views.showOverview, name="overview"),
    path("purchases/", views.showProducts, name="purchases"),
    # this would be for a single purchase where pk is a variable representing the purchase id(this is how you can pass parameters to the view function)
    path("purchases/<str:pk>", views.showPurchase, name="purchase"),
    path("overview/products/<str:pk>", views.showProductOverviews, name="overviewProduct"),
    path("overview/daily/", views.dailyOverview, name="daily overview"),
    path("barcycles/", views.showBarcycles, name="barcycles"),
    path("barcycle/<str:pk>", views.showBarcycle, name="barcycle"),
    path("products/", views.showProducts, name="products overview"),
    path("create-product/", views.product_create, name="product creation"),
    path("product/<int:pk>/toggle", views.toggle_product_activity, name="product activity toggle"),
    # path("edit-product/<int:pk>", views.product_edit, name="product edit"),
    path("product/<int:pk>", views.showProduct, name="product overview"),
    # path("create-category/", views.category_create, name="category creation"),
    path("personel-overview/", views.userOverview, name="personelOverview"),
    path("personel/<int:pk>/toggle", views.togglePersonelActive, name="personelActivityToggle"),
    path("personel/<int:pk>/edit", views.userEdit, name="personelEdit"),


    path("upgrade/", views.showUpgrades, name="upgrades"),
]
