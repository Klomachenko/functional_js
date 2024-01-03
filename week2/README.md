# Why OOP?

## 축구선수 도감을 만들어보자

축구선수들 데이터를 미리 정리해서 보여주기로 한다.

먼저 JS 자료형에 정보들을 담아야겠는데?

- 나중에 축구선수 포지션이 바뀌거나,
  팀이 바뀔때
  관리하기가 편하다 (업데이트하기 편함)

{object} 자료형으로

축구선수의 정보를 정리해보자!

```jsx
var heungmin = {
  position: 'wing',
  team: 'tottenham',
};

var minjae = {
  position: 'javaScript',
  team: 'muenchen',
};
```

- 분명 편하긴한데…. K리그 선수들만 해도 300명이 넘는데?
  300개 저렇게 하려면 날밤 샐거같다…

---

### 비슷한 ojbect는 class에게 맡기세요

<aside>
📌 class는 object뽑는 붕어빵 틀같은 녀석이다!

</aside>

그럼 틀을 한 번 직접 만들어보자!

```jsx
function 틀() {
  this.position = 'wing';
  this.team = 'tottenham';
}
```

- this가 뭐지?

  - 틀에서 새로 생성되는 object들 (있어보이게 instance)

  **`this.position = 'wing';`** ← 새로 생성되는 object에 position 키에 wing이라는 값을 할당해 주세요~

그럼 새로운 object를 뽑아보자!

```jsx
function 틀() {
  this.position = 'wing';
  this.team = 'tottenham';
}

var heungmin = new 틀(); // 오브젝트 생성 한줄 컷!
```

`**new 틀()**` ← 이 자리에 그대로 object가 남음!

실제 heungmin을 출력해보자

![첫번째](https://github.com/Klomachenko/functional_js/assets/102893954/4606b1b1-4cdd-4e94-92b8-1eaf28727cc3)

- 여기 ‘틀’은 출신을 나타내준다! (누가 생성한건지 알려줌)
  (아 이 heungmin이라는 object는 ‘틀’에서 찍어낸거구나~)

```jsx
function 틀() {
  this.position = 'wing';
  this.team = 'tottenham';
}

var heungmin = new 틀();
var minjae = new 틀();
```

- 아래 heungmin, minjae만 보면, 코드 작성이 8줄에서 1줄로 굉장히 간편해졌다!

---

### 여기 파라미터만 조금 손대면?

```jsx
function 틀(position, team) {
  this.position = position;
  this.team = team;
}

var heungmin = new 틀('wing', 'tottenham');
var minjae = new 틀('centerback', 'muenchen');
```

![두번째](https://github.com/Klomachenko/functional_js/assets/102893954/22a65239-9bc6-499d-98d9-f5c1541db756)

- 이제 계속 쓸데없이 object를 생성하지 않고, 한줄로 간단하게 생성이 가능해진다!

참고로 ES6 class 문법부터는 아래처럼 사용한다! (아마 이걸 더 많이 보셨을 것!)

```jsx
class 틀 {
  constructor(position, team) {
    this.position = position;
    this.team = team;
  }
}
```

---

## 그럼 이제 객체지향, 비객체지향을 비교해보자

### 객체지향 계산기

```jsx
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
      console.error('Cannot divide by zero!');
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

console.log(finalResult);
```

1. 코드의 모듈화 + 재사용성
   - 각 계산 단계를 매서드로 나누어 클래스에 구현했습니다
     코드가 ‘각 기능 단위’로 모듈화되어 있어 가독성이 높아지고, 재사용성이 증가합니다.
     추후 계산기 이외에 다른 기능이 생성되더라도, 계산기와 관련한 매서드는 해당 class 내부에 있으므로 이해하고, 찾기 쉽습니다.
2. 외부 접근 불가능
   - 클래스는 내부 상태를 가지고 있습니다.
     외부에서 직접 접근할 수 없으므로, 의도치 않은 상태 변경을 방지하고 객체 내부 상태를 안전하게 유지할 수 있습니다.
3. 매서드 체이닝
   - 객체지향적 코드에서는 매서드 체이닝을 활용해 한 줄로 여러 매서드를 호출할 수 있습니다.
     연속된 연산 혹은 로직의 경우 시각적으로 이해하기 편합니다.

### 비객체지향 계산기

```jsx
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
    console.error('0으로 어케나눠요!');
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
```

1. 전역변수 사용
   - 계산 결과를 ‘전역 변수’로 유지합니다.
     전역변수는 의도치 않은 변경이 일어날 수 있습니다.
2. 상태 변화의 어려움
   - 전역변수를 사용하면 여러 곳에서 계산 상태를 변화시킬 수 있어,
     상태관리가 어려워질 가능성이 있습니다.
