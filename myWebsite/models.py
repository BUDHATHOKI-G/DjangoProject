from django.db import models

class TourBooking(models.Model):

    CONTACT_METHOD = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('whatsapp', 'WhatsApp'),
    ]

    HEAR_ABOUT = [
        ('google', 'Google'),
        ('facebook', 'Facebook'),
        ('friend', 'Friend'),
        ('blog', 'Travel Blog'),
        ('other', 'Other'),
    ]

    ACCOMMODATION = [
        ('budget', 'Budget'),
        ('standard', 'Standard'),
        ('luxury', 'Luxury'),
    ]

    full_name = models.CharField(max_length=60)
    nationality = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField()
    mobile = models.CharField(max_length=20)

    travel_date = models.DateField()
    return_date = models.DateField(blank=True, null=True)

    adults = models.IntegerField(default=1)
    children = models.IntegerField(default=0)

    budget = models.CharField(max_length=50, blank=True, null=True)

    pickup_location = models.CharField(max_length=100)

    accommodation_preference = models.CharField(
        max_length=50,
        choices=ACCOMMODATION,
        blank=True,
        null=True
    )

    special_request = models.TextField(blank=True, null=True)

    heard_about_us = models.CharField(
        max_length=20,
        choices=HEAR_ABOUT,
        blank=True,
        null=True
    )

    preferred_contact_method = models.CharField(
        max_length=20,
        choices=CONTACT_METHOD,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name