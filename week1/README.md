# JS Functional Programming

### 🤔 좋은 코드에 대한 생각

- 평소 좋은 코드에 대한 나의 생각
**“코드 줄 수가 짧으면 읽는데 시간도 덜 걸리고, 아무래도 실행시간도 빨라지지 않을까?”**
    
    → 굉장히 잘못된 생각을 하고 있었다!
    
    아래 과거의 내가 작성한 코드를 구경해보자! (충격주의)
    

```jsx
class App {
  async play() {
    let gameOver = false;
    let correctAnswer;

    console.log("숫자 야구 게임을 시작합니다.");

    const answer = [];
    while (answer.length < 3) {
      const number = MissionUtils.Random.pickNumberInRange(1, 9);
      if (!answer.includes(number)) {
        answer.push(number);
      }
    }
    correctAnswer = answer.join('');

    while (!gameOver) {
      try {
        let input = await MissionUtils.Console.readLineAsync("숫자를 입력해주세요: ");
        input = input.trim();

        if (
          input.length !== 3 ||
          input.includes("0") ||
          input[0] === input[1] ||
          input[1] === input[2] ||
          input[0] === input[2]
        ) {
          throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
        } else {
          let strike = 0;
          let ball = 0;

          for (let i = 0; i < input.length; i++) {
            if (correctAnswer[i] === input[i]) {
              strike++;
            } else if (correctAnswer.includes(input[i])) {
              ball++;
            }
          }
          if (strike === 3) {
            MissionUtils.Console.print("3스트라이크");
            console.log("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
            const newGame = await MissionUtils.Console.readLineAsync("게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n");

            if (newGame === '1') {
              const newAnswer = [];
              while (newAnswer.length < 3) {
                const number = MissionUtils.Random.pickNumberInRange(1, 9);
                newAnswer.push(number);
              }
              correctAnswer = newAnswer.join('');
            } else if (newGame === '2') {
              MissionUtils.Console.print("게임 종료");
              gameOver = true;
            } else {
              throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
            }
          } else if (strike === 0 && ball === 0) {
            console.log("낫싱");
          } else {
            console.log(`${ball}볼 ${strike}스트라이크`);
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
}

export default App;

const app = new App();
await app.play();
```

- 본래 인공지능을 공부하고, 코드를 작성했던 나는 “굳이 가독성이 좋아야 하나? 어차피 복붙하고 계속 모델 부분 앙상블 하거나, 일부분 테스트하는 곳만 바꿔서 계속 돌릴건데?”라는 생각에 지배를 당했고,
그에 따라 짧은 줄 수를 가진 코드를 지향하고 있었다. **하지만…**

<aside>
💡 친구 : 야 넌 이 코드를 보면 눈에 들어오냐?
들어오면 그건 그거대로 대단한 놈이다 여러의미로~

</aside>

- 위의 친구의 이야기를 듣고 생각해 보았다.

---

### ❓어떻게 작성해야 좋은 코드가 나올까?

- 결과는 간단했다.
- “읽기 쉬운 것은 남이 내 코드를 보고, 한눈에 이해하는 것이다!”
    - 다시 아래의 내 코드를 보자!

```jsx
if (strike === 3) {
    MissionUtils.Console.print("3스트라이크");
    MissionUtils.Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
    const newGame = await MissionUtils.Console.readLineAsync("게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n");

    if (newGame === '1') {
      const newAnswer = [];
      while (newAnswer.length < 3) {
        const number = MissionUtils.Random.pickNumberInRange(1, 9);
        newAnswer.push(number);
      }
      correctAnswer = newAnswer.join('');
    } else if (newGame === '2') {
      MissionUtils.Console.print("게임 종료");
      gameOver = true;
    } else {
      throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
    }
  } else if (strike === 0 && ball === 0) {
    MissionUtils.Console.print("낫싱");
  } else {
    MissionUtils.Console.print(`${ball}볼 ${strike}스트라이크`);
  }
}
```

### 💣if 문이 너무나 많아서 로직이 복잡해 보인다

- 예를 들어, 스트라이크가 3개일때,
    - 3스트라이크 문자도 출력하고
    - 게임 종료 문구를 띄워주고
    - 사용자로부터 인풋을 입력받고
    - newGame의 값이 1인지 2인지 둘 다 아닌지 체크하고…
- 현재 한 단락에서 4가지가 넘는 일을 한번에 하고 있는 모습을 볼 수 있다.
즉! 이 단락을 다른 사람이 본다면, 아 여기선 이런 일도 하고, 저런 일도 하고… 음? 그럼 이걸 고칠땐 여기도 손봐야겠네? 라는 상황이 무조건 발생하게 된다!

**결론: ‘너무나 많은 일을 한 친구에게 시키고 있다!’, 한 번 여러 친구들이 한 역할을 나눠서 분담할 수 있게 해보자!**

---

## 👭함수는 좋은 친구들!

구글링을 통해 ‘함수형 프로그래밍’을 하면 더 나은 코드 즉 ‘남이 읽기 쉬운 코드'를 작성할 수 있다고 한다!

그럼 ‘함수’는 뭔데?

## [함수 정의](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions#%ED%95%A8%EC%88%98_%EC%A0%95%EC%9D%98)

### [함수 선언](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Functions#%ED%95%A8%EC%88%98_%EC%84%A0%EC%96%B8)

함수 정의(또는 함수 선언)는 다음과 같은 `[함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/function)` 키워드로 구성되어 있습니다.

- 함수의 이름
- 함수의 매개변수들, 괄호로 묶고 쉼표로 구분합니다.
- 함수를 정의하는 JavaScript 문으로 중괄호로 묶습니다. `{ /* ... */ }`

예를 들어, 아래의 코드는 `square`라는 간단한 함수를 정의합니다.

```jsx
function square(number) {
  return number * number;
}
```

- **저 sqare 함수는 number라는 매개변수를 받아서 곱한 값을 반환하는 ‘역할’을 하고 있다.**

---

### 🔧함수 정의에 따라서 내 더러운 코드를 고쳐보자!

→ 그렇다면? 저 위의 더러운 코드도, 역할을 나눠주면 되지 않을까?

1. 스트라이크 문자를 출력하는 역할 → 스트라이크 문자를 출력하는 함수
2. 게임 종료 문구를 출력하는 역할 → 게임 종료 문구를 출력하는 함수
3. 사용자로부터 인풋을 입력받는 역할 → 사용자로부터 인풋을 입력받는 함수
4. newGame의 값이 1인지 2인지 체크하는 역할 → 값을 체크하는 함수

- 그럼 저 한 개의 단락을 4개의 함수로 나눠볼 수 있지 않을까?

```jsx
function printStrikeMessage() {
    MissionUtils.Console.print("3스트라이크");
    MissionUtils.Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
}

function printGameOverMessage() {
    MissionUtils.Console.print("게임 종료");
}

function getInputForNewGame() {
    return MissionUtils.Console.readLineAsync("게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n");
}
function handleNewGameChoice(newGame) {
    if (newGame === '1') {
        return generateNewAnswer();
    } else if (newGame === '2') {
        printGameOverMessage();
        return null; // Indicates game over
    } else {
        throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
    }
}
```

- 이렇게 위처럼 함수를 나눠놓으면 실제 게임을 실행하는 메인 로직에서는 더 읽기 쉬운 코드를 만들 수 있다.

```jsx
if (strike === 3) {
    printStrikeMessage();
    const newGame = await getInputForNewGame();
    if (newGame) {
        correctAnswer = handleNewGameChoice(newGame);
    } else {
        gameOver = true;
    }
} else if (strike === 0 && ball === 0) {
    MissionUtils.Console.print("낫싱");
} else {
    MissionUtils.Console.print(`${ball}볼 ${strike}스트라이크`);
}
```

- 이런 식으로 조금 더 간소화되고, 읽기 쉬운 코드가 탄생한다.
(물론 지금 코드도 많이 더럽다. 조금 더 반환값을 잘 설정하고, print는 따로 파일을 분리하고, 상수화도 해주면 더 나은 코드가 나타날 듯 하다)

---

## 📌회고

### ✍️ 구현할 기능 목록을 잘 정리하자!

- 순수 함수를 잘 이용하고 ‘이름 짓기’를 잘 한다면, 총 코드의 길이가 길어지고, 파일이 나눠지더라도, 실제 게임이 진행되는 부분의 코드 어느 부분에서 어떤 기능을 실행하고 있는지 한눈에 알아보기 쉬울 것
- 커밋 단위가 ‘구현 기능 목록’에 맞춰서 된다면 자연스럽게 ‘기능’ 단위로 함수를 구현하게 될 것이고, 그렇게 된다면 코드 구현은 물론, ‘테스트 코드’ 구현 또한 명확한 단위로 진행할 수 있을 것

### ➗ 그럼 기능은 어떤 단위로 분리해야 할까?

- 너무 과한 분리는 지양하자!

(유효성 검사의 경우)

- 입력받은 값이 숫자인지
- 입력받은 값이 0이 아닌지
- 입력받은 값 중 서로 같은 수가 없는지
- 입력받은 값이 음수가 아닌지

→ 위와 같은 형식으로 하나하나 다 함수화를 하는 경우?

- 물론 재사용성이나 유지보수엔 유리할 수도 있겠지만 ‘숫자야구’의 경우엔 코드의 규모가 작고, 복잡한 로직을 필요로 하지 않으므로, 너무 많은 분리는 오히려 더 코드의 구조를 복잡하게 만드는 일이라 생각,
- 추가적인 함수 호출 작업만 더 발생할 것 같음
- **내가 봤을 때 불편한, 타인에게 코드를 보여줬을 때 한눈에 읽히지 않는, (복잡한)기능이 여러가지가 중첩된 경우 분리를 고려해보자!**
    - 나의 경우는 아래와 같이 분리를 했다
        - 중첩된 반복문
        - 중첩된 조건문
        - 너무나 많은 else-if 문
    - 실제 분리의 결과 ‘기능 분리’가 뚜렸해졌고, 코드가 명확하게 읽힌다!!

### 🚀 순수 함수를 사용해보자!

- 순수 함수
    - 같은 입력에 대해서 항상 같은 출력을 반환하는 함수!
    - 외부의 상태를 변경하지 않는 함수
    - edge-case가 없어야 하며, 예측 가능해야 함

### **예시: 순수 함수**

```jsx
// 순수 함수 예시
function add(a, b) {
    return a + b;
}

const result1 = add(2, 3); // 5
const result2 = add(2, 3); // 5

console.log(result1 === result2); // true
```

이 예시에서 **`add`** 함수는 같은 입력값에 대해서 항상 동일한 결과를 반환함

외부 상태를 변경하지 않으며, edge-case가 존재하지 않음. 

따라서 이 함수는 순수 함수!

### **예시: 비순수 함수**

```jsx
// 비순수 함수 예시
let counter = 0;

function increment(value) {
    counter++;
    return value + counter;
}

const result1 = increment(2); // 3
const result2 = increment(2); // 4

console.log(result1 === result2); // false
```

1. **`counter`**라는 외부 상태가 함수 내부에서 변경됨
    
    **`counter`**는 함수 외부에 선언된 변수로서 함수 외부의 상태를 변경하고 있음 
    
    이로 인해 함수 호출 결과는 함수 외부의 상태에 의존!
    
2. 동일한 입력 **`2`**
첫 번째 호출에서는 **`counter`**가 **`1`** 증가하여 **`3`**을 반환하고, 
두 번째 호출에서는 **`counter`**가 다시 **`1`** 증가하여 **`4`**를 반환
**따라서 같은 입력에 대해 항상 동일한 결과를 보장하지 않는다!**
3. **`counter`**의 변화로 인해 함수의 edge-case 발생!
동일한 입력값에 대한 결과가 외부 상태의 변경에 의해 영향을 받고 있음
4. 결과적으로, **`increment`** 함수는 
외부 상태를 변경하고 
동일한 입력에 대해 항상 같은 결과를 보장하지 않으므로 **비순수 함수**

### 🤷 그래서? 순수 함수랑 함수형 프로그래밍이랑 뭔 상관인데?

- 순수 함수를 사용하면 코드의 ‘예측 가능성’ 이 높아짐!
- 자연스레 해당 기능에 대한 ‘테스트’와 ‘유지보수’가 용이해짐!
- 함수형 프로그래밍에서는 함수를 ‘일급 객체’로 취급하고, 함수를 인자로 전달하거나, 반환하는 고차 함수를 통해 모듈화된 코드를 작성할 수 있음!

<aside>
💡 일급 객체가 뭔데?

다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체를 가리킨다.

- 변수에 할당(assignment)할 수 있다.
- 다른 함수를 인자(argument)로 전달 받는다.
- 다른 함수의 결과로서 리턴될 수 있다.
</aside>

- 함수가 일급 객체여야, 고차함수를 만들고, 콜백을 사용할 수 있는데!
(이걸 다음 스터디 주제로 가져가봐도 좋을 것 같다!)