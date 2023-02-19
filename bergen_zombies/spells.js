script_tag = document.createElement('script')
document.head.appendChild(script_tag);
script_tag.type = 'text/sunsnake'
script_tag.textContent = `


spells = [
class Shotgun:
    description = 'powerful blast, lots of damage'
    damage = 10
    cost = 2
    use = def():
        print('use')
,
class Hunting_Rifle:
    description = 'shoot target'
    damage = 5
    cost = 6
    use = def():
        print('shoot')
]

spells = [new e() for e in spells]


        # 'action' :
        # def cast(target):
        #     print('cast spell on target:', target)
# ]
# spells = [
#     Shotgun,
#     Hunting Rifle,
#     Nail Gun,
#     Plank,
#     Bat,
#     Pallet,
#     Fire Axe,
#     Flamethrower,
#     Molotov Cocktail,
#     Shovel,
#     Excavator,
#     Cobblestone,
#     Snowball,
#     Hose,
#     Icicle,
#     Police Shield,
#     Bike Helmet,
#     Boots,
#     Bandages,
#     Canned Food,
#     Barrel Fire,
# ]
print('spells', spells)
`
