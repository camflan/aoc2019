function* permutator(input, working = []) {
  if (!input.length) {
    yield working;
  }

  let idx = 0;

  while (idx < input.length) {
    let curr = input.slice();
    let next = curr.splice(idx++, 1);

    yield* permutator(curr.slice(), working.concat(next));
  }
}

module.exports = permutator
