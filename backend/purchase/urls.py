from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path("", views.showOverview, name="overview"),
    # this would be for a single purchase where pk is a variable representing the purchase id(this is how you can pass parameters to the view function)
    path("purchases/<str:pk>", views.showPurchase, name="purchase"),
    path("overview/daily/", views.dailyOverview, name="daily overview"),
    path("barcycles/", views.showBarcycles, name="barcycles"),
    path("barcycle/<str:pk>", views.showBarcycle, name="barcycle"),
    
    path("personel-overview/", views.userOverview, name="personelOverview"),
    path("personel/<int:pk>/toggle", views.togglePersonelActive, name="personelActivityToggle"),
    path("personel/<int:pk>/edit", views.userEdit, name="personelEdit"),

]
