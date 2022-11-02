from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.models import Holder

from .serializers import (
    HolderSerializer,
)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def showHolders(request):
    data = request.data
    if request.method == "GET":
        if "search" in data.keys():
            search = data["search"]
            users = User.objects.filter(
                Q(first_name__icontains=search) | Q(last_name__icontains=search)
            ).distinct()
            holders = [user.holder for user in users]
        else:
            holders = Holder.objects.all()
        serializer = HolderSerializer(holders, many=True, context={"request": request})
        return Response(serializer.data)

    if request.method == "POST":
        if "search" in data.keys():
            search = data["search"]
            users = (
                User.objects.filter(
                    Q(first_name__icontains=search) | Q(last_name__icontains=search)
                ).distinct()
                if (data["search"])
                else User.objects.all()
            )
            holders = [user.holder for user in users]
            serializer = HolderSerializer(
                holders, many=True, context={"request": request}
            )
        else:
            holder = Holder.objects.create()
            serializer = HolderSerializer(
                holder, many=False, context={"request": request}
            )
        return Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def showHolder(request, pk):
    data = request.data
    holder = Holder.objects.get(id=pk)
    # if request.method == "GET": # redundant
    #     serializer = HolderSerializer(holder, many=False, context={"request": request})
    #     return Response(serializer.data)
    if request.method == "PUT":
        holder.stand = data["stand"] or None
        holder.save()
    if request.method == "DELETE":
        holder.delete()
        return Response()
    serializer = HolderSerializer(holder, many=False, context={"request": request})
    return Response(serializer.data)
