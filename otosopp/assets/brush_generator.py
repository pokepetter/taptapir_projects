import base64
import json


brushes = dict(
    round_bitmap_brush = ["round_brush_16.png", ],
    poke_brush = ["pokebrush.png", ],
    painterly_brush = ["RGBA anim 01.png", "RGBA anim 02.png", "RGBA anim 03.png", "RGBA anim 04.png"],
    starfield_brush = ["starfield.png", ],
    star_brush = ['star_brush.png', ],
    heavypaint_dry = ['heavypaint_dry.png', ],
    heavypaint_dry_2 = ['heavypaint_dry_2.png', ],
    chaos = ['chaos_0.png', 'chaos_1.png', 'chaos_2.png'],
)

brushes_as_strings = {}
for key, value in brushes.items():
    images = []
    for image_name in value:
        with open(image_name, "rb") as image_file:
            prefix = f'data:image/png;base64,'
            data = base64.b64encode(image_file.read()).decode('utf-8')
            brushes_as_strings[image_name] = prefix + data
            print('converted:', image_name)

json_object = json.dumps(brushes_as_strings, indent=4)

with open('base_64_brushes.js', 'w', encoding='utf-8') as file:
    file.write('brush_textures = ' + json_object)
