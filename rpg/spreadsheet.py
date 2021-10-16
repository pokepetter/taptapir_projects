#
# if (fields[0] == 'name') {
#     dict = {}
#     for (i = 0; i < data.length; i += fields.length) {
#         dict[data[i]] = {}
#         for (j = 0; j < fields.length; i++) {
#             dict[data[i]][fields[j]] = data[i+j]
#         }
#     }
#     return dict
# }


def spreadsheet_dict(fields, data):
    container = {}
    for i in range(0, len(data), len(fields)):
        print('--', data[i])
        # container[data[i]] = 'lol'

        sub_dict = {}
        for j, field_name in enumerate(fields[1:]):
            sub_dict[field_name] = data[i+j]

        container[data[i]] = sub_dict

    print(container)
    return container



spreadsheet_dict([
'name',        'amount', 'sell_value'], [

'ruby',          1,        10,
'plank',         2,        10,
'bone',          3,        10,
'axe',           4,        10,

])
