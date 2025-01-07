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

function Array2D(w, h) {
    var tiles = new Array(w)
    for (var i = 0; i < tiles.length; i++) {
        tiles[i] = new Array(h);
    }
    return tiles
}
True = true
False = false


function volume(e) {
    return e[0] * e[1] * e[2]}
function create_shapes(size) {
    size_x = size[0]
    size_y = size[1]
    size_z = size[2]
    sizes = range(size_x*size_y*size_z).map(i => [0,0,0])
    i = 0
    for (const x of range(size_x)) {
        for (const y of range(size_y)) {
            for (const z of range(size_z)) {
                sizes[i] = [x+1,y+1,z+1]
                i += 1}}}
    return sizes}
function grid_to_cubes(grid, grid_size) {
    grid_size_x = grid_size[0]
    grid_size_y = grid_size[1]
    grid_size_z = grid_size[2]
    shapes = create_shapes(grid_size)
    filled = range(grid_size_x).map(x => Array2D(grid_size_z, grid_size_y))
    for (const x of range(grid_size_x)) {
        for (const y of range(grid_size_y)) {
            for (const z of range(grid_size_z)) {
                filled[x][y][z] = 0}}}
    cubes = []
    num_solid_blocks = 0
    for (const x of range(grid_size_x)) {
        for (const y of range(grid_size_y)) {
            for (const z of range(grid_size_z)) {
                if (grid[x][y][z]) {
                    num_solid_blocks += 1}}}}
    for (const shape of shapes) {
        w = shape[0]
        h = shape[1]
        d = shape[2]
        for (const x of range(grid_size_x - w + 1)) {
            for (const y of range(grid_size_y - h + 1)) {
                for (const z of range(grid_size_z - d + 1)) {
                    if (filled[x][y][z]) {
                        continue}
                    if (shape_fits_in_grid(grid, [x,y,z], shape, filled)) {
                        cubes.push(([x,y,z], shape))
                        for (const _x of range(w)) {
                            for (const _y of range(h)) {
                                for (const _z of range(d)) {
                                    filled[x+_x][y+_y][z+_z] = 1
                                    num_solid_blocks -= 1}}}
                        if (num_solid_blocks == 0) {
                            return cubes}}}}}}
    return cubes}
function shape_fits_in_grid(grid, start_position, shape, filled) {
    w = shape[0]
    h = shape[1]
    d = shape[2]
    for (const x of range(w)) {
        for (const y of range(h)) {
            for (const z of range(d)) {
                if (filled[x+start_position[0]][y+start_position[1]][z+start_position[2]]) {
                    return False}
                if (! grid[start_position[0]+x][start_position[1]+y][start_position[2]+z]) {
                    return False}}}}
    return True}
size = 16
grid = range(size).map(i => Array2D(size,size))
for (const x of range(size)) {
    for (const y of range(size)) {
        for (const z of range(size)) {
            grid[x][y][z] = 0}}}
for (const x of range(size)) {
    for (const y of range(1)) {
        for (const z of range(size)) {
            grid[x][y][z] = 1}}}
for (const x of range(2,5)) {
    for (const z of range(2,5)) {
        for (const y of range(1,4)) {
            grid[x][y][z] = 1}}}
// console.time("test");
cubes = grid_to_cubes(grid, [16,16,16])
// console.timeEnd("test");
// set_window_color('gold')
print(cubes)
