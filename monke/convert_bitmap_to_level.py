from ursina import *
import random
random.seed(0)

app = Ursina()

# bitmap = t.pixels.tolist()
levels = []

for file in Path('.').glob('level_*.png'):
    print(file.name)
    t = load_texture(file.name)

    data = [[0 for x in range(16)] for y in range(16)]


    for y in range(t.height):
        for x in range(t.width):
            col = t.get_pixel(x,y)
            for i, target_color in enumerate([color.black, color.white, color.green, color.blue, color.cyan, color.red]):
                if col == target_color:
                    data[y][x] = i

    levels.append(data)

with open('levels.js', 'w') as f:
    formatted_data = str(levels).replace('], [', '],\n [')
    text = f'''levels = {formatted_data}'''
    f.write(text)
