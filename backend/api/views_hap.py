
from .serializers import HappenSerializer
from users.views import loginAllUsers
from purchase.models import Barcycle, Happen, Report
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Personel



def without_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}

@api_view(["GET", "POST"])
def handleHaps(request):
     data = request.data
     if request.method == "GET":
          haps = Happen.objects.all()
          serializer = HappenSerializer(haps, many = True)
          return Response(serializer.data)
     if request.method == "POST":
          serializer = HappenSerializer(data=data, many = False)
          if serializer.is_valid(raise_exception = True):
                serializer.save()
                return Response(serializer.data)
          
          return Response('error')

@api_view(["GET",  "PUT", "DELETE"])
def handleHap(request, pk):
     data = request.data
     hap = Happen.objects.get(id = pk)
     if request.method == "GET":
          serializer = HappenSerializer(hap, many = False)
          return Response(serializer.data)
     if request.method == "PUT":
          hap.feild = data['feild'] or None
          hap.save()
     if request.method == "DELETE":
          hap.delete()
          return Response()
     serializer = HappenSerializer(hap, many = False)
     return Response(serializer.data)