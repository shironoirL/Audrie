from django.contrib import admin
from .models import *

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser')

# Register your models here.
admin.site.register(CustomUser, CustomUserAdmin)