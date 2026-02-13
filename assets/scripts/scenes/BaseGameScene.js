import CharacterPart, { availableParts } from "../classes/CharacterPart";

export default class BaseGameScene extends Phaser.Scene {
  start = false;
  constructor(name) {
    super(name);
    this.facePositions = [];
    this.swipesLeft = 1;
  }

  create() {
    this.createBackground();
    this.createParts();
    this.addSwipeBehavior();
  }

  addSwipeBehavior() {
    this.swipeInput = this.rexGestures.add
      .swipe({ velocityThreshold: 1000, dir: "left&right" })
      .on("swipe", this.swipeHandler, this);
  }

  swipeHandler({ lastPointer: { downY }, left, right }) {
    let swipedPart = null;
    this.facePositions.forEach(({ start, end }, index) => {
      if (downY >= start && downY <= end) swipedPart = index;
    });

    if (typeof swipedPart === "number") {
      const direction = right ? "right" : left ? "left" : null;
      if (!direction) return;

      this.facePositions[swipedPart].parts.forEach(({ part }) => {
        part.swipe(direction);
      });

      setTimeout(() => {
        this.reorganizeParts(swipedPart, direction);
        --this.swipesLeft;
      }, 350);
    }
  }

  reorganizeParts(swipedPart, direction) {
    const { parts } = this.facePositions[swipedPart];
    const width = this.cameras.main.width;
    const centerX = width / 2;

    if (direction === "right") {
      const last = parts.pop();
      last.part.setX(centerX + width * (1 - 2.0));
      parts.unshift(last);
    } else if (direction === "left") {
      const first = parts.shift();
      last.part.setX(centerX + width * (4 - 2.0));
      parts.push(first);
    }
  }

  createBackground() {
    this.createLighting();
    this.createWall();
    this.createBankRobber();
  }

  getScale(image, coeff = 1, cover = true, dimension = null) {
    const scaleX = this.cameras.main.width / image.width;
    const scaleY = this.cameras.main.height / image.height;

    if (dimension === "x") return scaleX * coeff;
    if (dimension === "y") return scaleY * coeff;

    const mathFunc = cover ? Math.max : Math.min;
    return mathFunc(scaleX, scaleY) * coeff;
  }

  createLighting() {
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "lighting",
    );

    const scale = this.getScale(this.background, 1.5, false, "x");
    this.background.setScale(scale).setScrollFactor(0);
  }

  createWall() {
    this.wall = this.add.image(this.cameras.main.width / 2, 0, "wall");
    this.scale = this.getScale(this.wall, 1.1, false);
    this.wall.setScale(this.scale).setScrollFactor(0);
    this.wall.setY(
      this.cameras.main.height - (this.wall.height * this.wall.scale) / 3,
    );
  }

  createBankRobber() {
    this.bankRobber = this.add.image(
      this.cameras.main.width / 2,
      0,
      "bankrobber",
    );

    this.bankRobber.setScale(this.scale * 0.3).setScrollFactor(0);
    this.bankRobber.setY(
      (this.bankRobber.height * this.bankRobber.scale) / 1.5,
    );
  }

  shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  createFacePartStripe(yIndex, xIndex, characterIndex) {
    const xPos =
      this.cameras.main.width / 2 + this.cameras.main.width * (xIndex - 2.0);
    const char = new CharacterPart(this, characterIndex, yIndex, xPos, 0);

    char.setScale(this.scale * 0.8);
    char.y =
      this.cameras.main.height - char.height * char.scale * (5 - yIndex + 0.5);

    this.facePositions[yIndex - 1].parts.push({
      index: characterIndex,
      part: char,
    });
  }

  createParts() {
    this.facePositions = [];

    for (let yIndex = 1; yIndex < 5; yIndex++) {
      this.facePositions.push({ start: null, end: null, parts: [] });
      const currentPosition = this.facePositions[yIndex - 1];
      const shuffled = this.shuffle([...availableParts]);

      shuffled.forEach((characterIndex, xIndex) =>
        this.createFacePartStripe(yIndex, xIndex + 1, characterIndex),
      );

      const { parts } = currentPosition;

      if (parts.length > 0) {
        const { part } = parts[0];
        const height = part.height * part.scale;
        currentPosition.start = part.y - height / 2;
        currentPosition.end = part.y + height / 2;
      }
    }
  }
}
