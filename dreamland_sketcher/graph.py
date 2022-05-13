from ursina import *

app = Ursina()

# black	0	0	.5
# gray	.25	.5	.75
# white	.75	1	1
#
#
# 	0	.5	1
# window.color = color.black
bg = Entity(model='quad', color=color._32, position=(.5,.5), z=.2, scale=1.1)
e = Entity(model=Mesh([(0,0,0),(.5,0,0),(1,.5,0)], mode='line', thickness=4), color = color.black)
e = Entity(model=Mesh([(0,.08,0),(.5,.28,0),(1,.64,0)], mode='line', thickness=4), color = color.dark_gray)
e = Entity(model=Mesh([(0,.25,0),(.5,.5,0),(1,.75,0)], mode='line', thickness=4), color = color.gray)
e = Entity(model=Mesh([(0,.75,0),(.5,1,0),(1,1,0)], mode='line', thickness=4), color = color.white)
Entity(model=Grid(3,3), origin=(-.5,-.5), color=color.dark_gray, z=.1)
camera.orthographic = True
camera.fov = 2
window.center_on_screen()
camera.position = (.5,.5)

app.run()
