import { currencyFormat } from "../scripts/utils/money.js";

console.log("Test Suite:");

console.log("Convert cents into dollars");
if (currencyFormat(2095) === "20.95") {
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("works with 0");
if (currencyFormat(0) === "0.00") {
  console.log("Passed");
} else {
  console.log("Failed");
}

console.log("rounds up to the nearest cent");
if (currencyFormat(2000.5) === "20.01") {
  console.log("Passed");
} else {
  console.log("Failed");
}
