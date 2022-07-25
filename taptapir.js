print = console.log
False = false
True = true
None = null
// aspect_ratio = 16/9
scale = 1

var loading_text = document.getElementById('loading_text')
if (loading_text) {
    loading_text.remove()
}
var game_window = document.getElementById('game')
if (!game_window) {
    var game_window = document.createElement('game')
    game_window.id = 'game'
    document.body.appendChild(game_window)
}
scene = document.createElement('entity')
scene.className = 'entity'
scene.id = 'scene'
scene.style.backgroundColor = 'transparent'
game_window.appendChild(scene)

browser_size = game_window.getBoundingClientRect();
var width = browser_size.width;
var height = browser_size.height;
browser_aspect_ratio = width / height
// print('browser aspect_ratio:', browser_aspect_ratio)
var format = null
function set_orientation(value) {
    format = value
    if (format == 'vertical') {
        aspect_ratio = 16/9
        // scene.style.width = `${100}%`
        // used for setting correct draggable limits
        asp_x = 1
        asp_y = 9/16
        scene.style.width = `${1/asp_x*100}%`
        scene.style.height = `${1/asp_y*100}%`

        if (browser_aspect_ratio >= 9/16) { // if the screen is wider than 16/9, like a pc monitor.
            game_window.style.width = `${height/(16/9)*scale}px`
            game_window.style.height =  `${height*scale}px`
        }
        else {                              // if the screen is taller than 16/9, like a phone screen.
            game_window.style.width = `${width*scale}px`
            game_window.style.height =  `${width*16/9*scale}px`
        }
    }
    else {
        aspect_ratio = 9/16
        asp_x = 16/9
        asp_y = 1
        scene.style.width = `${1/asp_x*100}%`
        scene.style.height = `${1/asp_y*100}%`
        if (browser_aspect_ratio > 1/aspect_ratio) { // if the screen is wider than 16/9, fit to height
            game_window.style.height = `${height*scale}px`
            game_window.style.width =  `${height*scale/aspect_ratio}px`
        }
        else {                              // if the screen is taller than 16/9, fit to width
            game_window.style.height = `${width*scale*aspect_ratio}px`
            game_window.style.width =  `${width*scale}px`
        }

    }
}
set_orientation('vertical')
print('spect', asp_x, asp_y)


top_left =      [-.5*asp_x, .5*asp_y]
top_right =     [.5*asp_x, .5*asp_y]
bottom_left =   [-.5*asp_x, -.5*asp_y]
bottom_right =  [.5*asp_x, -.5*asp_y]
top =           [0, .5*asp_y]
bottom =        [0, -.5*asp_y]
left =          [-.5*asp_x, 0]
right =         [.5*asp_x, 0]

function set_window_color(value) {game_window.style.backgroundColor = value}
function set_background_color(value) {document.body.style.backgroundColor = value}
function set_scale(value) {
    scale = value
    set_orientation(format)
}

fullscreen = false
function set_fullscreen(value) {
    fullscreen = value
    if (value) {
        document.documentElement.requestFullscreen()
    }
    else {
        document.exitFullscreen();
    }
}

ASSETS_FOLDER = ''

entities = []

class Entity {
    constructor(options=null) {
        this.el = document.createElement('entity')
        this.el.className = 'entity'

        // create another div for the model, for setting origin to work
        this.el.style.backgroundColor = 'rgba(0,0,0,0)'
        this.el.style.pointerEvents = 'none'
        this.model = document.createElement('div')
        this.model.entity_index = entities.length
        this.model.id = 'model'
        this.el.appendChild(this.model)

        // this.text_entity = document.createElement('text')
        // this.text_entity.style.pointerEvents = 'none'
        // this.model.appendChild(this.text_entity)

        this.model.className = 'entity'
        this.model.style.opacity = 1
        entities.push(this)

        this.setTimeout_calls = {}
        scene.appendChild(this.el)
        this.children = []
        this._enabled = true
        // this.on_enable = null
        // this.on_disable = null
        this.color = 'white'
        this.x = 0
        this.y = 0
        this.draggable = false
        this.dragging = false
        this.lock_x = false
        this.lock_y = false

        this.min_x = -.5 * asp_x
        this.max_x = .5 * asp_x
        this.min_y = -.5 / asp_y
        this.max_y = .5 / asp_y

       this.snap_x = 0
        this.snap_y = 0
        this.text_size = 3

        for (const [key, value] of Object.entries(options)) {
            this[key] = value
        }
    }
    get name() {return this._name}
    set name(value) {
        this._name = value
        this.el.id = value
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
    get world_parent() {return this.parent}
    set world_parent(value) {
        wpos = this.world_position
        wscale = this.world_scale
        this.parent = value

        this.world_position = wpos
        this.world_scale = wscale
    }
    get world_x() {return (this.el.getBoundingClientRect().left - scene.getBoundingClientRect().left) / scene.clientWidth}
    get world_y() {return -(this.el.getBoundingClientRect().top - scene.getBoundingClientRect().top) / scene.clientHeight}
    get world_position() {return [this.world_x, this.world_y]}

    get world_scale_x() {return this.el.clientWidth / scene.clientWidth}
    get world_scale_y() {return this.el.clientHeight / scene.clientHeight}
    get world_scale() {return [this.world_scale_x, this.world_scale_y]}

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
            this.model.color = 'rgba(0,0,0,0)'
            this.text_color = 'rgba(0,0,0,0)'
        }
        else {
            this.model.color = 'white'
            this.text_color = 'white'
        }
        this._visible_self = value
    }
    get color() {return this._color}
    set color(value) {
        // if (!(value instanceof String)) {
        //     // print('set color:', value)
        //     var alpha = 255
        //     if (value.length == 4) {
        //         alpha = value[3]
        //     }
        //     value = `rgba(${value[0]},${value[1]},${value[2]},${alpha})`
        // }
        this.model.style.backgroundColor = value
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
    }
    get xyz() {return [this._x, this._y, this._z]}
    set xyz(value) {
        this.x = value[0]
        this.y = value[1]
        this.z = value[2]
    }
    get position() {return this.xyz}
    set position(value) {
        if (value.length == 2) {return this.xy = value}
        if (value.length == 3) {return this.xyz = value}
    }
    get origin() {return this._origin}
    set origin(value) {
        this.model.style.transform = `translate(${(-value[0]-.5)*100}%, ${(value[1]-.5)*100}%)`
        this._origin = value
    }
    get rotation() {return this._rotation}
    set rotation(value) {
        this._rotation = value
        this.el.style.transform = `translate(-50%, -50%) rotate(${value}deg)`
    }

    get texture() {return this.model.style.backgroundImage}
    set texture(value) {
        this.model.style.backgroundImage = `url("${ASSETS_FOLDER}${value}")`
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
        this.model.style.backgroundSize = `${value[0]*100}% ${value[1]*100}%`
    }
    get tile_coordinate() {return this._tile}
    set tile_coordinate(value) {        // [0,0] is in lower left
        this._tile = value
        this.model.style.backgroundPosition = `${(this.tileset_size[0]-1)*value[0]*100}% ${(this.tileset_size[1]-1)*(this.tileset_size[1]-1-value[1])*100}%`
    }

    get roundness() {return this._roundness}
    set roundness(value) {
        this.model.style.borderRadius = `${value*Math.min(this.model.clientWidth, this.model.clientHeight)}px`
        this._roundness = value
    }
    get shadow() {return this._shadow}
    set shadow(value) {
        this._shadow = value
        if (value) {
            this.model.style.boxShadow = "5px 20px 40px black";
        }
        else {this.model.style.boxShadow = 'none'}
    }

    get text() {return this.model.textContent}
    set text(value) {
        this.model.textContent = value
    }
    get text_color() {return this.model.style.color}
    set text_color(value) {
        // if (!(value instanceof String)) {
        //     var alpha = 255
        //     if (value.length == 4) {
        //         alpha = value[3]
        //     }
        //     value = `rgba(${value[0]},${value[1]},${value[2]},${alpha})`
        // }
        this.model.style.color = value
    }
    get text_size() {return this._text_size}
    set text_size(value) {
        this._text_size = value
        this.model.style.fontSize = `${value}vh`
    }

    get text_origin() {return this._text_origin}
    set text_origin(value) {
        this._text_origin = value
        this.model.style.display = 'flex'
        this.model.style.textAlign = ['left', 'center', 'right'][(value[0]*2)+1]  // horizontally
        this.model.style.justifyContent = ['left', 'center', 'right'][(value[0]*2)+1]  // horizontally
        this.model.style.alignItems = ['flex-end', 'center', 'flex-start'][(value[1]*2)+1]  // vertically
    }

    get alpha() {return this.model.style.opacity}
    set alpha(value) {
        // print('set opac', value)
        this.model.style.opacity = value
        this._alpha = value
    }
    get padding() {return this._padding}
    set padding(value) {
        this._padding = value
        this.model.style.padding = `${value}em`
    }

    get on_click() {return this._on_click}
    set on_click(value) {
        this._on_click = value
        if (value && !this.ignore_collision) {
            this.model.style.pointerEvents = 'auto'
        }
        else {this.model.style.pointerEvents = 'none'}
    }
    get ignore_collision() {return this._ignore_collision}
    set ignore_collision(value) {
        this._ignore_collision = value
        if (!value) {
            this.model.style.pointerEvents = 'auto'
        }
        else {this.model.style.pointerEvents = 'none'}
    }

    get draggable() {return this._draggable}
    set draggable(value) {
        this._draggable = value
        if (value) {
            this.model.style.pointerEvents = 'auto'
        }
        else if (!this._on_click) {
            this.model.style.pointerEvents = 'none'
        }
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

    fit_to_text() {
        this.model.style.width = 'fit-content'
        this.model.style.height = 'fit-content'
    }

    look_at(target_pos) {
        this.rotation = -(Math.atan2(target_pos[1] - this.y, target_pos[0] - this.x)) * (180/Math.PI)
    }
}



function lerp(a, b, t) {
    // return (1-t)*a+t*b
    return a + (b - a) * t
    // return a * (1-t)+b * t
}
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function random_choice(list) {
    return list[random_int(0, len(list)-1)]
}

function Button(options) {
    if (!('parent' in options)) {
        options['parent'] = camera.ui
    }
    if (!('scale' in options)) {
        options['scale'] = [.2,.2]
    }
    if (!('roundness' in options)) {
        options['roundness'] = .2
    }
    if (!('text_origin' in options)) {
        options['text_origin'] = [0,0]
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

function Canvas(options) {
    var e = new Entity(options)
    var canvas = document.createElement('canvas');
    e.el.appendChild(canvas)

    return e
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
            // print(key, value)
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

mouse = {x:0, y:0, position:[0,0], left:false, middle:false, hovered_entity:null}


function mousedown(event) {
    _input(event)
    if (event.button > 0) {
        return
    }
    if (event.pointerType == 'mouse' || event.pointerType == 'touch') {
        mouse.pressure = 1
    }
    // else {
    //     mouse.pressure = event.originalEvent.pressure
    // }
    update_mouse_position(event)
    handle_mouse_click(event)
}
document.addEventListener('pointerdown', mousedown)


function handle_mouse_click(e) {
    // mouse.left = true
    element_hit = document.elementFromPoint(e.pageX - window.pageXOffset, e.pageY - window.pageYOffset);
    entity = entities[element_hit.entity_index]

    // print(element_hit)
    if (element_hit && entity) {
        if (entity.on_click) {
            entity.on_click()
        }
        if (entity.draggable) {
            window_position = game_window.getBoundingClientRect()
            entity.start_offset = [
                ((((e.clientX - window_position.left) / game_window.clientWidth) - .5) * asp_x) - entity.x,
                (-(((e.clientY - window_position.top) / game_window.clientHeight ) - .5) * asp_y) - entity.y
                ]
            // prinkt(entity.start_offset)

            entity.dragging = true
        }
    }
}

function mouseup(event) {
    // event.preventDefault()
    _input(event)
    mouse.left = false;
    for (var e of entities) {
        if (e.dragging) {
            e.dragging = false
            if (e.drop) {
                e.drop()
            }
        }
    }
}
document.addEventListener('pointerup', mouseup)


function update_mouse_position(event) {
    window_position = game_window.getBoundingClientRect()
    event_x = event.clientX
    event_y = event.clientY
    mouse.x = (((event_x - window_position.left) / game_window.clientWidth) - .5) * asp_x
    mouse.y = -(((event_y - window_position.top) / game_window.clientHeight ) - .5) / asp_y
    mouse.position = [mouse.x, mouse.y]
}

function onmousemove(event) {
    update_mouse_position(event)

    if (!mouse.hovered_entity) {
        mouse.point = null
    }
    else {
        var rect = event.target.getBoundingClientRect();
        var x = event.clientX - rect.left; //x position within the element.
        var y = event.clientY - rect.top;  //y position within the element.
        mouse.point = [(x/rect.width)-.5, .5-(y/rect.height)]
    }
    element_hit = document.elementFromPoint(event.pageX - window.pageXOffset, event.pageY - window.pageYOffset);
    entity = entities[element_hit.entity_index]
    if (entity) {
        mouse.hovered_entity = entity
    }
    else {
        mouse.hovered_entity = null
    }
    for (var e of entities) {
        if (e.dragging) {
            if (!e.lock_x) {
                // print(mouse.x, e.start_offset[0])
                e.x = mouse.x - e.start_offset[0]
                e.x = clamp(e.x, e.min_x, e.max_x)
                if (e.snap_x) {
                    hor_step = 1 / e.snap_x
                    e.x = round(e.x * hor_step) / hor_step
                }
            }
            if (!e.lock_y) {
                e.y = mouse.y - e.start_offset[1]
                e.y = clamp(e.y, e.min_y, e.max_y)
                if (e.snap_y) {
                    hor_step = 1 / e.snap_y
                    e.y = round(e.y * hor_step) / hor_step
                }
            }
            if (e.while_dragging) {
                // print('d', mouse.position, mouse.point)
                e.while_dragging()
            }
        }
    }
}

document.addEventListener('pointermove', onmousemove)

// function range(n) {return Array(n).keys()}
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

function Array_2d(w, h) {
    var tiles = new Array(w)
    for (var i = 0; i < tiles.length; i++) {
        tiles[i] = new Array(h);
    }
    return tiles
}

function len(arr) {
    return arr.length
}

String.prototype.count=function(c) {
  var result = 0, i = 0;
  for(i;i<this.length;i++)if(this[i]==c)result++;
  return result;
};
min = Math.min
max = Math.max
abs = Math.abs
floor = Math.floor
ceil = Math.ceil
math = Math
int = parseInt
function enumerate(list) {
    return list.entries()
}

function str(value) {
    return value.map(function(i){return String.fromCharCode(i)}).join("")
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
// from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function hsv(h, s, v) {
    h /= 360;
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    // return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
    // print('adwoiadjaoijdawd', [parseInt(r*255), parseInt(g*255), parseInt(b*255)])
    return [parseInt(r*255), parseInt(g*255), parseInt(b*255)];
}

function rgb_to_hsv(rgb_color) {
    r = rgb_color[0]
    g = rgb_color[1]
    b = rgb_color[2]
    // It converts [0,255] format, to [0,1]
    r = (r === 255) ? 1 : (r % 255 / parseFloat(255))
    g = (g === 255) ? 1 : (g % 255 / parseFloat(255))
    b = (b === 255) ? 1 : (b % 255 / parseFloat(255))
    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b)
    var h, s, v = max
    var d = max - min
    s = max === 0 ? 0 : d / max


    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }
    return [parseInt(h*360), s, v]
}

color = {}
color.white =         hsv(0, 0, 1)
color.smoke =         hsv(0, 0, 0.96)
color.light_gray =    hsv(0, 0, 0.75)
color.gray =          hsv(0, 0, 0.5)
color.dark_gray =     hsv(0, 0, 0.25)
color.black =         hsv(0, 0, 0)
color.red =           hsv(0, 1, 1)
color.orange =        hsv(30, 1, 1)
color.yellow =        hsv(60, 1, 1)
color.lime =          hsv(90, 1, 1)
color.green =         hsv(120, 1, 1)
color.turquoise =     hsv(150, 1, 1)
color.cyan =          hsv(180, 1, 1)
color.azure =         hsv(210, 1, 1)
color.blue =          hsv(240, 1, 1)
color.violet =        hsv(270, 1, 1)
color.magenta =       hsv(300, 1, 1)
color.pink =          hsv(330, 1, 1)
color.clear =         '#00000000'
// palette = [
//     '#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8',
//     '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA'
//     ]
// let filter_code = ''
// for (i = 0; i < palette.length; i++) {
//     let rgb = hex_to_rgb(palette[i])
//     let r = rgb.r/255
//     let g = rgb.g/255
//     let b = rgb.b/255
//     let redToBlue = `${r**2.4} 0 0 0 0  ${g**2.4} 0 0 0 0  ${b**2.4} 0 0 0 0  0 0 0 1 0`;
//     filter_code += `
//         <svg xmlns="http://www.w3.org/2000/svg">
//             <filter id="tint_filter_${i}">
//                 <feColorMatrix type="matrix" values="${redToBlue}" />
//             </filter>
//         </svg>
//     `
// }
// filters = document.createElement('div')
// game_window.appendChild(filters)
// filters.innerHTML = filter_code
// class TintableTile extends Entity {
//     get tint() {return this._tint}
//     set tint(value) {
//         this._tint = value
//         if (value < 16) {
//             this.el.model.style.filter = `url(#tint_filter_${value})`
//         }
//     }
//
// }
timeout_id = 0
function invoke(func, delay) {
    timeout_id = setTimeout(func, delay*1000)
}
function stop_all_invokes() {
    for (let i = timeout_id; i >= 0; i--) {
        window.clearInterval(i);
    }
}

round = Math.round

function Text(options) {
    if (!('scale' in options && !'scale_x' in options)) {
        options['scale_x'] = .8
    }
    if ('background' in options && options['background'] && !'color' in options) {
        if (options['background'] == true) {
            options['color'] = '#ffffff00'
            options['alpha'] = .9
        }
        else {
            options['color'] = options['background']
        }
        if (!'shadow' in options) {
            options['shadow'] = 1
        }
    }

    defaults = {'roundness':.05, 'padding':.75, 'z':-1, 'color':color.clear}
    for (const [key, value] of Object.entries(defaults)) {
        if (!(key in options)) {
            options[key] = value
        }
    }
    return new Entity(options)
}

sqrt = Math.sqrt

function distance(a, b) {
    return sqrt((b[0] - a[0])**2 + (b[1] - a[1])**2)
}

function magnitude(vec) {
    const x = vec[0], y = vec[1]
    const magSq = x * x + y * y
    return Math.sqrt(magSq)
}

function normalize(vec) {
    vec_length = magnitude(vec)
    if (vec_length == 0) {
        return vec
    }
    return [vec[0] / vec_length, vec[1] / vec_length]
}

function dot_product(vector1, vector2) {
  let result = 0;
  for (let i = 0; i < vector1-length; i++) {
    result += vector1[i] * vector2[i];
  }
  return result;
}


function sample(population, k){
    if(!Array.isArray(population))
        throw new TypeError("Population must be an array.");
    var n = population.length;
    if(k < 0 || k > n)
        throw new RangeError("Sample larger than population or is negative");

    var result = new Array(k);
    var setsize = 21;   // size of a small set minus size of an empty list

    if(k > 5)
        setsize += Math.pow(4, Math.ceil(Math.log(k * 3) / Math.log(4)))

    if(n <= setsize){
        // An n-length list is smaller than a k-length set
        var pool = population.slice();
        for(var i = 0; i < k; i++){          // invariant:  non-selected at [0,n-i)
            var j = Math.random() * (n - i) | 0;
            result[i] = pool[j];
            pool[j] = pool[n - i - 1];       // move non-selected item into vacancy
        }
    }else{
        var selected = new Set();
        for(var i = 0; i < k; i++){
            var j = Math.random() * n | 0;
            while(selected.has(j)){
                j = Math.random() * n | 0;
            }
            selected.add(j);
            result[i] = population[j];
        }
    }

    return result;
}
function destroy(entity) {
    entity.el.remove()
    delete entity
}

function save_system_save(name, value) {localStorage.setItem(name, value)}
function save_system_load(name) {return localStorage.getItem(name)}
function save_system_clear() {localStorage.clear()}

savesystem = {save:save_system_save, load:save_system_load, clear:save_system_clear}
delta_time = 1/60
let start, previousTimeStamp;
update = null
function _step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    if (update) {
        update()
    }

    for (var e of entities) {
        if (e.update) {
            e.update()
        }
    }

    delta_time = (timestamp - previousTimeStamp) / 1000
    previousTimeStamp = timestamp
    window.requestAnimationFrame(_step);
}
window.requestAnimationFrame(_step)


class Camera{
  constructor(options=null) {
      this.el = document.createElement('entity')
      game_window.appendChild(this.el)
      this.el.className = 'entity'
      // this.el.style.height = scene.style.height
      // this.el.style.width = scene.style.width
      this.el.id = 'camera'
      this.children = []
      this._x = 0
      this._y = 0
      this.fov = 1
  }

  get x() {return this._x}
  set x(value) {
      this._x = value
      if (format == 'vertical') {
          scene.style.left = `${50+(-value*100/this.fov)}%`
      }
      else {
          scene.style.left = `${50+(-value*100/asp_x/this.fov)}%`
      }
  }
  get y() {return this._y}
  set y(value) {
      this._y = value
      if (format == 'vertical') {
          scene.style.top = `${50+(value*100*asp_y/this.fov)}%`
      }
      else {
          scene.style.top = `${50+(value*100/this.fov)}%`
      }
  }
  // get z() {return this._z}
  // set z(value) {
  //     scene.style.zIndex = -value
  //     this._z = value
  // }
  get xy() {return [this._x, this._y]}
  set xy(value) {
      this.x = value[0]
      this.y = value[1]
  }
  get xyz() {return [this._x, this._y, this._z]}
  set xyz(value) {
      this.x = value[0]
      this.y = value[1]
      // this.z = value[2]
  }
  get position() {return this.xyz}
  set position(value) {
      if (value.length == 2) {this.xy = value}
      if (value.length == 3) {this.xy = [value[0], value[1]]}
  }
  get rotation() {return this._rotation}
  set rotation(value) {
      this._rotation = value
      scene.style.transform = `rotate(${-value}deg)`
  }
  get fov() {return self._fov}
  set fov(value) {
      self._fov = value
      scene.style.width = `${1/value*100/asp_x}%`

      if (format == 'vertical') {
          scene.style.height = `${1/value*100/asp_x*asp_y}%`
      }
      else {
          scene.style.height = `${1/value*100/asp_y}%`
      }

  }
}
camera = new Camera({})
camera.ui = new Entity({name:'ui', scale:[1,1], visible_self:false, z:-100})

held_keys = {}
all_keys = `<zxcvbnm,.-asdfghjkløæ'qwertyuiopå¨1234567890+`
for (var i = 0; i < all_keys.length; i++) {
    held_keys[all_keys[i]] = 0
}
held_keys['mouse left'] = false
held_keys['mouse middle'] = false

input = null
function _input(event) {
    if (event.type == 'mousewheel') {
        if (event.deltaY > 0) {key = 'scroll down'}
        else {key = 'scroll up'}
    }
    else if (event.type == 'pointerdown') {
        if (event.button == 0) {key = 'left mouse down'; mouse.left=true; held_keys['mouse left']=true}
        else if (event.button == 1) {key = 'middle mouse down'; mouse.middle=true; held_keys['mouse middle']=true}
    }
    else if (event.type == 'pointerup') {
        if (event.button == 0) {key = 'left mouse up'; mouse.left=false; held_keys['mouse left']=false}
        else if (event.button == 1) {key = 'middle mouse up'; mouse.middle=false; held_keys['mouse middle']=false}
    }

    else {
        key = event.key.toLowerCase()
    }

    if (key == ' ') {
        key = 'space'
    }

    if (event.type == "keyup") {
        held_keys[key] = 0
        key = key + ' up'
    }
    else if (!held_keys[key]){
        held_keys[key] = 1
    }
    else if (event.type == "keydown") {  // prevent key repeat
        return
    }


    for (var e of entities) {
        if (e.input && e.enabled) {
            e.input(key)
        }
    }
    if (input) {
        input(key)
    }
}
document.addEventListener('keydown', _input)
document.addEventListener('keyup', _input)
document.addEventListener('mousewheel', _input); // modern desktop



// 3D
engine_3d = new Object();

function load_3d() {
  gl_canvas = document.createElement('canvas')
  gl_canvas.name = "gl_canvas"
  gl_canvas.id = "game"
  gl_canvas.width = 1920 / 2
  gl_canvas.height = 1080 / 2
  gl_canvas.style.zIndex = -1
  game_window.appendChild(gl_canvas)

  main();

  //
  // Start here
  //
  function main() {
    const gl = gl_canvas.getContext('webgl');
    // If we don't have a GL context, give up now
    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }
    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      }
    `;
    // Fragment shader program
    const fsSource = `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);
    const modelViewMatrix = glMatrix.mat4.create();
    engine_3d.modelViewMatrix = modelViewMatrix
    // Draw the scene
    drawScene(gl, programInfo, buffers);
    print("init 3d")
    function render() {
        print('render')
        drawScene(gl, programInfo, buffers);
    }
    engine_3d.render = render
  }

  // initBuffers
  //
  // Initialize the buffers we'll need. For this demo, we just
  // have one object -- a simple two-dimensional square.
  function initBuffers(gl) {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Now create an array of positions for the square.
    const verts = [
       1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(verts),
                  gl.STATIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER,
    //               new Float32Array([
    //                  3.0,  1.0,
    //                  2.0,  1.0,
    //                  3.0, -1.0,
    //                  2.0, -1.0,
    //               ]),
    //               gl.STATIC_DRAW);
    return {
      position: positionBuffer,
    };
  }

  //
  // Draw the scene.
  //


  // Initialize a shader program, so WebGL knows how to draw our data
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }
  // creates a shader of the given type, uploads the source and
  // compiles it.
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    // Send the source to the shader object
    gl.shaderSource(shader, source);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
}
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(1.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const aspect = 16/9;
  // print('--------', aspect)
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = glMatrix.mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  glMatrix.mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.


  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  glMatrix.mat4.translate(engine_3d.modelViewMatrix,     // destination matrix
                 engine_3d.modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // glMatrix.mat4.rotateX(modelview, modelview, radians);
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);
  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, engine_3d.modelViewMatrix);
  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}
