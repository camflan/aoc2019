const fs = require("fs")
const input = JSON.parse(fs.readFileSync("./input.json").toString("utf8"))

const debug = false
const log = msg => {
    if(!debug) { return }
    console.log(msg)
}

const sum = (x, y) => x + y
const mult = (x, y) => x * y


function main(inputs) {
    let _input = [...inputs]

    const operation = fn => idx => {
        const r1 = _input[idx + 1]
        const r2 = _input[idx + 2]
        const r3 = _input[idx + 3]

        // find inputs
        const x = _input[r1]
        const y = _input[r2]
        log('inputs', x, y)

        // get result and store it
        const result = fn(x, y)
        log('output', result)
        _input[r3] = result

        // increment our ptr
        return idx + 4
    }

    const instructions = {
        1: /* add */ operation(sum),
        2: /* multiply */ operation(mult),
        99: /* halt */ () => { return inputs.length + 1}
    }

    let ptr = 0
    while(ptr < _input.length) {
        const i = _input[ptr]
        ptr = instructions[i](ptr)
    }

    return _input[0]
}


// part 1
input[1] = 12
input[2] = 2
console.log("Part1", main(input))

// =======================

// part 2
const makeRange = max => new Array(max).fill(1).map((_, idx) => idx)

function findNounAndVerb(inputs) {
    for(let x of makeRange(99)) {
        for(let y of makeRange(99)) {
            let _input = [...inputs]
            _input[1] = x
            _input[2] = y

            if(main(_input) === 19690720) {
                return [x, y]
            }
        }
    }
}

console.log("Part2", findNounAndVerb(input))


process.exit(0)
