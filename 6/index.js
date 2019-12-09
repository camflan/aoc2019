const fs = require("fs")

const compose = (...fns) => x => fns.reduceRight((input, fn) => fn(input), x)
const map = fn => xs => xs.map(fn)
const splitOn = char => x => x.split(char)
const readFile = path => fs.readFileSync(path).toString("utf8")

function main(input) {
    console.log("input", input)
    const graph = new Map()
    const transverseGraph = new Map()

    const addEdge = graph => (start, end) => {
        if (graph.has(start)) {
            graph.set(start, [...graph.get(start), end])
        } else {
            graph.set(start, [end])
        }
    }

    //let totalDepth = 0
    const walkGraph = (start, filter = null, seen = [], depth = 0) => {
        //totalDepth = totalDepth + depth
        seen.push(start)

        let children = graph.get(start)
        if (children) {
            depth++
            for (let child of children) {
                if (filter && filter(child)) {
                    console.log("CHILD", child)
                    break
                }

                walkGraph(child, filter, seen, depth)
            }
        }

        return seen
    }

    let totalHeight = 0
    const climbGraph = (start, filter = null, seen = [], depth = 0) => {
        totalHeight = totalHeight + depth

        let children = transverseGraph.get(start)
        if (children) {
            depth++
            for (let child of children) {
                if (filter && filter(child)) {
                    break
                }

                seen.push(child)

                climbGraph(child, filter, seen, depth)
            }
        }

        return seen
    }

    const addToGraph = addEdge(graph)
    const addToTransverseGraph = addEdge(transverseGraph)

    // load the graph
    input.forEach(([start, end]) => {
        addToGraph(start, end)
        addToTransverseGraph(end, start)
    })

    const findAncestors = (needle, ancestors = []) => {
        if (transverseGraph.has(needle)) {
            let [ancestor] = transverseGraph.get(needle)
            ancestors.push(ancestor)
            return findAncestors(ancestor, ancestors)
        }

        return ancestors
    }

    let currentlyOrbiting = new Set(findAncestors("YOU"))
    let santaIsOrbiting = new Set(findAncestors("SAN"))

    let [commonAncestor] = new Set(
        [...currentlyOrbiting].filter(a => santaIsOrbiting.has(a))
    )

    const findCommonAncestor = item => item === commonAncestor
    let stepsToAncestor = climbGraph("YOU", findCommonAncestor)
    let santasStepstoAncestor = climbGraph("SAN", findCommonAncestor)

    // add 1 for the pivot point itself
    return stepsToAncestor.length + santasStepstoAncestor.length + 1
}

const flow = compose(map(splitOn(")")), splitOn("\n"))

const puzzleInput = flow(readFile("./input.txt"))

const testInput = flow(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`)

console.log(main(puzzleInput))

console.log("bye.")
process.exit(0)
