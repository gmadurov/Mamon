from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from users.views import loginAllUsers
from purchase.models import Barcycle, Report
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Personel


def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def handle_report(request):
    # personel action total_cash flow_meter1 flow_meter2 comment
    data = request.data
    if request.method == "POST":
        data = request.data
        seller, checked = loginAllUsers(request, username=data.get("personel").get("username"), password=data.get("password"), api=True)
        if seller and checked == 200:
            report = Report.objects.create(
                personel=Personel.objects.get(id=data.get("personel").get("personel_id")), **without_keys(data, ["personel", "password"])
            )
            if data.get("action") in ["create", "open", "Open"]:
                barcycle = Barcycle.objects.create(opening_report=report)
            if data.get("action") in ["end", "close", "Close"]:
                barcycle = Barcycle.objects.filter(closing_report=None).order_by("-id").first()
                if barcycle:
                    barcycle.closing_report = report
                    barcycle.save()
                else:
                    return Response({"message": "No barcycle to close"}, status=501)
    # fetch the last created Barcycle which doesnt have a closing report
    return Response({"message": "Report created successfully"})
