// scene_1 = Scene('scene_1', {color:'red', children:[
//     health_bar = new HealthBar({max:50, default:25}),
//     Button({color:'black'}),
//     b = Button({color:'yellow', scale:.75, on_click:function(){print('v', health_bar); health_bar.value += 5}}),
//     ]})
// scene_2 = Scene('blue_valley', {color:'blue', text:'door'})
// // state_handler.states['scene_1'] = Entity({color:'red'})
// goto_scene(scene_1)
//
// Button({text:'1', x:.0, y:-.8, on_click:function(){goto_scene(scene_1)}})
// Button({text:'2', x:.2, y:-.8, on_click:function(){goto_scene(scene_2)}})
// Button({text:'3', x:.5, y:-.8, on_click:function(){scene_1.y=.2}})
set_background_color('#111')


w = 8
h = parseInt(8 * aspect_ratio)

var tiles = new Array(w)
for (var i = 0; i < tiles.length; i++) {
    tiles[i] = new Array(h);
}

for (const x of Array(w).keys()) {
    for (const y of Array(h).keys()) {
        print(x)
        let e = new Entity({x:-.5 + (x/w), y:(.5*aspect_ratio) - (y/w), origin:[-.5,.5], scale:[1/w*1.02,1/w*1.02],
            texture:'Hack_square_64x64',
            tileset_size:[16,16],
            tile:[random_int(0,16), random_int(0,16)],
            // color:`rgb(${x*100},${y*100},0)`
            color:'gray'
        })
        e.on_click = function() {
            if (e.color == 'red') {
                e.color = 'gray'
            }
            else {
                e.color = 'red'
            }
        }
        tiles[x][y] = e
        if (x==1 && y==2){e.tile = [4, 4]; e.color='white'}
        if (x==2 && y==2){e.tile = [5, 4]; e.color='white'}
        if (x==3 && y==2){e.tile = [6, 4]; e.color='white'}
    }
}
print(tiles)
tiles[1][1].color = 'red'
