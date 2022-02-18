from ursina import *
app = Ursina()
t = load_texture('level_1')
data = t.pixels.tolist()

with open('test.js', 'w') as f:
    f.write('level_1 = ' + str(data))
