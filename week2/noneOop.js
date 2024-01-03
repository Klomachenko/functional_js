let globalResult = 0;

function add(number) {
  globalResult += number;
}

function subtract(number) {
  globalResult -= number;
}

function multiply(number) {
  globalResult *= number;
}

function divide(number) {
  if (number !== 0) {
    globalResult /= number;
  } else {
    console.error("0으로 어케나눠요!");
  }
}

function getResult() {
  return globalResult;
}

function clear() {
  globalResult = 0;
}

// 계산 수행하기
add(5);
multiply(2);
subtract(3);
divide(4);

const result = getResult();
console.log(result); 
