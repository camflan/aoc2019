function* range(min, max) {
    let cursor = min

    while (cursor <= max) {
        yield ++cursor
    }
}

let input = [152084, 670282]

function main(start, end) {
    const valid = []

    for (let x of range(start, end)) {
        let components = Array.from(String(x), Number)

        let hasDuplicates =
            Array.from(new Set(components)).length < components.length
        let sortedSet = [...components].sort()
        let isSorted = components.join("") === sortedSet.join("")

        if (hasDuplicates && isSorted) {
            let duplicates = new Map()
            components.forEach(component => {
                if (duplicates.has(component)) {
                    duplicates.set(component, duplicates.get(component) + 1)
                } else {
                    duplicates.set(component, 1)
                }
            })

            let widows = Array.from(duplicates.entries()).some(
                ([key, count]) => count === 2
            )

            if (widows) {
                valid.push(x)
            }
        }
    }

    return valid
}

const result = main(...input)
console.log(result.length)

process.exit(0)
