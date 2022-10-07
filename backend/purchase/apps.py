from django.apps import AppConfig


class PurchaseConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "purchase"

    def ready(self):
        ''' this will runc each time something is saved/or deleted in this app'''
        import purchase.signals
