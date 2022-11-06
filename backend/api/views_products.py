from purchase.models import Category, Product
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import CategorySerializer, ProductSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def showProducts(request):
    data = request.data
    if request.method == "GET":
        products = Product.objects.all()
        serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )
        return Response(serializer.data)
    if request.method == "POST":
        serializer = ProductSerializer(
            data=data, many=False, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def showProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)
    # if request.method == "GET": # redundant
    #     serializer = ProductSerializer(product, many=False)
    #     return Response(serializer.data)
    if request.method == "PUT":
        # product.price = data.get("price") or None # price shouldn't be changed
        product.color = data.get("color") or None
        product.name = data.get("name") or None
        product.save()
    serializer = ProductSerializer(product, many=False, context={"request": request})
    return Response(serializer.data)


@api_view(["GET", "POST"])
def cateories(request):
    data = request.data
    if request.method == "GET":
        categories = Category.objects.all()
        serializer = CategorySerializer(
            categories, many=True, context={"request": request}
        )
        return Response(serializer.data)
    if request.method == "POST":
        categorie = Category.objects.create()
        serializer = CategorySerializer(
            categorie, many=False, context={"request": request}
        )
        return Response(serializer.data)
