// // scene_1 = Scene('scene_1', {color:'red', children:[
// //     health_bar = new HealthBar({max:50, default:25}),
// //     Button({color:'black'}),
// //     b = Button({color:'yellow', scale:.75, on_click:function(){print('v', health_bar); health_bar.value += 5}}),
// //     ]})
// // scene_2 = Scene('blue_valley', {color:'blue', text:'door'})
// // // state_handler.states['scene_1'] = Entity({color:'red'})
// // goto_scene(scene_1)
// //
// // Button({text:'1', x:.0, y:-.8, on_click:function(){goto_scene(scene_1)}})
// // Button({text:'2', x:.2, y:-.8, on_click:function(){goto_scene(scene_2)}})
// // Button({text:'3', x:.5, y:-.8, on_click:function(){scene_1.y=.2}})
set_background_color('#222')
set_window_color('#111')


w = 15
h = parseInt(w * aspect_ratio) - 1

var tiles = Array_2d(w, h)

colorize_target = 'fg'
selected_color = 3
skip = false    // skip the mouse enter after selecting a color from the color menu

color_menu = new Entity({enabled:false, scale:[4/7*1.0, 4/7*1.0], color:'gray', x:-.5 + (1/7), y:(.5*aspect_ratio) - (h/w), z:-1, origin:[-.5,-.5]})
for (const x of range(4)) {
    for (const y of range(4)) {
        new Entity({parent:color_menu, origin:[-.5,.5], scale:1/4, x:-.5+(x/4), y:.5-(y/4),
            texture:'Hack_square_64x64',
            tileset_size:[16,16],
            tile:[8, 15],
            color:palette[(y*4)+x],
            on_click: function() {
                selected_color=(y*4)+x
                color_menu.enabled = false
                // setTimeout(function() {color_menu.enabled = false}, 1000*10/60)
                tools[1].color = palette[(y*4)+x],
                prev_hovered = color_menu,
                skip = true
            }
        })
    }
}

tools = new Array(w)
tool_functions = [
    function() {
        if (colorize_target == 'fg') {
            colorize_target = 'bg'
            tools[0].tile = [1, 15]
        }
        else {
            colorize_target = 'fg'
            tools[0].tile = [0, 15]
        }
        // print('change color target')
    },
    function() {
        print('select color')
        color_menu.enabled = true
    },
    function() {
        print('select scene')
    },
    function() {
        print('select tile')
    },
    function() {
        print('undo')
    },
    function() {
        print('redo')
    },
    function() {
        print('open settings')
    }
]

for (let x = 0; x < tools.length; x++) {
    tools[x] = new Entity({x:-.5 + (x/7), y:(.5*aspect_ratio) - (h/w), origin:[-.5,.5], scale:[1/7*1.0,1/7*1.02],
        texture:'Hack_square_64x64',
        tileset_size:[16,16],
        tile:[x+1, 15],
        on_click: tool_functions[x]
    })
}
tool_functions[0]()


for (const x of range(w)) {
    for (const y of range(h)) {
        let e = new Entity({x:-.5 + (x/w), y:(.5*aspect_ratio) - (y/w),
            origin:[-.5,.5],
            scale:[1/w*1.03,1/w*1.03],
        })
        e.icon = new TintableTile({
            parent:e,
            texture:'Hack_square_64x64',
            tileset_size:[16,16],
            // tile:[random_int(0,14), random_int(0,14)],
            tile:[0,0],
            on_click : function() {
                if (colorize_target == 'fg') {
                    this.tint = selected_color
                }
                if (colorize_target == 'bg') {
                    e.color = palette[selected_color]
                }
                skip = false
            }
            })
        tiles[x][y] = e

    }
}

hovered_entity = null
hovered_element = null
document.addEventListener('touchmove', function(event) {event.preventDefault(); on_mouse_moved(event.touches[0])})
document.addEventListener('mousemove', function(event) {event.preventDefault(); on_mouse_moved(event)})

function on_mouse_moved(event) {
    if (!mouse_pressed) {
        return
    }
    element_hit = document.elementFromPoint(event.pageX - window.pageXOffset, event.pageY - window.pageYOffset);

    if (element_hit != hovered_element && element_hit.entity_index) {
        hovered_entity = entities[element_hit.entity_index]
        // hovered_entity.on_mouse_enter()
        if (mouse_pressed && hovered_entity.on_click) {
            hovered_entity.on_click()
        }
    }
};

// tiles[w-1][h-1].on_click = function randomize() {
//     for (const x of range(w)) {
//         for (const y of range(h)) {
//             tiles[x][y].tile = [random_int(0,16), random_int(0,16)]
//         }
//     }
// }



// e = new Tile({scale:.5, x:-.25, texture:'Hack_square_64x64', tint:1, tileset_size:[16,16], tile:[4, 0],})
// e = new Tile({scale:.5, x:.25, texture:'Hack_square_64x64', tint:9, tileset_size:[16,16], tile:[2, 0],})
// e = new Entity({scale:.5, x:.25, z:1, color:'#FFA300',})
