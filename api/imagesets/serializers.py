from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import ImageSet
from .services.images_storage_service import get_image_storage_service


class ImageFileSerializer(serializers.Serializer):
    url = serializers.CharField()
    ml_result = serializers.CharField(allow_null=True, required=False)


class ImageSetSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = ImageSet
        fields = ['id', 'title', 'created_at', 'status', 'images']

    @extend_schema_field(serializers.ListSerializer(child=ImageFileSerializer()))
    def get_images(self, obj):
        storage = get_image_storage_service(user_id=obj.owner.id, imageset_id=obj.id)
        images = storage.get_images()
        return [{
            "url": img.location,
            "ml_result": obj.ml_processing_result.get(img.file_name) if obj.ml_processing_result else None
        } for img in images]


class CreateImageSetSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    zip_file = serializers.FileField()

    class Meta:
        fields = ['title', 'zip_file']