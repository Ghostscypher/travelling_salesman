# Travelling Salesman Problem (TSP) - Ant Colony Optimization (ACO)

## Introduction

Travelling Salesman Problem (TSP) is a well known problem in computer science. It is a NP-hard problem in combinatorial optimization. The problem is to find the shortest path that visits every vertex exactly once. The problem is also known as Hamiltonian cycle problem. The problem is named after the analogy of a salesman who wants to visit every city exactly once and return to the starting city. The problem is also known as the shortest path problem in graph theory. The problem states that given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the origin city. When we bruteforce we have `n!` options to choose from. This is a very large number. For example, if we have 10 cities, we have `10! = 3628800` options to choose from. If we have 100 cities, we have `100! = 9.332622e+157` options to choose from. This is a very large number. We can use a genetic algorithm to solve this problem. We can also use an ant colony optimization algorithm to solve this problem. In this project, we will use an ant colony optimization algorithm to solve this problem.

## Installation

To run the simulation, simply clone the repository and open the `index.html` file in your browser. Alternatively, you can visit the [GitHub Pages](https://ghostscypher.github.io/travelling_salesman/src/index.html) for this repository.

## Implementation

Ant colony optimization is a probabilistic technique for solving computational problems which can be reduced to finding good paths through graphs. Artificial Ants stand for multi-agent methods inspired by the behavior of real ants. The pheromone-based communication of biological ants is often the predominant paradigm used. Combinations of Artificial Ants and local search algorithms have become a method of choice for numerous optimization tasks involving some sort of graph, e.g., vehicle routing and internet routing.

The basic idea is suppose a random `m` ants are each placed on a random node, then they randomly visit a node based on some desireability value and pheromone value. Once the ants visit all the nodes, we evaluate the best paths and update the pheromone value based on the best paths. We repeat this process for `n` iterations. At the end of `n` iterations, we will likely have the best path. Note that we are not assured to have the best path. We can increase the number of ants and the number of iterations to increase the probability of finding the best path.

This video by Sebastian Lague explains the algorithm: [Travelling Salesman Problem (TSP) - Ant Colony Optimization (ACO)](https://www.youtube.com/watch?v=X-iSQQgOd1A&t=200s&ab_channel=SebastianLague)

We can further optimize and use the best path we have gotten and do some random swaps for a given alpha value. This is called local search in which we now search for the best path from the given output of the current one.

In my implementation, I have found using at least `(n*2)` ants improves the number of iterations before a steady solution is settled on.

Do note that however I have not implemented the local search optimization.

## Demo

<img src="https://raw.githubusercontent.com/ghostscypher/travelling_salesman/output/demo.gif" alt="Travelling Salesman Problem">

## References

1. [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
2. [Fractals](https://en.wikipedia.org/wiki/Fractal)
3. [P5 JS](https://p5js.org/)
4. [P5 JS Reference](https://p5js.org/reference/)
5. [P5 JS Examples](https://p5js.org/examples/)
6. [P5 JS Web Editor](https://editor.p5js.org/)
7. [Coding train - P5 JS Tutorials](https://www.youtube.com/user/shiffman/playlists?view=50&sort=dd&shelf_id=14)
8. [The Nature of Code](https://natureofcode.com/)
9. [The Coding Train](https://thecodingtrain.com/)
10. [Travelling Salesman Problem (TSP) - Ant Colony Optimization (ACO)](https://www.youtube.com/watch?v=X-iSQQgOd1A&t=200s&ab_channel=SebastianLague)
11. [Coding train - Travelling Salesman Problem](https://www.youtube.com/watch?v=BAejnwN4Ccw&ab_channel=TheCodingTrain)