const fs = require("fs")
const input = JSON.parse(fs.readFileSync("./input.json").toString("utf8"))

const createComputer = require("../common/computer")

const test = [1002, 4, 3, 4, 33]
const test2 = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9]
const test3 = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1]
const test4 = [
    3,
    21,
    1008,
    21,
    8,
    20,
    1005,
    20,
    22,
    107,
    8,
    21,
    20,
    1006,
    20,
    31,
    1106,
    0,
    36,
    98,
    0,
    0,
    1002,
    21,
    125,
    20,
    4,
    20,
    1105,
    1,
    46,
    104,
    999,
    1105,
    1,
    46,
    1101,
    1000,
    1,
    20,
    4,
    20,
    1105,
    1,
    46,
    98,
    99,
]

let result = createComputer(input, [5])
console.log("RESULT: ", result)

process.exit(0)
