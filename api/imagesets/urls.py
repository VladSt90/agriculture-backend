from django.urls import path

from .views import (
    CreateImageSetView,
    ListImageSetsView,
    ProcessImageSetView,
    ViewImageSetView,
)

urlpatterns = [
    path('', ListImageSetsView.as_view(), name='list_imagesets'),
    path('create/', CreateImageSetView.as_view(), name='create_imageset'),
    path('<int:imageset_id>/', ViewImageSetView.as_view(), name='view_imageset'),
    path('<int:imageset_id>/process/', ProcessImageSetView.as_view(), name='process_imageset'),
]
