const fs = require("fs")

const compose = (...fns) => x => fns.reduceRight((input, fn) => fn(input), x)
const map = fn => xs => xs.map(fn)
const splitOn = char => x => x.split(char)
const readFile = path => fs.readFileSync(path).toString("utf8")

const flow = compose(
    map(splitOn(",")),
    splitOn("\n")
)

const move = {
    U: (point, length) =>
        Array.from({length: length + 1}, (_, idx) => `${point[0]},${point[1] - idx}`),
    D: (point, length) =>
        Array.from({length: length + 1}, (_, idx) => `${point[0]},${point[1] + idx}`),
    L: (point, length) =>
        Array.from({length: length + 1}, (_, idx) => `${point[0] - idx},${point[1]}`),
    R: (point, length) =>
        Array.from({length: length + 1}, (_, idx) => `${point[0] + idx},${point[1]}`),
}

const vectorToLine = (points, vector) => {
    let direction = vector[0]
    let duration = +vector.substr(1)

    // pop the last point off because we're going to pivot on it
    // and then start the new line at the point. pop will remove the
    // duplicate
    const lastPoint = points.pop()
    const [x, y] = lastPoint.split(",").map(Number)

    const line = move[direction]([x, y], duration)
    return points.concat(line)
}

const calculateManhattanDistance = (pointA, pointB) => {
    let [x1, y1] = pointA.split(",")
    let [x2, y2] = pointB.split(",")

    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

const sum = (x, y) => x + y

const colors = ["blue", "red", "rebeccapurple"]

const makePolyline = (points, color) => `
    <polyline
        points="${points.join(" ")}"
        fill="none"
        stroke="${color}"
        stroke-width="5"
    />
`
const makeCircle = (point, color) => {
    let [x, y] = point.split(",")

    return `<circle cx="${x}" cy="${y}" r="10" fill="${color}" stroke="${color}" />`
}

const makeSvg = (lines, intersections) => `
<svg viewBox="-10000 -10000 20000 15000" xmlns="http://www.w3.org/2000/svg">
${lines.map((points, idx) => makePolyline(points, colors[idx])).join("\n")}

<!-- intersections and origin -->
${intersections.map(point => makeCircle(point, colors[2])).join("\n")}
<!-- center port -->
<circle cx="0" cy="0" r="50" fill="white" stroke="${colors[2]}" stroke-width="10" />
</svg>
`

function main([wireA, wireB]) {
    const lineA = wireA.reduce(vectorToLine, ["0,0"])
    const lineB = wireB.reduce(vectorToLine, ["0,0"])

    const pointsA = new Set(lineA)
    const pointsB = new Set(lineB)

    const intersections = [...pointsA].filter(a => pointsB.has(a))

    const latency = intersections.map(intersection => {
        return [
            lineA.findIndex(a => a === intersection),
            lineB.findIndex(b => b === intersection),
        ]
    })

    fs.writeFileSync("./lines.svg", makeSvg([lineA, lineB], intersections))

    return [
        // manhattan distances
        intersections.map(calculateManhattanDistance.bind(null, "0,0")),
        // length of path to intersections
        latency.map(int => sum(...int)),
    ]
}

const example1 = flow(
`R8,U5,L5,D3
U7,R6,D4,L4`
)

const test1 = flow(
`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`
)

const test2 = flow(
`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
)

const input = compose(flow, readFile)('./input.txt')
const results = main(input)
console.log(Math.min(...results[1].filter(x => x > 0)))
process.exit(0)
