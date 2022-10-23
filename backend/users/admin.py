from django.contrib import admin

from .models import Holder, Personel


class HolderAdmin(admin.ModelAdmin):
    list_display = ("user", "stand", "image")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "ledenbase_id",
    )


class PersonelAdmin(admin.ModelAdmin):
    list_display = ("user", "nickname", "image")
    search_fields = ("user__username", "user__first_name", "user__last_name")


# Register your models here.
admin.site.register(Holder, HolderAdmin)
admin.site.register(Personel, PersonelAdmin)
 