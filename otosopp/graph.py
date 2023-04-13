from ursina import *

app = Ursina()

# black	0	0	.5
# gray	.25	.5	.75
# white	.75	1	1
#
#
# 	0	.5	1
# window.color = color.black
bg = Entity(model='quad', color=color._32, position=(.5,.5), z=.2, scale=1)
# e = Entity(model=Mesh([(0,0,0),(.5,0,0),(1,.5,0)], mode='line', thickness=4), color = color.black)
Entity(model='quad', x=0, scale_x=.02, origin_y=-.5, color=color._0, scale_y=128/255 - 0/255)
# e = Entity(model=Mesh([(0,16/255,0),(.5,64/255,0),(1,166/255,0)], mode='line', thickness=4), color = color.dark_gray)
Entity(model='quad', x=1/4, scale_x=.02, origin_y=-.5, color=color._64, scale_y=166/255 - 16/255, y=16/255)
# e = Entity(model=Mesh([(0,.25,0),(.5,.5,0),(1,.75,0)], mode='line', thickness=4), color = color.gray)
Entity(model='quad', x=2/4, scale_x=.02, origin_y=-.5, color=color._128, scale_y=192/255 - 64/255, y=64/255)
# e = Entity(model=Mesh([(0,119/255,0),(.5,192/255,0),(1,238/255,0)], mode='line', thickness=4), color = color.light_gray)
Entity(model='quad', x=3/4, scale_x=.02, origin_y=-.5, color=color._192, scale_y=238/255 - 119/255, y=119/255)
# e = Entity(model=Mesh([(0,177/255,0),(.5,1,0),(1,1,0)], mode='line', thickness=4), color = color.white)
Entity(model='quad', x=4/4, scale_x=.02, origin_y=-.5, color=color._255, scale_y=255/255 - 177/255, y=177/255)
Entity(model='quad', x=4/4, scale_x=.02, origin_y=-.5, color=color._255, scale_y=255/255 - 177/255, y=(177+(255-177))/255)
# Entity(model=Grid(3,3), origin=(-.5,-.5), color=color.dark_gray, z=.1)

e = Entity(model=Mesh([(i/(5-1),i*i*.05,0) for i in range(5)], mode='line', thickness=4), color = color.white)
e = Entity(model=Mesh([(i/(5-1),.5 + i*i*.05,0) for i in range(5)], mode='line', thickness=4), color = color.white)
e = Entity(model=Mesh([(i/(5-1),.25 + i*i*.05,0) for i in range(5)], mode='line', thickness=4), color = color.white)


camera.orthographic = True
camera.fov = 2
window.center_on_screen()
camera.position = (.5,.5)

app.run()
