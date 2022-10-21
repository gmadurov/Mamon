from django.core.exceptions import PermissionDenied


def set_to_open(modeladmin, request, queryset):
    # set action attribute from queryset to "Open"
    if not modeladmin.has_change_permission(request):
        raise PermissionDenied

    n = queryset.count()
    if n:
        queryset.update(action="Open")


set_to_open.short_description = "Set selected reports to Open"


def set_to_close(modeladmin, request, queryset):
    # set action attribute from queryset to "Close"
    if not modeladmin.has_change_permission(request):
        raise PermissionDenied

    n = queryset.count()
    if n:
        queryset.update(action="Close")


set_to_close.short_description = "Set selected reports to Close"
