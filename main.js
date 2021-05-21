scene_1 = Scene('scene_1', {color:'red', children:[
    health_bar = new HealthBar({max:50, default:25}),
    Button({color:'black'}),
    b = Button({color:'yellow', scale:.75, on_click:function(){print('v', health_bar); health_bar.value += 5}}),
    ]})
scene_2 = Scene('blue_valley', {color:'blue', text:'door'})
// state_handler.states['scene_1'] = Entity({color:'red'})
goto_scene(scene_1)

Button({text:'1', x:.0, y:-.8, on_click:function(){goto_scene(scene_1)}})
Button({text:'2', x:.2, y:-.8, on_click:function(){goto_scene(scene_2)}})
Button({text:'3', x:.5, y:-.8, on_click:function(){scene_1.y=.2}})
