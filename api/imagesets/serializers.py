from rest_framework import serializers

from .models import ImageSet
from .services.images_storage_service import get_image_storage_service


class ImageSetSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = ImageSet
        fields = ['id', 'title', 'created_at', 'status', 'images']

    def get_images(self, obj):
        storage = get_image_storage_service(user_id=obj.owner.id, imageset_id=obj.id)
        images = storage.get_images()
        return [{
            "url": img.location,
            "ml_result": obj.ml_processing_result.get(img.file_name) if obj.ml_processing_result else None
        } for img in images]
