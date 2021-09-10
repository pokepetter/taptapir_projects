print = console.log
aspect_ratio = 16/9
format = 'horizontal'
format = 'vertical'

document.getElementById('loading_text').remove();
scene = document.createElement('entity')
scene.className = 'entity'
if (format == 'vertical') { // make width=1
    scene.style.height = `${100}%`
    scene.style.height = `${9/16*100}%`
}
else {  // make height be 1
    scene.style.width = `${16/9*100}%`
}
scene.style.backgroundColor = 'transparent'
// scene.style.backgroundColor = 'red'
game_window = document.getElementById('game')
game_window.appendChild(scene)
window_size = game_window.getBoundingClientRect();
var width = window_size.width;
var height = window_size.height;
window_aspect_ratio = width / height
print('aspect_ratio:', window_aspect_ratio)

scale = 1
if (format == 'vertical') {
    game_window.style.width = `${height/aspect_ratio*scale}px`
    game_window.style.height =  `${height*scale}px`
}
else {
    if (window_aspect_ratio <= aspect_ratio) {
        game_window.style.height = `${width/aspect_ratio*scale}px`
        game_window.style.width =  `${width*scale}px`

    }
    else {
        game_window.style.width =  `${height*aspect_ratio*scale}px`
        game_window.style.height = `${height*scale}px`
    }
}

function set_window_color(value) {game_window.style.backgroundColor = value}
function set_background_color(value) {document.body.style.backgroundColor = value}

ASSETS_FOLDER = ''

entities = []

class Entity {
    constructor(options=null) {
        this.el = document.createElement('entity')
        this.el.className = 'entity'
        this.el.entity_index = entities.length
        entities.push(this)

        this.el.text_entity = document.createElement('text')
        this.el.appendChild(this.el.text_entity)

        this.el.style.opacity = 1
        this.setTimeout_calls = {}
        scene.appendChild(this.el)
        this.children = []
        this._enabled = true
        // this.on_enable = null
        // this.on_disable = null
        this.color = 'white'

        for (const [key, value] of Object.entries(options)) {
            this[key] = value
        }
    }

    get parent() {return this._parent}
    set parent(value) {
        value.el.appendChild(this.el)
        if (this._parent) [
            this._parent.children = this.parent.children.filter(item => item !== this) // remove self from old parent's children list
        ]
        this._parent = value
        value.children.push(this)
    }
    get children() {return this._children}
    set children(value) {
        this._children = value
        for (const e of value) {
            e.parent = this
        }
    }
    get enabled() {return this._enabled}
    set enabled(value) {
        this._enabled = value
        if (value) {
            this.el.style.visibility = 'visible'
            for (var c of this.children) {
                c.el.style.visibility = c.el.style.original_visibility
            }
        }
        else {
            this.el.style.visibility = 'hidden'
            for (var c of this.children) {
                c.el.style.original_visibility = c.el.style.visibility
                c.el.style.visibility = 'inherit'
            }
        }

        // if (value && typeof (this.on_enable) === 'function') {
        // print('a', this.on_enable)
        // if (typeof this.on_enable !== 'undefined') {
        //     print('dddddddddddddddddd', this.on_enable)
        //     // the variable is defined
        // }
        // if (value || typeof this.on_enable === 'function') {
        //     print('enablke', this.on_enable)
        //     this.on_enable()
        //     // call(this.enable)
        // }
        // else if (!value && this.on_disable != null) {
        //     this.on_disable()
        //     // print('disblake')
        // }
    }

    get visible_self() {return this._visible_self}
    set visible_self(value) {
        if (!value) {
            this.color = 'rgba(0,0,0,0)'
            this.text_color = 'rgba(0,0,0,0)'
        }
        else {
            this.color = 'white'
            this.text_color = 'white'
        }
        this._visible_self = value
    }
    get color() {return this._color}
    set color(value) {
        this.el.style.backgroundColor = value
        this._color = value
    }
    get scale_x() {return this._scale_x}
    set scale_x(value) {
        this.el.style.width = `${value*100}%`
        this._scale_x = value
    }
    get scale_y() {return this._scale_y}
    set scale_y(value) {
        this.el.style.height = `${value*100}%`
        this._scale_y = value
    }
    get scale() {return [this._scale_x, this._scale_y]}
    set scale(value) {
        if (typeof value == "number") {value = [value, value]}
        this.scale_x = value[0]
        this.scale_y = value[1]
    }
    get x() {return this._x}
    set x(value) {
        this.el.style.left = `${50+(value*100)}%`
        this._x = value
    }
    get y() {return this._y}
    set y(value) {
        this.el.style.top = `${50+(-value*100)}%`
        this._y = value
    }
    get z() {return this._z}
    set z(value) {
        this.el.style.zIndex = -value
        this._z = value
    }
    get xy() {return [this._x, this._y]}
    set xy(value) {
        this.x = value[0]
        this.y = value[1]
        true
    }
    get xyz() {return [this._x, this._y, this._z]}
    set xyz(value) {
        this.x = value[0]
        this.y = value[1]
        this.z = value[2]
        true
    }
    get position() {return this.xyz}
    set position(value) {
        if (value.length == 2) {return this.xy = value}
        if (value.length == 3) {return this.xyz = value}
    }
    get origin() {return this._origin}
    set origin(value) {
        this.el.style.transform = `translate(${(-value[0]-.5)*100}%, ${(value[1]-.5)*100}%)`
        this._origin = value
    }
    get texture() {return this.el.style.backgroundImage}
    set texture(value) {
        this.el.style.backgroundImage = `url("${ASSETS_FOLDER}${value}")`
        this.visible_self = false
        // var loaded = 0
        // var img = new Image();
        // img.src = value + '.jpg'
        // try {
        //     // this.texture_address = "url(" + img.src + ")"
        //     this.el.style.backgroundImage = `url("${value}.jpg")`
        // }
        // catch {
        //     this.el.style.backgroundImage = `url("${value}.png")`
            // img.src = value + '.png'
            // this.texture_address = "url(" + img.src + ")"
            // this.el.style.backgroundImage = this.texture_address
            // img.onload = function() {loaded += 1}
        // }
        // if (loaded == 0) {  // if no texture is found, hide self
        //     this.visible_self = false
        // }
    }
    get tileset_size() {return this._tileset_size}
    set tileset_size(value) {
        this._tileset_size = value
        this.el.style.backgroundSize = `${value[0]*100}% ${value[1]*100}%`
    }
    get tile() {return this._tile}
    set tile(value) {
        this._tile = value
        // print('----', `${self._tileset_size[0]}-1) * ${value[0]} * 100)}% ${0/16}%`)
        var x_val = (16-1)*value[0]*100
        this.el.style.backgroundPosition = `${(16-1)*value[0]*100}% ${(16-1)*value[1]*100}%`
    }

    get roundness() {return this._roundness}
    set roundness(value) {
        this.el.style.borderRadius = `${value*Math.min(this.el.clientWidth, this.el.clientHeight)}px`
        this._roundness = value
    }
    get text() {return this.el.text_entitytextContent}
    set text(value) {
        return this.el.text_entity.textContent = value
    }
    get text_color() {return this.el.style.color}
    set text_color(value) {
        return this.el.style.color = value
    }
    get text_size() {return this._text_size}
    set text_size(value) {
        this._text_size = value
        this.el.style.fontSize = `${value}v`
    }

    get alpha() {return this.el.style.opacity; print(this.el.style.opacity)}
    set alpha(value) {
        // print('set opac', value)
        this.el.style.opacity = value
        this._alpha = value
    }
    get on_click() {return this._on_click}
    set on_click(value) {
        this._on_click = value
    //     // this.el.entity = this
        if (value) {
            this.el.style.pointerEvents = 'auto'
    //         this.el.ontouchstart = e => {
    //             e.preventDefault();
    //             this.on_click()
    //         }
    //         this.el.addEventListener('mousedown', value)
    //         this.el.addEventListener("touchstart", value);
    //
        }
        else {this.el.style.pointerEvents = 'none'}
    }

    animate(variable_name, target_value, duration=.1) {
        // print('animate:', this, variable_name)
        if (!this.enabled) {return false}
        let entity = this
        // stop ongoing animation of this varibale
        if (variable_name in entity.setTimeout_calls) {
            for (const id of entity.setTimeout_calls[variable_name]) {
                clearTimeout(id)
                // print('clear:', id)
            }
        }
        entity.setTimeout_calls[variable_name] = []

        for (let i=0; i<duration*60; i+=1) {
            entity.setTimeout_calls[variable_name].push(
                setTimeout(
                    function () {
                        if (!entity.enabled) {
                            return false};
                        entity[variable_name] = lerp(entity[variable_name], target_value, i/duration/60);
                    },
                    1000*i*1/60
                )
            )
        }
    }
}



function lerp(a, b, t) {
    // return a + (b - a) * t
    return a * (1-t)+b * t
}
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Button(options) {
    if (!('scale' in options)) {
        options['scale'] = [.2,.2]
    }
    if (!('roundness' in options)) {
        options['roundness'] = .2
    }
    if ('scale' in options) {
        if ('scale_x' in options) {
            options['scale'][0] = options['scale_x']
        }
        if ('scale_y' in options) {
            options['scale'][1] = options['scale_y']
        }
    }
    // print(options)
    return new Entity(options)
}


function StateHandler(states, fade=true) {
    var that = Object.create(StateHandler.prototype)
    that.states = states
    that.fade = fade

    that.overlay = new Entity({name:'overlay', color:'black', alpha:0, z:-1, scale:[1,aspect_ratio]})

    that['state'] = Object.keys(states)[0]
    return that
}

function Scene(name='', options=false) {
    settings = {visible_self:false, on_enter:null}
    for (const [key, value] of Object.entries(options)) {
        settings[key] = value
    }

    _entity = new Entity(settings)
    _entity.bg = new Entity({parent:_entity, scale_y:aspect_ratio})
    _entity.bg.texture = name + '.jpg'
    state_handler.states[name] = _entity
    return _entity
}

StateHandler.prototype =  {
    get state() {return this._state},
    set state(value) {
        if (this.fade && (value != this._state)) {
            this.overlay.animate('alpha', 1, .1)
            setTimeout(() => {
                this.overlay.animate('alpha', 0, 1)
                this.hard_state = value
            }, 100)
        }
        else {
            this.hard_state = value
        }
    },
    set hard_state(value) {     // set the state without fading
        // print('set state to:', value)
        for (const [key, entity] of Object.entries(this.states)) {
            if (key == value || value == entity) {
                entity.enabled = true
                if (entity.on_enter) {
                    entity.on_enter()
                }
            }
            else {
                entity.enabled = false}
            }

        // print('........', this.states[this.state])
        // for (var e of entities) {
        //     print(this.states[this.state])
        //     // if (this.states[this.state].el.contains(e.el) ) {
        //     //     print(e)
        //     // }
        // }

        this._state = value
    }
}

state_handler = StateHandler({
    // main_menu : b,
    // scene_2 : scene_2
})

function goto_scene(scene_name) {
    state_handler.state = scene_name



}
class HealthBar extends Entity {
    constructor(options=false) {
        let settings = {min:0, max:100, color:'#222', scale:[.8,.05], y:.75, roundness:.25}
        settings['default'] = settings['max']
        for (const [key, value] of Object.entries(options)) {
            if (key == 'bar_color') {continue}
            print(key, value)
            settings[key] = value
        }
        super(settings)
        this.bar = new Entity({parent:this, origin:[-.5,0], x:-.5, roundness:.25, scale_x:.25, color:'lime'})

        if (('bar_color' in options)) {
            this.bar_color = settings['bar_color']
        }

        this.value = this.default

    }

    get value() {return this._value}
    set value(value) {
        value = clamp(value, this.min, this.max)
        // print('set value:', value)
        this._value = value
        this.bar.scale_x = value / this.max}
    get bar_color() {return this.bar.color}
    set bar_color(value) {this.bar.color = value}
}

mouse_pressed = false

document.addEventListener('mousedown', function(e) {
    e.preventDefault()
    handle_mouse_click(e)
})
document.addEventListener('touchstart', function(e) {
    e.preventDefault()
    handle_mouse_click(e.touches[0])
})
function handle_mouse_click(e) {
    mouse_pressed = true
    element_hit = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset);
    if (element_hit && element_hit.entity_index && entities[element_hit.entity_index].on_click) {
        entities[element_hit.entity_index].on_click()
    }
}
document.body.addEventListener('mouseup', function(e) {
    e.preventDefault()
    mouse_up()
})
document.body.addEventListener('touchend', function(e) {
    e.preventDefault()
    mouse_up()
})
function mouse_up(e) {
    mouse_pressed = false;
}

function range(n) {return Array(n).keys()}
function Array_2d(w, h) {
    var tiles = new Array(w)
    for (var i = 0; i < tiles.length; i++) {
        tiles[i] = new Array(h);
    }
    return tiles
}

function rgb(r, g, b) {return `rgb(${parseInt(r*255)},${parseInt(g*255)},${parseInt(b*255)})`}

function hex_to_rgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
palette = [
    '#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
    '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
    ]
let filter_code = ''
for (i = 0; i < palette.length; i++) {
    let rgb = hex_to_rgb(palette[i])
    let r = rgb.r/255
    let g = rgb.g/255
    let b = rgb.b/255
    let redToBlue = `${r**2.4} 0 0 0 0  ${g**2.4} 0 0 0 0  ${b**2.4} 0 0 0 0  0 0 0 1 0`;
    filter_code += `
        <svg xmlns="http://www.w3.org/2000/svg">
            <filter id="tint_filter_${i}">
                <feColorMatrix type="matrix" values="${redToBlue}" />
            </filter>
        </svg>
    `
}
filters = document.createElement('div')
game_window.appendChild(filters)
filters.innerHTML = filter_code

function invoke(func, delay) {setTimeout(func, delay*1000)}


class TintableTile extends Entity {
    get tint() {return this._tint}
    set tint(value) {
        this._tint = value
        if (value < 16) {
            this.el.style.filter = `url(#tint_filter_${value})`
        }
    }

}
