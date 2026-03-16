from django.contrib import admin
from .models import TourBooking

@admin.register(TourBooking)
class TourBookingAdmin(admin.ModelAdmin):

    list_display = (
        'full_name',
        'email',
        'mobile',
        'travel_date',
        'pickup_location',
        'created_at'
    )

    search_fields = ('full_name', 'email', 'mobile')