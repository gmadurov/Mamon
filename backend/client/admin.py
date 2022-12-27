from django.contrib import admin

from .forms import ClientApplicationForm

from .models import ClientApplication, ClientApplicationAdministrator


class ClientApplicationAdministratorInline(admin.TabularInline):
    model = ClientApplicationAdministrator
    verbose_name = "Administrator"
    verbose_name_plural = "Administrators"
    extra = 1
    fields = ['user']
    autocomplete_fields = ['user']


class ClientApplicationAdmin(admin.ModelAdmin):
    form = ClientApplicationForm
    list_display = ['name', 'JWT']
    fieldsets = [
        ('Client applicatie',
            {'fields': ['name', 'identifier', 'paths']}
        )
    ]
    readonly_fields = ['identifier']
    inlines = [ClientApplicationAdministratorInline]

admin.site.register(ClientApplication, ClientApplicationAdmin)