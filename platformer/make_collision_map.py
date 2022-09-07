from PIL import Image
from numpy import asarray, flip, swapaxes
import numpy as np
import json


skip = 32
threshold = int(.4 * 255)

img = Image.open('mg.png').convert('L')
width = img.width // skip
height = img.height // skip
img = img.resize([width, height], Image.NEAREST)
img = img.point(lambda p: 255 if p > threshold else 0) # threshold filter
img = img.convert('1') # to mono

# img.show()
image_as_list = np.array(img).tolist()
for y, row in enumerate(image_as_list):
    for x, value in enumerate(row):
        image_as_list[y][x] = int(value)


# print(image_as_list)
# json_data = json.dumps()
#
#serialize.
with open("collision_map.txt", "w") as file:
    file.write(str(image_as_list))
