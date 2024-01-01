let num_nodes = 20;
let ant_size = 50;
let points = [];
let ants = [];
let best_path = null;
let best_distance = Infinity;
let evaporation_rate = 0.9;
let ant_generation = 0;
let ant_generations = 150;

let distances = {};
let pheromones = {};

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 255);

    // Add ants
    resetPoints();
    resetAnts();
    initializePheromones(points);

    // Set frame rate
    frameRate(10);
}

function resetPoints() {
    points = [];
    distances = {};

    for (let i = 0; i < num_nodes; i++) {
        points.push(new Point(random(width), random(height), i));
    }

    // Calculate distances between nodes
    let key = '';

    for (let point of points) {
        for (let other of points) {
            if (point.index == other.index) {
                continue;
            }

            key = `${point.index <= other.index ? point.index : other.index}`;
            key += `${other.index >= point.index ? other.index : point.index}`;

            if (point === other || distances[key]) {
                continue;
            }

            distances[key] = point.position.dist(other.position);
        }
    }

}

function resetAnts() {
    ants = [];

    // Create ants, the number of ants is equal to the number of nodes at most
    for (let i = 0; i < ant_size; i++) {
        let p = points[i % points.length];
        ants.push(new Ant(p));
        // ants.push(new Ant(random(points)));
    }

    ant_generation++;
}

function initializePheromones(points) {
    let key = '';
    pheromones = {};

    for (let point of points) {
        for (let other of points) {
            if (point.index == other.index) {
                continue;
            }

            key = `${point.index <= other.index ? point.index : other.index}`;
            key += `${other.index >= point.index ? other.index : point.index}`;

            if (point === other || pheromones[key]) {
                continue;
            }

            pheromones[key] = 0;
        }
    }
}

function updatePheromones(path, distance) {
    let key = '';

    for (let i = 0; i < path.length - 1; i++) {
        key = `${path[i].index <= path[i + 1].index ? path[i].index : path[i + 1].index}`;
        key += `${path[i + 1].index >= path[i].index ? path[i + 1].index : path[i].index}`;

        pheromones[key] = pheromones[key] || 1;

        // Evaporate pheromones
        pheromones[key] *= evaporation_rate;

        // Update pheromones
        pheromones[key] += Math.pow(1 / distance, 2);
    }
}

function drawPath(points, best = false) {
    let c = best ? color(255, 0, 255) : color(255, 255, 200);

    push();
    stroke(c);
    strokeWeight(best ? 2 : 1);
    noFill();
    beginShape();
    for (let point of points) {
        vertex(point.position.x, point.position.y);
    }
    endShape(CLOSE);
    pop();
}

function drawPoints(points) {
    for (let point of points) {
        point.show();
    }
}

function drawAnts(ants) {
    for (let ant of ants) {
        ant.show();
    }
}

function calculatePathDistance(points_index) {
    let distance = 0;
    let key = '';

    for (let i = 0; i < points_index.length - 1; i++) {
        key = `${points_index[i] <= points_index[i + 1] ? points_index[i] : points_index[i + 1]}`;
        key += `${points_index[i + 1] >= points_index[i] ? points_index[i + 1] : points_index[i]}`;

        distance += distances[key] || 0;
    }

    return distance;
}

function drawPheromones(pheromones) {
    let key = '';

    for (let point of points) {
        for (let other of points) {
            if (point.index == other.index) {
                continue;
            }

            key = `${point.index <= other.index ? point.index : other.index}`;
            key += `${other.index >= point.index ? other.index : point.index}`;

            if (point === other || !pheromones[key]) {
                continue;
            }

            stroke(255, 0, 255, (255 / pheromones[key]) % 50);
            strokeWeight(1);
            line(point.position.x, point.position.y, other.position.x, other.position.y);
        }
    }
}

function keyPressed() {

    if (key === 'p' || key === 'P') {
        if (isLooping()) {
            noLoop();
        } else {
            loop();
        }
    }

    if (key === 'r' || key === 'R') {
        ant_generation = 0;
        best_path = null;
        best_distance = Infinity;

        resetPoints();
        resetAnts();
        initializePheromones(points);

        loop();
    }
}

function draw() {
    background(0);
    drawPoints(points);
    // drawPath(points);
    drawAnts(ants);
    drawPheromones(pheromones);

    // Update ants
    let finished_count = 0;

    for (let ant of ants) {
        if (ant.visited_all) {
            finished_count++;
            continue;
        }

        ant.update(points, distances, pheromones);
    }

    // If all ants have visited all nodes, then evaluate the best path
    // and set the pheromone trails
    if (finished_count === ants.length && ants.length > 0) {
        let best_ant = null;

        // Reset pheromone trails
        for (let ant of ants) {
            if (ant.distance < best_distance) {
                best_distance = ant.distance;
                best_path = ant.path;
                best_ant = ant;
            }
        }

        // Set pheromone trails
        updatePheromones(best_path, best_distance);

        // Reset ants
        resetAnts();
        // noLoop();

        // console.log(best_path, best_distance);
    }

    // If the best path is set, draw it
    if (best_path) {
        drawPath(best_path, true);
        // noLoop();
    }

    // Text data
    push();
    fill(255);
    textSize(12);
    text(`Generation: ${ant_generation}/${ant_generations}`, 20, 40);
    text(`Best Distance: ${best_distance}`, 20, 60);
    pop();

    // If the number of generations has been reached, stop looping
    if (ant_generation >= ant_generations) {
        noLoop();
    }

}