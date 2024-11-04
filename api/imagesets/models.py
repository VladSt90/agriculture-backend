import uuid

from django.contrib.auth.models import User
from django.db import models


class ImageSet(models.Model):
    class Status(models.TextChoices):
        NOT_PROCESSED = 'not_processed', 'Not Processed'
        IN_PROCESSING = 'in_processing', 'In Processing'
        PROCESSED = 'processed', 'Processed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_PROCESSED)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="image_sets")
    
    # New field for ML processing results
    ml_processing_result = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.id})"
