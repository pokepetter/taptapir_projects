scene_1 = Scene('scene_1', {color:'red', children:[
    Button({color:'black'}),
    Button({color:'yellow'}),
    ]})
scene_2 = Scene('scene_2', {color:'blue', x:.25, text:'door'})
// state_handler.states['scene_1'] = Entity({color:'red'})
goto_scene(scene_2)

Button({text:'1', x:.0, y:-.8, on_click:function(){goto_scene(scene_1)}})
Button({text:'2', x:.2, y:-.8, on_click:function(){goto_scene(scene_2)}})
Button({text:'3', x:.5, y:-.8, on_click:function(){scene_1.y=.2}})
