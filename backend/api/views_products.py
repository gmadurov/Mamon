from .views import DatabaseView
from inventory.models import Category, Product

from .serializers import CategorySerializer, ProductSerializer


class ProductView(DatabaseView):
    model = Product
    serializer = ProductSerializer
    http_method_names = ["get", "put"]
    search_fields = ["name__icontains"]


class CategoryView(DatabaseView):
    model = Category
    serializer = CategorySerializer
    http_method_names = ["get"]
    search_fields = ["name__icontains"]
