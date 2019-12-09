const fs = require("fs");

const createComputer = require("../common/computer");
const permutator = require("../common/permutator");

const tests = [
  {
    input: [ 3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5 ],
    phaseSettings: [9, 8, 7, 6, 5],
    expected: 139629729
  },
  {
    input: [ 3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54, -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4, 53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10 ],
    phaseSettings: [9, 7, 8, 5, 6],
    expected: 18216
  }
];

async function runTests() {
  tests.forEach(async ({ input, phaseSettings, expected }, idx) => {
    console.log(`Test #${idx + 1}`);

    // create amps
    const amps = phaseSettings.map(phase => {
      // create the computer, add our phase as the first input
      const amp = createComputer(input);
      amp.input.write(phase);

      return amp;
    });

    // starting argument
    amps[0].input.write(0);

    // now that the amps are ready, connect them together
    // and start execution
    const results = await Promise.all(
      amps.map((amp, idx, amps) => {
        let nextAmp = amps[(idx + 1) % amps.length];
        amp.pipe(nextAmp.input);
        console.log("running...");

        return amp.run();
      })
    );

    const got = results[results.length - 1];

    console.log(
      `TEST #${idx + 1} RESULTS: `,
      got === expected ? "SUCCESS" : "FAIL",

      got,
      expected
    );
  });
}

runTests();

async function main(input) {
  const results = [];

  for (let phaseSettings of permutator([5, 6, 7, 8, 9])) {
    // create amps
    const amps = phaseSettings.map(phase => {
      // create the computer, add our phase as the first input
      const amp = createComputer(input);
      amp.input.write(phase);

      return amp;
    });

    // starting argument
    amps[0].input.write(0);

    // now that the amps are ready, connect them together
    // and start execution
    const outputs = await Promise.all(
      amps.map((amp, idx, amps) => {
        let nextAmp = amps[(idx + 1) % amps.length];
        amp.pipe(nextAmp.input);
        console.log("running...");

        return amp.run();
      })
    );

    results.push(outputs[outputs.length - 1]);
  }

  console.log("TOTALS", Math.max(...results))
}

const input = [ 3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 38, 59, 76, 89, 106, 187, 268, 349, 430, 99999, 3, 9, 1002, 9, 3, 9, 101, 2, 9, 9, 1002, 9, 4, 9, 4, 9, 99, 3, 9, 1001, 9, 5, 9, 1002, 9, 5, 9, 1001, 9, 2, 9, 1002, 9, 3, 9, 4, 9, 99, 3, 9, 1001, 9, 4, 9, 102, 4, 9, 9, 1001, 9, 3, 9, 4, 9, 99, 3, 9, 101, 4, 9, 9, 1002, 9, 5, 9, 4, 9, 99, 3, 9, 1002, 9, 3, 9, 101, 5, 9, 9, 1002, 9, 3, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99, ]
main(input)
