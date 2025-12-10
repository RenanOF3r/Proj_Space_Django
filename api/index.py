import os
from pathlib import Path

from django.core.wsgi import get_wsgi_application

# Ensure Django knows where settings live
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "setup.settings")

# Use project base dir for collected static discovery if needed
BASE_DIR = Path(__file__).resolve().parent.parent
os.environ.setdefault("PYTHONPATH", str(BASE_DIR))

app = get_wsgi_application()
