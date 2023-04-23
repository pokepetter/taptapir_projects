script_tag = document.createElement('script')
document.head.appendChild(script_tag);
script_tag.type = 'text/sunsnake'
script_tag.textContent = `


spells = [
class Shotgun:
    description = \`If target's hp is less than 30%, deal an extra 15% damage. Lost 1hp\`
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/sawed-off-shotgun.svg'
    damage = 10
    cost = 2
    cooldown = 8
    use = def():
        print('use')
,
class Hunting_Rifle:
    description = "If target is full health, deal double damage"
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/skoll/winchester-rifle.svg'
    damage = 5
    cost = 6
    cooldown = 3
    use = def():
        print('')
,
class Nail_Gun:
    description = 'shoot target'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/lorc/nailed-foot.svg'
    damage = 5
    cost = 6
    cooldown = 2
    use = def():
        print('shoot')
,
class Plank:
    description = 'shoot target'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/wood-beam.svg'
    damage = 2
    cost = 2
    cooldown = 2
    use = def():
        print('shoot')
,
class Bat:
    description = 'shoot target'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/baseball-bat.svg'
    damage = 5
    cost = 2
    cooldown = 3
    use = def():
        print('shoot')
,
class Chainsaw:
    description = 'shoot target'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/chainsaw.svg'
    damage = 10
    cost = 5
    cooldown = 5
    use = def():
        print('shoot')
,
class Rope:
    description = 'shoot target'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/lasso.svg'
    damage = 5
    cost = -2
    cooldown = 3
    use = def():
        print('shoot')
,

class Flamethrower:
    description = 'BURN THEM ALL!'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/flamethrower-soldier.svg'
    damage = 6
    cost = 4
    cooldown = 5
,
class Bandages:
    description = 'heal'
    icon = 'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/arm-bandage.svg'
    damage = -6
    cost = 3
    cooldown = 3
,
class Axe:
    icon = 'https://cdn-icons-png.flaticon.com/512/809/809037.png'
    damage = 3
    cost = 3
    cooldown = 3


]


spells = [new e() for e in spells]
spells_dict = {}
for e in spells:
    spells_dict[e.constructor.name] = e
spells = spells_dict
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
#     Rope,
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
// fire/smoke zombie
// root/plant zombie
// sand/drought/mud zombie
// snow/ice/water zombie
//
// trash zombie
//
// fire -> plants -> sand -> snow -> fire
