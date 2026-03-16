from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import book_tour

urlpatterns = [
    path('home/', views.webHome, name='webHome'),
    path('', views.webHome, name='home'),
    path('destination/', views.destination, name='destination'),
    path('activities/', views.activities, name='activities'),
    path('about/', views.about, name='about'),
    path('reviews/', views.review, name='reviews'),
    path('FAQ/', views.faq, name='FAQ'),
    path('book-tour/', views.book_tour, name="book_tour"),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)