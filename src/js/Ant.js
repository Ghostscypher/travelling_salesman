class Ant {
    constructor(point) {
        this.path = [];
        this.distance = 0;

        this.position = point.position;
        this.color = color(random(255), 255, 255);
        this.point = point;
        this.visited_all = false;

        this.path.push(point);
    }

    getDistance(other_point, distances) {
        let key = `${this.point.index <= other_point.index ? this.point.index : other_point.index}`;
        key += `${other_point.index >= this.point.index ? other_point.index : this.point.index}`;

        return distances[key] || 0;
    }

    chooseNextNode(points, distances, distance_weight = 1, pheromone_weight = 1) {
        if (this.visited_all) {
            return null;
        }

        let desirability = {};

        for (let point of points) {
            // Skip point we've already visited or is the current point
            if (this.path.includes(point) || point === this.point) {
                continue;
            }

            let distance = this.getDistance(point, distances);
            // let pheromone = point.pheromone[this.point.index] || 0;
            if (distance === 0) {
                continue;
            }

            desirability[point.index] = Math.pow(1 / distance, distance_weight);
            // desirability *= pow(1 / pheromone, pheromone_weight);
        }

        // Choose a random point based on desirability
        let total = 0;

        for (let key in desirability) {
            total += desirability[key];
        }

        let sum = 0;
        let next = null;
        let random_value = random(1);

        for (let key in desirability) {
            sum += desirability[key] / total;

            if (sum >= random_value) {
                next = points[key];
                break;
            }
        }

        return next;
    }

    update(points, distances) {
        // Move to the next node
        let next = this.chooseNextNode(points, distances, 1, 1);

        // If there is no next node, we've reached the end of the path
        if (!next) {
            this.visited_all = true;
            return;
        }

        // Draw path to next node
        this.showPath(next);

        this.path.push(next);
        this.position = next.position;
        this.distance += this.getDistance(next, distances);
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, 5, 5);
        pop();
    }

    showPath(next) {
        push();
        stroke(this.color);
        strokeWeight(1);
        line(this.position.x, this.position.y, next.position.x, next.position.y);
        pop();
    }
}