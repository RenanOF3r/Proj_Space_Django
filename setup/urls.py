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
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path


def home(request):
    return HttpResponse('''<!DOCTYPE html>\n<html lang="pt-br">\n<head>\n    <meta charset="UTF-8">\n    <title>Setup Django</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 40px;\n            background: #f5f5f5;\n            color: #333;\n        }\n        .card {\n            max-width: 480px;\n            margin: 60px auto;\n            padding: 40px;\n            background: #fff;\n            border-radius: 12px;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);\n            text-align: center;\n        }\n        h1 {\n            font-size: 28px;\n            margin-bottom: 16px;\n        }\n        p {\n            margin: 0;\n            line-height: 1.6;\n        }\n    </style>\n</head>\n<body>\n    <div class="card">\n        <h1>Setup Django pronto!</h1>\n        <p>O servidor de desenvolvimento está funcionando.</p>\n    </div>\n</body>\n</html>''')


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
]
