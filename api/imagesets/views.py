import os
import tempfile
import zipfile

from django.shortcuts import get_object_or_404
from django.utils.html import escape
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ImageSet
from .serializers import ImageSetSerializer
from .services.images_storage_service import get_image_storage_service


class ListImageSetsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns a list of all ImageSets belonging to the authenticated user."""
        user = request.user
        imagesets = user.image_sets.all()
        serializer = ImageSetSerializer(imagesets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateImageSetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Creates a new ImageSet for the authenticated user."""
        user = request.user
        title = request.data.get("title")
        title = escape(title)  # Sanitizing the title to prevent HTML injection
        zip_file = request.FILES.get("zip_file")

        if not title or not zip_file:
            return Response({"error": "Title and zip file are required."}, status=status.HTTP_400_BAD_REQUEST)

        imageset = ImageSet.objects.create(owner=user, title=title)
        storage = get_image_storage_service(user_id=user.id, imageset_id=imageset.id)

        # Unzip the file into a temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            # Collect all extracted image paths
            image_paths = []
            for root, _, files in os.walk(temp_dir):
                for file in files:
                    if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                        image_paths.append(os.path.join(root, file))

            # Save images using storage service
            storage.save_images(image_paths)

        serializer = ImageSetSerializer(imageset)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewImageSetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, imageset_id):
        """Returns details of a specific ImageSet if it belongs to the authenticated user."""
        user = request.user
        imageset = get_object_or_404(user.image_sets, id=imageset_id)
        storage = get_image_storage_service(user_id=user.id, imageset_id=imageset.id)
        serializer = ImageSetSerializer(imageset)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProcessImageSetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, imageset_id):
        """Starts processing an ImageSet if it belongs to the authenticated user."""
        user = request.user
        imageset = get_object_or_404(user.image_sets, id=imageset_id)
        # Logic to start processing the ImageSet asynchronously using Celery
        # process_imageset_task.delay(imageset_id=imageset.id)
        return Response({"message": "Processing started."}, status=status.HTTP_202_ACCEPTED)