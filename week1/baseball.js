const MissionUtils = require("@woowacourse/mission-utils");

const { Console, Random } = MissionUtils;

class BaseballGame {
  #randomNumber = [];
  #userNumber = [];
  #gameOver = false;

  #isDuplication(nums) {
    const numberSet = new Set(nums);
    return numberSet.size !== nums.length;
  }

  #isInRange(nums) {
    return nums.every((num) => num > 0 && num < 10);
  }

  #isValidLength(nums) {
    return nums.length === 3;
  }

  #validateUserInput(number) {
    if (!isNaN(parseInt(number))) {
      const nums = number.split("").map(Number);
      return (
        !this.#isDuplication(nums) &&
        this.#isInRange(nums) &&
        this.#isValidLength(nums)
      );
    }
    return false;
  }

  async #restartGame() {
    const restartAnswer = await Console.readLineAsync(
      "게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요."
    );

    if (restartAnswer === "1") {
      this.#randomNumber = [];
      this.#userNumber = [];
      this.#startGame();
    } else if (restartAnswer === "2") {
      this.#gameOver = true;
    } else {
      throw new Error("[ERROR] 잘못된 입력입니다.");
    }
  }

  async #getUserInput() {
    let number;
    try {
      number = await Console.readLineAsync("숫자를 입력해주세요: ");
      if (!this.#validateUserInput(number)) {
        throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
      }
    } catch (error) {
      throw error;
    }

    this.#userNumber = number.split("").map(Number);
    const result = this.#getNumberOfHits();
    this.#printAnswer(result);

    if (!this.#gameOver) {
      this.#answer ? await this.#restartGame() : await this.#getUserInput();
    }
  }

  #getRandomNumber() {
    while (this.#randomNumber.length < 3) {
      const number = Random.pickNumberInRange(1, 9);
      if (!this.#randomNumber.includes(number)) {
        this.#randomNumber.push(number);
      }
    }
  }

  #getNumberOfHits() {
    const score = [0, 0];
    this.#randomNumber.forEach((number, index) => {
      if (this.#userNumber[index] === number) score[0] += 1;
      else if (this.#userNumber.includes(number)) score[1] += 1;
    });
    return score;
  }

  #printAnswer(result) {
    const [strike, ball] = result;
    if (strike === 3) {
      Console.print("3스트라이크");
      Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");
      this.#gameOver = true;
    } else if (strike === 0 && ball === 0) {
      Console.print("낫싱");
    } else if (strike === 0 && ball > 0) {
      Console.print(`${ball}볼`);
    } else if (strike > 0 && ball === 0) {
      Console.print(`${strike}스트라이크`);
    } else {
      Console.print(`${ball}볼 ${strike}스트라이크`);
    }
  }

  async #startGame() {
    await Console.print("숫자 야구 게임을 시작합니다.");
    await this.#getRandomNumber();
    await this.#getUserInput();
  }

  async play() {
    await this.#startGame();
  }
}

module.exports = BaseballGame;
