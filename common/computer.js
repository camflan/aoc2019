const debug = true
const log = (msg, ...extra) => {
    if (!debug) {
        return
    }
    console.log(msg, ...extra)
}

const sum = (x, y) => x + y
const mult = (x, y) => x * y

const createComputer = (memory, inputs=[]) => {
    let _memory = [...memory]
    let _output = []
    let ptr = 0
    let ticks = 0

    const instructions = {
        1: /* add */ operation(sum),
        2: /* multiply */ operation(mult),
        3: /* input */ addr => {
            _memory[_memory[++addr]] = inputs.shift()
            return ++addr
        },
        4: /* print */ (addr, modes) => {
            let val = read(modes.pop(), _memory[++addr])
            _output.push(val)
            return ++addr
        },
        5: /* jump-if-true */ (addr, modes) => {
            let r1 = read(modes.pop(), _memory[++addr])
            let r2 = read(modes.pop(), _memory[++addr])

            return r1 ? r2 : ++addr
        },
        6: /* jump-if-false */ (addr, modes) => {
            let r1 = read(modes.pop(), _memory[++addr])
            let r2 = read(modes.pop(), _memory[++addr])

            return r1 ? ++addr : r2
        },
        7: /* less-than */ (addr, modes) => {
            let r1 = read(modes.pop(), _memory[++addr])
            let r2 = read(modes.pop(), _memory[++addr])
            let r3 = read(modes.pop(), ++addr)

            _memory[r3] = r1 < r2 ? 1 : 0

            return ++addr
        },
        8: /* equals */ (addr, modes) => {
            let r1 = read(modes.pop(), _memory[++addr])
            let r2 = read(modes.pop(), _memory[++addr])
            let r3 = read(modes.pop(), ++addr)

            _memory[r3] = r1 === r2 ? 1 : 0

            return ++addr
        },
        99: /* halt */ () => {
            return memory.length + 1
        },
    }

    while (ptr < _memory.length) {
        const [i, modes] = parseInstruction(_memory[ptr])
        log(
            `\n#${ticks++}\nptr: ${ptr}\ninst: ${
                _memory[ptr]
            } -> ${i}, ${modes}`
        )
        log("_MEMORY", _memory)
        const _currentPtr = ptr

        ptr = instructions[i](ptr, modes)

        // if this instruction was PRINT and our next instruction isn't HALT
        // we need to check the output to see if we had an error
        if (i === 4 && _memory[ptr] !== 99 && getResult() !== 0) {
            log("_MEMORY", _memory)
            log("OUTPUT", _output)
            throw new Error(
                `Error at addr ${_currentPtr}, inst: ${i}, result: ${getResult()}, next ptr: ${ptr}`
            )
        }
    }

    log("====================================")
    log("MEMORY", _memory)
    log("OUTPUT", _output)

    return getResult()

    // returns the addr as value if we're in immediate mode
    function read(mode, addr) {
        return mode ? addr : _memory[addr]
    }
    function getResult() {
        return _output[_output.length - 1]
    }
    function parseInstruction(instruction) {
        // convert to 5 digits with 0 paddding in case they aren't there
        instruction = instruction.toString().padStart(5, "0")

        return [
            Number(instruction.substr(3)),
            Array.from(instruction.substr(0, 3), Number),
        ]
    }
    function operation(fn) {
        return function(addr, modes) {
            // find inputs
            const r1 = read(modes.pop(), _memory[++addr])
            const r2 = read(modes.pop(), _memory[++addr])
            const r3 = read(modes.pop(), ++addr)
            log("inputs", r1, r2)

            // get result and store it
            const result = fn(r1, r2)
            _memory[r3] = result
            log(`output: ${result} stored to ${r3}; confirm: ${_memory[r3]}`)

            // increment our ptr
            return ++addr
        }
    }

}

module.exports = createComputer
