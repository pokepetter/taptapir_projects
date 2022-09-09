from PIL import Image,ImageSequence
import numpy as np

update_collision_only = False
# update_collision_only = True

levels = ['level_0', 'level_1', ]
layers = ['bbg', 'bg', 'mg', 'fg', ]
if update_collision_only:
    layers = ['mg', ]

for level_name in levels:
    for layer_name in layers:
        file_name = f'{level_name}_{layer_name}'
        print('opening:', f'{file_name}.png')
        img = Image.open(f'{file_name}.png')

        if not update_collision_only:
            img.save(f'{file_name}.webp', 'webp')
            print('saved:', file_name)

        if layer_name == 'mg':
            skip = 32
            threshold = int(.4 * 255)

            img = img.convert('L')
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

            with open(f'{level_name}_collision_map.txt', "w") as file:
                file.write(str(image_as_list))
            print('made collision map:', f'{level_name}_collision_map.txt')
