import os
import json
from django.conf import settings
from django.shortcuts import render, redirect
from django.utils.text import slugify
from django.core.mail import send_mail
from .forms import TourBookingForm
from django.http import JsonResponse

# Define this helper function to load FAQ JSON data
def load_faq_data():
    faq_file_path = os.path.join(settings.BASE_DIR, 'myWebsite', 'static', 'faq_data.json')
    with open(faq_file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def webHome(request):
    faq_data = load_faq_data()
    return render(request, 'index.html', {'faq_data': faq_data})

def about(request):
    faq_data = load_faq_data()
    return render(request, 'about.html', {'faq_data': faq_data})

def review(request):
    faq_data = load_faq_data()
    return render(request, 'review.html', {'faq_data': faq_data})

def faq(request):
    faq_data = load_faq_data()
    return render(request, 'FAQ.html', {'faq_data': faq_data})

def destination(request):
    faq_data = load_faq_data()
    return render(request, 'destination.html', {'faq_data': faq_data})

def bookTour(request):
    faq_data = load_faq_data()
    return render(request, 'bookTour.html', {'faq_data': faq_data})
  
def activities(request):
    # Load FAQ data (your existing part)
    faq_data = load_faq_data()

    # Load destinations from static/destination.json
    data_path = os.path.join(settings.BASE_DIR, 'myWebsite', 'static', 'destination.json')
    with open(data_path, encoding='utf-8') as f:
        destinations = json.load(f)

    # Ensure category + slug are present
    for d in destinations:
        d.setdefault("category", "misc")
        d["slug"] = slugify(d["name"])

    # Pick a few for top experiences
    top_experiences = destinations[:2]

    # Pass all to the template
    return render(request, 'activities.html', {
        'faq_data': faq_data,
        'destinations': destinations,
        'top_experiences': top_experiences
    })

def contact(request):
    return render(request, 'contact.html')
    
   # views for book tour
   
def book_tour(request):
    faq_data = load_faq_data()

    if request.method == "POST":
        form = TourBookingForm(request.POST)

        if form.is_valid():
            booking = form.save()

            subject = "New Tour Inquiry"
            message = f"""
New booking inquiry received.

Name: {booking.full_name}
Email: {booking.email}
Mobile: {booking.mobile}
Travel Date: {booking.travel_date}
Adults: {booking.adults}
Children: {booking.children}
Pickup Location: {booking.pickup_location}

Special Request:
{booking.special_request}
"""
            send_mail(
                subject,
                message,
                "yourgmail@gmail.com",
                ["yourgmail@gmail.com"],
                fail_silently=False,
            )

            return JsonResponse({"success": True})

        else:
            return JsonResponse({"success": False, "errors": form.errors}, status=400)

    form = TourBookingForm()
    return render(request, "bookTour.html", {"form": form, "faq_data": faq_data})
