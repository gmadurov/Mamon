from django.db.models.signals import post_delete, post_save
from django.contrib.auth.models import User
from .models import Holder


def create_stand(sender, instance, created,**kwargs):
    if created:
        Holder.objects.create(user=instance, stand=0)
        user = instance 
        user.first_name = user.username[0]
        user.last_name = user.username[1:]
        user.save()
        


post_save.connect(create_stand, sender=User)
