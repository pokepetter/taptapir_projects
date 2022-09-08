from PIL import Image
import numpy as np

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



with open("collision_map.txt", "w") as file:
    file.write(str(image_as_list))


tiff = Image.open('level_1.tiff')
tiff.load()

### Saving each image to output folder
for i in range(tiff.n_frames):
    tiff.seek(i)
    tiff.save(f'level_1_layer{i}.webp')
