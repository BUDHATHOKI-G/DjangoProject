from django import forms
from .models import TourBooking

class TourBookingForm(forms.ModelForm):

    class Meta:
        model = TourBooking

        fields = [
            'full_name',
            'nationality',
            'email',
            'mobile',
            'travel_date',
            'return_date',
            'adults',
            'children',
            'budget',
            'pickup_location',
            'accommodation_preference',
            'special_request',
            'heard_about_us',
            'preferred_contact_method',
        ]