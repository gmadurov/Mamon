from .views import DatabaseView
from .serializers import HapOrderHolderSerializer, HapPaymentHolderSerializer, HappenSerializer, SimpleHolderSerializer
from purchase.models import HapOrder, Happen
from rest_framework.response import Response
from users.models import Holder

from rest_framework.views import APIView


class HapView(DatabaseView):
    model = Happen
    serializer = HappenSerializer
    http_method_names = ["get", "post", "put", "delete"]


class HapRegisterView(APIView):
    http_method_names = ["get", "post", "delete"]

    def get(self, request, pk, lid_id):
        hap = Happen.objects.get(id=pk)
        if lid_id in list(hap.participants.all().values_list("ledenbase_id", flat=True)):
            return Response(True)
        else:
            return Response(False)

    def post(self, request, pk=None, lid_id=None):
        data = request.data
        pos_order = HapOrder.objects.filter(holder__ledenbase_id=data.get("holder", {}).get("ledenbase_id", lid_id), happen__id=pk)
        if pos_order:
            # make sure the user isnt already registered might cause problems with paying
            return Response({"message": "Holder al ingeschreven voor dit hap, je moet eerst uitschijven en dan opnieuw probere"}, status=404)
        else:
            if lid_id and not data.get("holder", False):
                data["holder"] = {"ledenbase_id": lid_id}
            order = HapOrderHolderSerializer(data=data, many=False)
            if order.is_valid(raise_exception=True):
                order.save(happen=pk)
                return Response(order.data)

    def delete(self, request, pk, lid_id):
        hap = Happen.objects.get(id=pk)
        if lid_id in list(hap.participants.all().values_list("ledenbase_id", flat=True)):
            hap.participants.remove(Holder.objects.get(ledenbase_id=lid_id))
            return Response({"message": "Holder uitgeschreven"})
        else:
            return Response({"message": "Holder niet ingeschreven voor hap"}, status=404)


class HapPaymentView(APIView):
    http_method_names = ["get", "post"]

    def get(self, request, pk):
        hap = Happen.objects.get(id=pk)
        notPayed = [
            haporder
            for haporder in hap.haporder_set.all()
            if not hap.happayment_set.filter(holder=haporder.holder, happen=hap, quantity=haporder.quantity)
        ]
        serialiser = HapPaymentHolderSerializer(hap.happayment_set.all(), many=True)
        failed = HapOrderHolderSerializer(notPayed, many=True)
        return Response({"payed": serialiser.data, "not_payed": failed.data})

    def post(self, request, pk):
        hap = Happen.objects.get(id=pk)
        failed = hap.pay()
        serialiser = HapPaymentHolderSerializer(hap.happayment_set.all(), many=True)
        failed = SimpleHolderSerializer(failed, many=True)
        return Response({"payed": serialiser.data, "not_payed": failed.data})
