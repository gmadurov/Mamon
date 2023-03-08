from .serializers import ReportSerializer
from .views import DatabaseView
from users.views import loginAllUsers
from purchase.models import Barcycle, Report
from rest_framework.response import Response


def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


class ReportView(DatabaseView):
    model = Report
    serializer = ReportSerializer
    http_method_names = ["get", "post"]
    search_fields = ["personel__user__username__icontains", "personel__user__first_name__icontains", "personel__user__last_name__icontains"]

    def post(self, request, *args, **kwargs):
        """This will make a report for the request user or if the personel is specified in the request data it will make a report for that personel"""
        data = request.data
        if "personel" in data.keys():
            """making a report for a personel"""
            seller, checked = loginAllUsers(
                request, username=data.get("personel").get("username"), password=data.get("personel").get("password"), api=True
            )
            if seller and checked == 200:
                report = Report(personel=seller.personel, **without_keys(data, ["personel"]))
                if data.get("action") in ["create", "open", "Open"]:
                    report.save()
                    barcycle = Barcycle.objects.create(opening_report=report)
                    res = Response(self.serializer(report, many=False, context={"request": request}).data)
                if data.get("action") in ["end", "close", "Close"]:
                    barcycle = Barcycle.objects.filter(closing_report=None).order_by("-id").first()
                    if barcycle:
                        report.save()
                        barcycle.closing_report = report
                        barcycle.save()
                        res = Response(self.serializer(report, many=False, context={"request": request}).data)
                    else:
                        res = Response({"message": "No barcycle to close"}, status=501)
                return res
            else:
                return Response({"message": "Invalid credentials"}, status=401)
        else:
            """making a report for the request user"""
            report = ReportSerializer(data=data, many=False, context={"request": request})
            if report.is_valid(True):
                if data.get("action") in ["create", "open", "Open"]:
                    saved_report = report.save()
                    barcycle = Barcycle.objects.create(opening_report=saved_report)
                    res = Response(report.data)
                if data.get("action") in ["end", "close", "Close"]:
                    barcycle = Barcycle.objects.filter(closing_report=None).order_by("-id").first()
                    if barcycle:
                        saved_report = report.save()
                        barcycle.closing_report = saved_report
                        barcycle.save()
                        res = Response(report.data)
                    else:
                        res = Response({"message": "No barcycle to close"}, status=501)
                return res
