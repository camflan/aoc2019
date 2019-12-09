const fs = require("fs")
const input = JSON.parse(fs.readFileSync("./input.json").toString("utf8"))

const debug = false
const log = (msg, ...extra) => {
    if (!debug) {
        return
    }
    console.log(msg, ...extra)
}

const parseInstruction = instruction => {
    // convert to 5 digits with 0 paddding in case they aren't there
    instruction = instruction.toString().padStart(5, "0")

    return [
        Number(instruction.substr(3)),
        Array.from(instruction.substr(0, 3), Number),
    ]
}

const sum = (x, y) => x + y
const mult = (x, y) => x * y

function main(inputs, userInput) {
    let _input = [...inputs]
    let _output = []

    // returns the addr as value if we're in immediate mode
    const getValue = (mode, addr) => {
        //console.log(`ADDR: ${addr}, MODE: ${mode}`)
        return mode ? addr : _input[addr]
    }
    const operation = fn => (addr, modes) => {
        // find inputs
        const r1 = getValue(modes.pop(), _input[++addr])
        const r2 = getValue(modes.pop(), _input[++addr])
        const r3 = getValue(modes.pop(), ++addr)
        log("inputs", r1, r2)

        // get result and store it
        const result = fn(r1, r2)
        _input[r3] = result
        log(`output: ${result} stored to ${r3}; confirm: ${_input[r3]}`)

        // increment our ptr
        return ++addr
    }

    const instructions = {
        1: /* add */ operation(sum),
        2: /* multiply */ operation(mult),
        3: /* save */ addr => {
            _input[_input[++addr]] = userInput
            return ++addr
        },
        4: /* print */ (addr, modes) => {
            let val = getValue(modes.pop(), _input[++addr])
            _output.push(val)
            return ++addr
        },
        5: /* jump-if-true */ (addr, modes) => {
            let r1 = getValue(modes.pop(), _input[++addr])
            let r2 = getValue(modes.pop(), _input[++addr])

            return r1 ? r2 : ++addr
        },
        6: /* jump-if-false */ (addr, modes) => {
            let r1 = getValue(modes.pop(), _input[++addr])
            let r2 = getValue(modes.pop(), _input[++addr])

            return r1 ? ++addr : r2
        },
        7: /* less-than */ (addr, modes) => {
            let r1 = getValue(modes.pop(), _input[++addr])
            let r2 = getValue(modes.pop(), _input[++addr])
            let r3 = getValue(modes.pop(), ++addr)

            _input[r3] = r1 < r2 ? 1 : 0

            return ++addr
        },
        8: /* equals */ (addr, modes) => {
            let r1 = getValue(modes.pop(), _input[++addr])
            let r2 = getValue(modes.pop(), _input[++addr])
            let r3 = getValue(modes.pop(), ++addr)

            _input[r3] = r1 === r2 ? 1 : 0

            return ++addr
        },
        99: /* halt */ () => {
            return inputs.length + 1
        },
    }

    let ptr = 0
    let count = 0
    while (ptr < _input.length) {
        const [i, modes] = parseInstruction(_input[ptr])
        log(
            `\n#${count++}\nptr: ${ptr}\ninst: ${_input[ptr]} -> ${i}, ${modes}`
        )
        ptr = instructions[i](ptr, modes)

        // if this instruction was PRINT and our next instruction isn't HALT
        // we need to check the output to see if we had an error
        if (
            i === 4 &&
            _input[ptr] !== 99 &&
            _output[_output.length - 1] !== 0
        ) {
            console.log("ERROR?", ptr, _input[ptr], _output[_output.length - 1])
        }
    }

    log("====================================")
    log("MEMORY", _input)
    log("OUTPUT", _output)
    return _output[_output.length - 1]
}

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

let result = main(input, 5)
console.log("RESULT: ", result)

process.exit(0)
