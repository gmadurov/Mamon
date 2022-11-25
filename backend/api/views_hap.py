from .serializers import HapOrderHolderSerializer, HapPaymentHolderSerializer, HappenSerializer, HolderSerializer, SimpleHolderSerializer
from users.views import loginAllUsers
from purchase.models import Barcycle, Happen, Report
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Holder, Personel


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def handleHaps(request):
    data = request.data
    if request.method == "GET":
        haps = Happen.objects.all()
        serializer = HappenSerializer(haps, many=True)
        return Response(serializer.data)
    if request.method == "POST":
        serializer = HappenSerializer(data=data, many=False)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response("error")


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def handleHap(request, pk):
    data = request.data
    hap = Happen.objects.get(id=pk)
    if request.method == "PUT":
        hap = HappenSerializer(hap, data=data, many=False)
        if hap.is_valid(raise_exception=True):
            hap.save()
            return Response(hap.data)
    if request.method == "DELETE":
        hap.delete()
        return Response()
    serializer = HappenSerializer(hap, many=False)
    return Response(serializer.data)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def registerHappen(request, pk, lid_id=None):
    data = request.data
    hap = Happen.objects.get(id=pk)
    if request.method == "GET" and lid_id:
        if lid_id in list(hap.participants.all().values_list("ledenbase_id", flat=True)):
            return Response(True)
        else:
            return Response(False)
    if request.method == "POST":
        if lid_id and not data.get("holder", False):
            data["holder"] = {"ledenbase_id": lid_id}
        order = HapOrderHolderSerializer(data=data, many=False)
        if order.is_valid(raise_exception=True):
            order.save(happen=hap)
            return Response(order.data)
    if request.method == "DELETE" and lid_id:
        if lid_id in list(hap.participants.all().values_list("ledenbase_id", flat=True)):
            hap.participants.remove(Holder.objects.get(ledenbase_id=lid_id))
            return Response({"message": "Holder uitgeschreven"})
        else:
            return Response({"message": "Holder niet ingeschreven voor dit hap"}, status=404)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])

def payHappen(request, pk):
    data = request.data
    hap = Happen.objects.get(id=pk)
    if request.method == "GET":
        serialiser = HapPaymentHolderSerializer(hap.happayment_set.all(), many=True)
        return Response(serialiser.data)
    if request.method == "POST":
        failed=hap.pay()
        serialiser = HapPaymentHolderSerializer(hap.happayment_set.all(), many=True)
        failed = SimpleHolderSerializer(failed, many=True)
        return Response({"success":serialiser.data, "failed":failed.data})
