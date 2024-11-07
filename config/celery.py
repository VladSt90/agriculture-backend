# api/celery.py
from __future__ import absolute_import, unicode_literals

import logging
import os

import debugpy
from celery import Celery
from django.conf import settings

# Set up logging for the Celery application
logger = logging.getLogger(__name__)

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("config")

# Load configuration from environment variables
app.conf.update(
    broker_url=os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0"),
    result_backend=os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0"),
)

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

logger.info("Celery app initialized!")

# Enable debugging if environment variable is set
# if os.environ.get("ENABLE_DEBUGGER", "0") == "1":
#     logger.info("Starting debugger...")
#     debugpy.listen(("0.0.0.0", 5678))  # Expose debug port for remote debugging
#     debugpy.wait_for_client()  # Pause execution until debugger attaches
#     logger.info("Debugger attached.")
