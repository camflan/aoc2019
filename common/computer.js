const { EventEmitter } = require("events")
const debug = false
const log = (msg, ...extra) => {
    if (!debug) {
        return
    }
    console.log(msg, ...extra)
}

class Connection extends EventEmitter {
    constructor(initial) {
        super()

        this.buffer = []

        this.lastWrite

        this.write = this.write.bind(this)
        this.notify = this.notify.bind(this)
        this.read = this.read.bind(this)
        this.pipe = this.pipe.bind(this)
        this.end = this.end.bind(this)
    }

    write(data) {
        this.lastWrite = data
        this.buffer.push(data)
        this.notify()
    }

    notify() {
        while(
            this.buffer.length &&
            this.listenerCount("data")
        ) {
            this.emit("data", this.buffer.shift())
            this.notify()
        }

    }

    read() {
        return new Promise(resolve => {
            this.once("data", resolve)
            this.notify()
        })
    }

    pipe(connection) {
        this.on('data', connection.write)
        this.notify()
    }

    end() {
        this.removeAllListeners("data")
    }
}

const sum = (x, y) => x + y
const mult = (x, y) => x * y

const createComputer = (memory) => {
    let _memory = [...memory]
    let ptr = 0
    let ticks = 0

    const input = new Connection()
    const output = new Connection()

    const instructions = {
        1: /* add */ operation(sum),
        2: /* multiply */ operation(mult),
        3: /* input */ async addr => {
            _memory[_memory[++addr]] = await input.read()
            return ++addr
        },
        4: /* print */ (addr, read) => {
            let val = read(++addr)
            output.write(val)
            return ++addr
        },
        5: /* jump-if-true */ (addr, read) => {
            let r1 = read(++addr)
            let r2 = read(++addr)

            return r1 ? r2 : ++addr
        },
        6: /* jump-if-false */ (addr, read) => {
            let r1 = read(++addr)
            let r2 = read(++addr)

            return r1 ? ++addr : r2
        },
        7: /* less-than */ (addr, read) => {
            let r1 = read(++addr)
            let r2 = read(++addr)
            let target = _memory[++addr]

            _memory[target] = r1 < r2 ? 1 : 0

            return ++addr
        },
        8: /* equals */ (addr, read) => {
            let r1 = read(++addr)
            let r2 = read(++addr)
            let target = _memory[++addr]

            _memory[target] = r1 === r2 ? 1 : 0

            return ++addr
        },
        99: /* halt */ () => {
            console.log("HALT")
            return memory.length + 1
        },
    }

    // connect our output to the connections input
    const pipe = output.pipe

    return {
        tick, run, input, output, pipe
    }

    async function* _tick() {
        while (ptr < _memory.length) {
            const [i, modes] = parseInstruction(_memory[ptr])
            log(
                `\n#${ticks++}\nptr: ${ptr}\ninst: ${
                    _memory[ptr]
                } -> ${i}, ${modes}`
            )

            if(i === 99){
                break
            }

            ptr = await instructions[i](ptr, reader(modes))
            yield ptr
        }

        // end of program
        return -1
    }

    function tick() {
        return _tick().next()
    }

    async function run() {
        // run generator
        for await (const i of _tick()) {
            //
        }

        log("=== DONE ==========================")
        log("MEMORY", _memory)
        return output.lastWrite
    }

    // hof that will give us a read function that we can call with
    // each addr and it will return value || value at addr based
    // on the modes
    function reader(modes) {
        return function(addr) {
            return modes.pop() ? _memory[addr] : _memory[_memory[addr]]
        }
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
        return function(addr, read) {
            // find inputs
            const r1 = read(++addr)
            const r2 = read(++addr)
            const target = _memory[++addr]

            // get result and store it
            const result = fn(r1, r2)
            _memory[target] = result

            // increment our ptr
            return ++addr
        }
    }

}

module.exports = createComputer
