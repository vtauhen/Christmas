export default function(x, y, giftsCount) {

    // Establish variables and starting grid
    var totalCells = x * y;
    var cells = new Array();
    var unvis = new Array();
    for (var i = 0; i < y; i++) {
        cells[i] = new Array();
        unvis[i] = new Array();
        for (var j = 0; j < x; j++) {
            cells[i][j] = [0, 0, 0, 0, 0];
            unvis[i][j] = true;
        }
    }

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Set a random position to start from
    var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    var path = [currentCell];
    unvis[currentCell[0]][currentCell[1]] = false;
    var visited = 1;

    // Pregenerate gift distribution
    var giftCells = shuffle(Array(giftsCount).fill(1).concat(Array(totalCells - giftsCount - 1).fill(0)));

    // Loop through all available cell positions
    while (visited < totalCells) {
        // Determine neighboring cells
        var pot = [
            [currentCell[0] - 1, currentCell[1], 0, 2],
            [currentCell[0], currentCell[1] + 1, 1, 3],
            [currentCell[0] + 1, currentCell[1], 2, 0],
            [currentCell[0], currentCell[1] - 1, 3, 1]
        ];
        var neighbors = new Array();

        // Determine if each neighboring cell is in game grid, and whether it has already been checked
        for (var l = 0; l < 4; l++) {
            if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) {
                neighbors.push(pot[l]);
            }
        }

        // If at least one active neighboring cell has been found
        if (neighbors.length) {
            // Choose one of the neighbors at random
            var next = neighbors[Math.floor(Math.random() * neighbors.length)];

            // Remove the wall between the current cell and the chosen neighboring cell
            cells[currentCell[0]][currentCell[1]][next[2]] = 1;
            cells[next[0]][next[1]][next[3]] = 1;

            // Check if we will be pushing a gift there
            if (giftCells[visited - 1] == 1) {
                cells[next[0]][next[1]][4] = 1;
            }

            // Mark the neighbor as visited, and set it as the current cell
            unvis[next[0]][next[1]] = false;
            visited++;
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        // Otherwise go back up a step and keep going
        else {
            currentCell = path.pop();
        }
    }
    return cells;
}
