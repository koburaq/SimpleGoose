export class Player {
  constructor(name) {
    this.name = name;
    this.position = 0;
  }

  rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  move(steps) {
    this.position += steps;
  }

  hasWon(goal) {
    return this.position >= goal;
  }
}
