import os


class ImageFile:
    def __init__(self, filename, path):
        self.filename = filename
        self.path = path


class ImageFileWithMLMeta(ImageFile):
    def __init__(self, filename, path, number_of_flowers):
        super().__init__(filename, path)
        self.number_of_flowers = number_of_flowers
