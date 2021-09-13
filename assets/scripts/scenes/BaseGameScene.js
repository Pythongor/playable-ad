class BaseGameScene extends Phaser.Scene {
  start = false;
  constructor(name) {
    super(name);
    this.facePositions = [];
    this.swipesLeft = 1;
  }

  preload() {
    this.load.scenePlugin({
      key: "rexgesturesplugin",
      url: "assets/scripts/libs/rexgesturesplugin.min.js",
      sceneKey: "rexGestures",
    });
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
      if (start <= downY && end >= downY) swipedPart = index;
    });
    if (typeof swipedPart === "number") {
      const direction = right ? "right" : left ? "left" : null;
      this.facePositions[swipedPart].parts.forEach(({ part, index }) => {
        part.swipe(direction);
      });
      setTimeout(() => {
        this.reorganizeParts(swipedPart, direction);
        --this.swipesLeft;
      }, 350);
    }
  }

  reorganizeParts(swipedPart, direction) {
    if (direction === "right") {
      const { parts } = this.facePositions[swipedPart];
      const last = parts.pop();
      last.part.setX(this.cameras.main.width * -3.5);
      parts.unshift(last);
    } else if (direction === "left") {
      const { parts } = this.facePositions[swipedPart];
      const first = parts.shift();
      first.part.setX(this.cameras.main.width * 2.5);
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
    if (dimension === "x") {
      return scaleX * coeff;
    } else if (dimension === "y") {
      return scaleY * coeff;
    } else {
      const mathFunc = cover ? Math.max : Math.min;
      return mathFunc(scaleX, scaleY) * coeff;
    }
  }

  createLighting() {
    this.background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "lighting"
    );
    const scale = this.getScale(this.background, 1.5, false, "x");
    this.background.setScale(scale).setScrollFactor(0);
  }

  createWall() {
    this.wall = this.add.image(this.cameras.main.width / 2, 0, "wall");
    this.scale = this.getScale(this.wall, 1.1, false);
    this.wall.setScale(this.scale).setScrollFactor(0);
    this.wall.setY(
      this.cameras.main.height - (this.wall.height * this.wall.scale) / 3
    );
  }

  createBankRobber() {
    this.bankRobber = this.add.image(
      this.cameras.main.width / 2,
      0,
      "bankrobber"
    );
    this.bankRobber.setScale(this.scale * 0.3).setScrollFactor(0);
    this.bankRobber.setY(
      (this.bankRobber.height * this.bankRobber.scale) / 1.5
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
    const char = new CharacterPart(
      this,
      characterIndex,
      5 - yIndex,
      this.cameras.main.width * (xIndex - 4.5),
      0
    );
    char.setScale(this.scale * 0.8);
    char.y = this.cameras.main.height - char.height * char.scale * yIndex;
    this.facePositions[yIndex - 1].parts.push({
      index: characterIndex,
      part: char,
    });
  }

  createParts() {
    for (let yIndex = 1; yIndex < 5; yIndex++) {
      this.facePositions.push({ start: null, end: null, parts: [] });
      const currentPosition = this.facePositions[yIndex - 1];
      const shuffled = this.shuffle([1, 2, 3, 4, 5, 6, 7]);
      console.log(shuffled);
      shuffled.forEach((characterIndex, xIndex) =>
        this.createFacePartStripe(yIndex, xIndex + 1, characterIndex)
      );
      const { parts } = this.facePositions[yIndex - 1];
      const { part } = parts[0];
      const height = part.height * part.scale;
      currentPosition.start =
        this.cameras.main.height - height * (yIndex + 0.5);
      currentPosition.end = this.cameras.main.height - height * (yIndex - 0.5);
    }
  }
}
