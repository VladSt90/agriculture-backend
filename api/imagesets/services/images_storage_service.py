import os
from abc import ABC, abstractmethod


class ImagesStorageService(ABC):
    
    @abstractmethod
    def save_images(self, image_paths):
        """Abstract method to save images. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def get_images_links(self):
        """Abstract method to retrieve links to saved images. Must be implemented by subclasses."""
        pass

    @abstractmethod
    def get_images(self):
        """Abstract method to return image objects with metadata. Must be implemented by subclasses."""
        pass
    
        
    
class Image:
    def __init__(self, file_name, location):
        self.file_name = file_name
        self.location = location

class FileSystemImagesStorage(ImagesStorageService):
    def __init__(self, user_id, imageset_id):
        self.user_id = user_id
        self.imageset_id = imageset_id
        self.storage_directory = os.path.join("ImageSets", f"User-{self.user_id}", f"ImageSet-{self.imageset_id}")
        os.makedirs(self.storage_directory, exist_ok=True)

    def save_images(self, image_paths):
        """Saves images to the specified storage directory."""
        saved_files = []
        for image_path in image_paths:
            filename = os.path.basename(image_path)
            destination = os.path.join(self.storage_directory, filename)
            os.rename(image_path, destination)
            saved_files.append(destination)
        return saved_files

    def get_images_links(self):
        """Generates direct links to all images stored in the storage directory."""
        links = []
        for filename in os.listdir(self.storage_directory):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                path = os.path.join(self.storage_directory, filename)
                # Replace this with actual URL generation as per your app's config
                link = f"/media/{self.storage_directory}/{filename}"
                links.append(link)
        return links

    def get_images(self):
        """Returns a list of Image objects for all images in the storage directory."""
        images: list[Image] = []
        for filename in os.listdir(self.storage_directory):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                location = os.path.join(self.storage_directory, filename)
                images.append(Image(file_name=filename, location=location))
        return images

# Concrete implementation of ImagesStorageService
def get_image_storage_service(user_id, imageset_id):
    image_storage_service: ImagesStorageService = FileSystemImagesStorage(user_id, imageset_id)
    return image_storage_service
