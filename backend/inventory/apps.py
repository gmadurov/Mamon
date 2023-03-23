from django.apps import AppConfig


class InventoryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "inventory"

    def ready(self):
        """this will runc each time something is saved/or deleted in this app"""
        import inventory.signals
