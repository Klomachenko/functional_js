class Calculator {
  constructor() {
    this.result = 0;
  }

  add(number) {
    this.result += number;
    return this;
  }

  subtract(number) {
    this.result -= number;
    return this;
  }

  multiply(number) {
    this.result *= number;
    return this;
  }

  divide(number) {
    if (number !== 0) {
      this.result /= number;
    } else {
      console.error("Cannot divide by zero!");
    }
    return this;
  }

  getResult() {
    return this.result;
  }

  clear() {
    this.result = 0;
    return this;
  }
}

// Calculator 클래스의 인스턴스 생성
const myCalculator = new Calculator();

// 계산 수행
const finalResult = myCalculator
  .add(5)
  .multiply(2)
  .subtract(3)
  .divide(4)
  .getResult();

console.log(finalResult); // 
