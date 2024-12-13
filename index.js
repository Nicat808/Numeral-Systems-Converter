//! Regex for validation
const onlyNumberRegex = /^\d+$/;
const onlyOneAndZeroRegex = /^[01]+$/;
//!

//! Helper data structures
//* 8,16 to 2
const binaryEquivalentOfHexadecimalSystemMembers = Object.freeze({
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
});
const binaryEquivalentOfOctalSystemMembers = Object.freeze({
  0: "000",
  1: "001",
  2: "010",
  3: "011",
  4: "100",
  5: "101",
  6: "110",
  7: "111",
});
const binarySystemEquivalentHelper = Object.freeze({
  8: binaryEquivalentOfOctalSystemMembers,
  16: binaryEquivalentOfHexadecimalSystemMembers,
});
//*

//*2,8,16 to 10
const binaryEquivalentOfDecimalSystemMembers = Object.freeze({
  0: 0,
  1: 1,
});
const octalEquivalentOfDecimalSystemMembers = Object.freeze({
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
});
const hexadecimalEquivalentOfDecimalSystemMembers = Object.freeze({
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
});
const decimalSystemEquivalentHelper = Object.freeze({
  2: binaryEquivalentOfDecimalSystemMembers,
  8: octalEquivalentOfDecimalSystemMembers,
  16: hexadecimalEquivalentOfDecimalSystemMembers,
});
//*

const numeralSystems = Object.freeze({
  binary: 2,
  decimal: 10,
  octal: 8,
  hexadecimal: 16,
});
const AvailableConvertions = Object.freeze({
  "x-10": fromRestOfTheSystemsToDecimal,
  "10-x": fromDecimalToRestOfTheSystems,
  "8-2": fromOctalOrHexadecimalToBinary,
  "16-2": fromOctalOrHexadecimalToBinary,
});
//!

//! Helper functions
function reverseString(value) {
  return typeof value === "string"
    ? value.split("").reverse().join("").toUpperCase()
    : value.toString().split("").reverse().join("").toUpperCase();
}
function isOnlyNumber(value) {
  return (
    typeof value === "number" ||
    (typeof value === "string" && onlyNumberRegex.test(value))
  );
}
function isBinary(value) {
  return onlyOneAndZeroRegex.test(value);
}
function getKeyByValue(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}
//!

//! Main convertion logics
function fromRestOfTheSystemsToDecimal(anySystemNumber, systemBase) {
  let decimalNumber = 0;
  let number = reverseString(anySystemNumber);
  let lengthOfNumber = number.length;
  for (let power = 0; power < lengthOfNumber; power++) {
    decimalNumber +=
      systemBase ** power *
      decimalSystemEquivalentHelper[systemBase][number[power]];
  }
  return decimalNumber.toString();
}
function fromDecimalToRestOfTheSystems(decimalNumber, systemBase) {
  let targetNumber = "";
  let number = decimalNumber;
  while (number > 0) {
    let remainder = number % systemBase;
    targetNumber += getKeyByValue(
      decimalSystemEquivalentHelper[systemBase],
      remainder
    );
    number = parseInt(number / systemBase);
  }
  return reverseString(targetNumber);
}
function fromOctalOrHexadecimalToBinary(number, systemBase) {
  let result = "";
  number =
    typeof number === "number"
      ? number.toString().toUpperCase()
      : number.toUpperCase();

  let numberLength = number.length;
  let finalClearedResult;

  for (let index = 0; index < numberLength; index++) {
    result += binarySystemEquivalentHelper[systemBase][number[index]];
  }

  for (let index = 0; index < result.length; index++) {
    if (result[index] === "0") {
      continue;
    }
    if (result[index] === "1") {
      finalClearedResult = result.slice(index);
      break;
    }
  }

  return finalClearedResult;
}

//!

//! Main convertion variables
let FromSystemProcess = {
  value: "",
  base: {
    text: "decimal",
    number: 10,
  },
};
let ToSystemProcess = {
  value: "",
  base: {
    text: "binary",
    number: 2,
  },
};
//!

//! DOM elements
const dropdownTriggers = document.querySelectorAll(".number-dropdown");
const dropdownContentBoxes = document.querySelectorAll(".available-systems");
const dropdownIcons = document.querySelectorAll(".fa-chevron-down");
const fromNumeralSystem = document.querySelector("#from-system span");
const toNumeralSystem = document.querySelector("#to-system span");
const fromNumeralSystemHeader = document.querySelector("#header-from");
const toNumeralSystemHeader = document.querySelector("#header-to");
const fromNumeralSystemLabel = document.querySelector("#label-from");
const toNumeralSystemLabel = document.querySelector("#label-to");
const fromNumeralSystemNumber = document.querySelector("#from-number");
const toNumeralSystemNumber = document.querySelector("#to-number");
const fromInput = document.querySelector(".result input[name=from]");
const toInput = document.querySelector(".result input[name=to]");
const switchTrigger = document.querySelector("#switch-systems");
//!

//! Event bindings
dropdownTriggers.forEach((dropdownTrigger, index) => {
  const dropdownContentBox = dropdownContentBoxes[index];
  const dropdownIcon = dropdownIcons[index];

  dropdownTrigger.addEventListener("click", (e) => {
    if (dropdownContentBox.classList.contains("hide")) {
      dropdownContentBox.classList.remove("hide");
      dropdownContentBox.classList.add("show");
    } else {
      dropdownContentBox.classList.remove("show");
      dropdownContentBox.classList.add("hide");
    }
    dropdownIcon.classList.toggle("open");
  });
});
dropdownContentBoxes.forEach((content, index) => {
  content.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  Object.entries(numeralSystems).forEach((entry) => {
    const system = entry[0];
    const systemNumber = entry[1];
    const div = document.createElement("div");
    div.classList.add("system");
    div.textContent = system;
    div.dataset.value = system;
    div.addEventListener("click", () => {
      if (index === 0) {
        fromNumeralSystem.textContent = system;
        fromNumeralSystemHeader.textContent = system;
        fromNumeralSystemLabel.textContent = system;
        fromNumeralSystemNumber.textContent = systemNumber;
        FromSystemProcess.base.number = systemNumber;
        FromSystemProcess.base.text = system;
      } else {
        toNumeralSystem.textContent = system;
        toNumeralSystemHeader.textContent = system;
        toNumeralSystemLabel.textContent = system;
        toNumeralSystemNumber.textContent = systemNumber;
        ToSystemProcess.base.number = systemNumber;
        ToSystemProcess.base.text = system;
      }
      content.classList.remove("show");
      content.classList.add("hide");
    });
    content.append(div);
  });
});
fromInput.addEventListener("input", (e) => {
  FromSystemProcess.value = e.target.value;
  if (FromSystemProcess.value === "") {
    fromInput.value = "";
    toInput.value = "";
    return;
  }
  if (FromSystemProcess.base.number === ToSystemProcess.base.number) {
    fromInput.value = FromSystemProcess.value;
    toInput.value = FromSystemProcess.value;
    return;
  }

  let optionKey;
  if (FromSystemProcess.base.number == 10) {
    optionKey = `${FromSystemProcess.base.number}-x`;
  } else if (ToSystemProcess.base.number == 10) {
    optionKey = `x-${ToSystemProcess.base.number}`;
  } else {
    optionKey = `${FromSystemProcess.base.number}-${ToSystemProcess.base.number}`;
  }
  const convertionFunction = AvailableConvertions[optionKey];

  if (FromSystemProcess.base.number == 10) {
    ToSystemProcess.value = convertionFunction(
      FromSystemProcess.value,
      +ToSystemProcess.base.number
    );
  } else {
    ToSystemProcess.value = convertionFunction(
      FromSystemProcess.value,
      +FromSystemProcess.base.number
    );
  }

  toInput.value = ToSystemProcess.value;
});
toInput.addEventListener("input", (e) => {
  ToSystemProcess.value = e.target.value;
  if (ToSystemProcess.value === "") {
    fromInput.value = "";
    toInput.value = "";
    return;
  }
  if (ToSystemProcess.base.number === FromSystemProcess.base.number) {
    toInput.value = ToSystemProcess.value;
    fromInput.value = ToSystemProcess.value;
    return;
  }
  let optionKey;
  if (ToSystemProcess.base.number == 10) {
    optionKey = `${ToSystemProcess.base.number}-x`;
  } else if (FromSystemProcess.base.number == 10) {
    optionKey = `x-${FromSystemProcess.base.number}`;
  } else {
    optionKey = `${ToSystemProcess.base.number}-${FromSystemProcess.base.number}`;
  }

  const convertionFunction = AvailableConvertions[optionKey];

  if (FromSystemProcess.base.number == 10) {
    FromSystemProcess.value = convertionFunction(
      ToSystemProcess.value,
      +ToSystemProcess.base.number
    );
  } else {
    FromSystemProcess.value = convertionFunction(
      ToSystemProcess.value,
      +FromSystemProcess.base.number
    );
  }

  fromInput.value = FromSystemProcess.value;
});
switchTrigger.addEventListener("click", () => {
  let temp = FromSystemProcess;
  FromSystemProcess = ToSystemProcess;
  ToSystemProcess = temp;

  fromNumeralSystem.textContent = FromSystemProcess.base.text;
  fromNumeralSystemHeader.textContent = FromSystemProcess.base.text;
  fromNumeralSystemLabel.textContent = FromSystemProcess.base.text;
  fromNumeralSystemNumber.textContent = FromSystemProcess.base.number;
  fromInput.value = FromSystemProcess.value;

  toNumeralSystem.textContent = ToSystemProcess.base.text;
  toNumeralSystemHeader.textContent = ToSystemProcess.base.text;
  toNumeralSystemLabel.textContent = ToSystemProcess.base.text;
  toNumeralSystemNumber.textContent = ToSystemProcess.base.number;
  toInput.value = ToSystemProcess.value;
});
//!
