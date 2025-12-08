"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import json

from django.contrib import admin
from django.shortcuts import render
from django.urls import path


def home(request):
    planets = [
        {
            "name": "Mercúrio",
            "orbit_radius": 58,
            "orbital_period_days": 88,
            "radius": 4.8,
            "color": "#c9c7bd",
        },
        {
            "name": "Vênus",
            "orbit_radius": 108,
            "orbital_period_days": 225,
            "radius": 12.1,
            "color": "#d8b98c",
        },
        {
            "name": "Terra",
            "orbit_radius": 150,
            "orbital_period_days": 365,
            "radius": 12.7,
            "color": "#4ea5d9",
        },
        {
            "name": "Marte",
            "orbit_radius": 228,
            "orbital_period_days": 687,
            "radius": 6.8,
            "color": "#c1440e",
        },
        {
            "name": "Júpiter",
            "orbit_radius": 778,
            "orbital_period_days": 4333,
            "radius": 69.9,
            "color": "#d2b48c",
        },
        {
            "name": "Saturno",
            "orbit_radius": 1429,
            "orbital_period_days": 10759,
            "radius": 58.2,
            "color": "#f6d28f",
        },
        {
            "name": "Urano",
            "orbit_radius": 2871,
            "orbital_period_days": 30687,
            "radius": 25.4,
            "color": "#7fffd4",
        },
        {
            "name": "Netuno",
            "orbit_radius": 4498,
            "orbital_period_days": 60190,
            "radius": 24.6,
            "color": "#4f83ff",
        },
    ]
    return render(
        request,
        "solar_system.html",
        {
            "planets_json": json.dumps(planets),
            "base_speed_multiplier": 60,
        },
    )


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
]
