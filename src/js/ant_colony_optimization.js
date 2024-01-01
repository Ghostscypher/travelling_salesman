class Point {
    constructor(x, y, index) {
        this.position = createVector(x, y);
        this.index = index;
    }

    show() {
        push();
        stroke(255);
        noFill();
        ellipse(this.position.x, this.position.y, 10, 10);

        // Draw pheromone
        for (let key in this.pheromone) {
            let other_index = parseInt(key.replace(this.index, ''));
            let other = points[other_index];

            stroke(255, 0, 255, (255 / this.pheromone[key]) % 100);
            strokeWeight(1);
            line(this.position.x, this.position.y, other.position.x, other.position.y);
        }

        pop();


        push();
        fill(255);
        text(this.index, this.position.x + 5, this.position.y);
        pop();
    }
}

class Ant {
    constructor(point) {
        this.path = [];
        this.pheromone = {};
        this.evaporation_rate = 0.9;
        this.distance = 0;

        this.position = point.position;
        this.color = color(random(255), 255, 255);
        this.point = this.start_point = point;
        this.visited_all = false;

        this.path.push(point);
    }

    getDistance(other_point, distances) {
        let key = `${this.point.index <= other_point.index ? this.point.index : other_point.index}`;
        key += `${other_point.index >= this.point.index ? other_point.index : this.point.index}`;

        return distances[key] || 0;
    }

    chooseNextNode(points, distances, pheromones, distance_weight = 1, pheromone_weight = 1) {
        if (this.visited_all) {
            return null;
        }

        let desirability = [];
        let desirability_sum = 0;

        for (let point of points) {
            // Skip point we've already visited or is the current point
            if (this.path.includes(point)) {
                continue;
            }

            let key = `${this.point.index <= point.index ? this.point.index : point.index}`;
            key += `${point.index >= this.point.index ? point.index : this.point.index}`;

            let distance = this.getDistance(point, distances);
            let pheromone = pheromones[key] || 1;

            if (distance === 0) {
                continue;
            }

            desirability[point.index] = Math.pow(1 / distance, distance_weight) * Math.pow(pheromone, pheromone_weight);
            desirability_sum += desirability[point.index];
        }

        // If there are no more points to visit, return null
        if (desirability_sum === 0) {
            return null;
        }

        // If length is 1, return the only point
        if (desirability.length === 1) {
            return points[0];
        }

        // For each desirability, create a probability
        let desirability_probabilities = [];
        let prev = 0;
        for (let key of desirability) {
            // If empty key, skip
            if (!key) {
                desirability_probabilities.push(null);
                continue;
            }

            desirability_probabilities.push(prev + (key / desirability_sum));
            prev = desirability_probabilities[desirability_probabilities.length - 1];
        }

        // console.log(desirability, desirability_sum, desirability_probabilities);

        // Choose a random point based on desirability
        let next = null;
        let random_val = random(1);

        // Loop through desirability probabilities and choose the point
        // that corresponds to the random value
        for (let i = 0; i < desirability_probabilities.length; i++) {
            if (!desirability_probabilities[i]) {
                continue;
            }

            if (random_val <= desirability_probabilities[i]) {
                next = points[i];
                break;
            }
        }

        // noLoop();
        return next;
    }

    update(points, distances, pheromones) {
        // Move to the next node
        let next = this.chooseNextNode(points, distances, pheromones, 5, 1);

        // If there is no next node, we've reached the end of the path
        if (!next) {
            // Add distance to return to start
            this.distance += this.getDistance(this.start_point, distances);
            this.path.push(this.start_point);
            this.visited_all = true;

            return;
        }

        // Draw path to next node
        this.showPath(next);
        this.path.push(next);
        this.distance += this.getDistance(next, distances);
        this.point = next;
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, 2, 5);
        pop();
    }

    showPath(next) {
        push();
        this.color.setAlpha(40);
        stroke(this.color);
        strokeWeight(1);
        line(this.position.x, this.position.y, next.position.x, next.position.y);
        pop();
    }
}