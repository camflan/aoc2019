const fs = require("fs")
const input = JSON.parse(fs.readFileSync("./input.json").toString("utf8"))

const sum = (x, y) => x + y

function calculateFuelRequirements(mass, fuel = []) {
    const fuelRequired = Math.floor(mass / 3) - 2

    if (fuelRequired <= 0) {
        return fuel.reduce(sum, 0)
    }

    fuel.push(fuelRequired)
    return calculateFuelRequirements(fuelRequired, fuel)
}

console.log(input.map(mass => calculateFuelRequirements(mass)).reduce(sum))

process.exit(0)
