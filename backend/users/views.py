from django.shortcuts import render

from .models import Holder

# Create your views here.


def showUsers(request):
    users = Holder.objects.all()
    # return render(request)