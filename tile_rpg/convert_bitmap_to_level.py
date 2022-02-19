from ursina import *
import random
random.seed(0)

app = Ursina()
t = load_texture('level_1')

bitmap = t.pixels.tolist()
data = [[0 for x in range(64)] for y in range(64)]


for y in range(64):
    for x in range(64):
        if not bitmap[x][y] == [0,0,0]:
            r = random.random()
            if r < .9:
                data[x][y] = [0,0]  # air/floor
                continue
            else:
                data[x][y] = [1,0]  # air/floor
                continue

        bot_solid =   x == 0 or bitmap[x-1][y] == [0,0,0]
        left_solid =    y == 0 or bitmap[x][y-1] == [0,0,0]
        top_solid = x == 63 or bitmap[x+1][y] == [0,0,0]
        right_solid =   y == 63 or bitmap[x][y+1] == [0,0,0]

        if top_solid and right_solid and bot_solid and left_solid: # mid
            data[x][y] = [1,2]
            continue

        if not top_solid:
            if left_solid and right_solid: # top
                data[x][y] = [1,3]
                continue
            if not left_solid:
                data[x][y] = [0,3]  # top left
                continue
            else:
                data[x][y] = [2,3]  # top right
                continue

        if not bot_solid:
            if left_solid and right_solid:  # bot
                data[x][y] = [1,1]
                continue
            if not left_solid:  # bot left
                data[x][y] = [0,1]
                continue
            else:
                data[x][y] = [2,1]  # bot right
                continue

        if not left_solid:  # left
            data[x][y] = [0,2]
            continue
        else:
            data[x][y] = [2,2]  # right
            continue

print(data)

with open('test.js', 'w') as f:
    f.write('level_1 = ' + str(data))
