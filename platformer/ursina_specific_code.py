from ursina import *
app = Ursina()
aspect_ratio = camera.aspect_ratio
camera.orthographic = True
# from ursina import Entity as UrsinaEntity
class Entity(Entity):
    def __init__(self, **kwargs):
        super().__init__()
        self.model='quad'

        for key, value in kwargs.items():
            setattr(self, key, value)

    @property
    def xy(self):
        return self.position.xy
    @xy.setter
    def xy(self, value):
        self.position = value
