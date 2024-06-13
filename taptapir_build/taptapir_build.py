import sys
from pathlib import Path
import re
import base64


print('Building file:', sys.argv)
if len(sys.argv) <= 1:
    raise Exception('Please specify target .html file to build')

with open(sys.argv[1], 'r') as source_file:
    all_html_code = source_file.read()
    if not all_html_code:
        raise Exception(f'Error: File is empty: {source_file}')


# print(all_html_code)
delimiter = "<script type='text/sunsnake'>"
sunsnake_code_blocks = (delimiter + all_html_code.split(delimiter, 1)[1]).split(delimiter)

combined_sunsnake_code = ''
for part in sunsnake_code_blocks:
    combined_sunsnake_code += part.split("</script>")[0]

# print(combined_sunsnake_code)

# pattern = r"texture\s*=\s*'(.*?)'"
# texture_names = re.findall(pattern, combined_sunsnake_code)
#
# textures_as_base_64_strings = dict()
# [print(i, e) for i, e in enumerate(texture_names)]
# for name in texture_names:
#     suffix = 'png'
#     if '.' in name:
#         suffix = name.split('.')[1]
#
#     with open(name, "rb") as image_file:
#         textures_as_base_64_strings[name] = f'data:image/{suffix};base64,' + base64.b64encode(image_file.read()).decode('utf-8')
#
# # for name in texture_names:
# #     combined_sunsnake_code = combined_sunsnake_code.replace(f"texture='{name}'", f"texture=TAPTAPIR_TEXTURES['{name}']")
#
# textures_as_base_64_strings = '{' + '\n\n'.join(f"'{key}' : '{value}', " for key, value in textures_as_base_64_strings.items()) + '\n}'
# combined_sunsnake_code = f'TAPTAPIR_TEXTURES = {textures_as_base_64_strings}\n {combined_sunsnake_code}'
# print(combined_sunsnake_code)

package_folder = Path(__file__).parent

title = Path(sys.argv[1]).stem.replace('_',' ').title()

with open((package_folder.parent / 'taptapir' / 'taptapir.js'), 'r') as f:
    taptapir_source = f.read()

with open((package_folder.parent / 'taptapir' / 'sunsnake_compiler.js'), 'r') as f:
    sunsnake_compiler_source = f.read()


with open((Path(sys.argv[1]).stem + '_build.html'), 'w') as out_file:
    out_file.write((f'''
<html>
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<title>{title}</title><link rel="icon" href="icon.png">
</head><body></body>
<script type='text/javascript'>
{taptapir_source}
</script>

<script type='text/sunsnake'>
{combined_sunsnake_code}
</script>

<script type='text/javascript'>
{sunsnake_compiler_source}
</script>
</html>
''')
    )
