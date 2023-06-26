from pprint import pprint

from .paginators import paginatePurchases
from .views import DatabaseView
from purchase.models import Purchase
from inventory.models import Order, Product
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import PurchaseSerializer


class PurchaseView(DatabaseView):
    model = Purchase
    serializer = PurchaseSerializer
    http_method_names = ["get", "post"]
    paginator = paginatePurchases
