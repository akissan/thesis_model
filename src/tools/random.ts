// import { exec } from "child_process";
// import { writeFile } from "fs";

const getRndNum = () =>
  (Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random() -
    3) /
  3;

// const getTestValues = () => {
//   const vals = [];
//   const N = 5000;
//   for (let i = 0; i < N; i++) {
//     const val = getRndNum();
//     vals.push(val);
//   }
//   vals.sort((a, b) => a - b);
//   writeFile(
//     "/Users/akissan/Dev/thesis_plots/test_0.json",
//     JSON.stringify(vals),
//     () => {
//       console.log("ura!");
//       //   exec("which python", console.log);
//       exec("python3 /Users/akissan/Dev/thesis_plots/test_0.py", console.log);
//     }
//   );

//   //   exec(``);

//   //   console.log(vals);
//   //   console.log(vals.filter((val) => val < 0.125).length / N);
// };

// getTestValues();
