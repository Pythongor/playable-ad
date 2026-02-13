import CharacterPart, {
  availableParts,
  Direction,
} from "../classes/CharacterPart";
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin";
import Swipe from "phaser3-rex-plugins/plugins/input/gestures/swipe/Swipe";
import { Dimension } from "./FinalScene";

interface RexSwipeEvent {
  lastPointer: Phaser.Input.Pointer;
  left: boolean;
  right: boolean;
  direction: number;
}

export default class BaseGameScene extends Phaser.Scene {
  rexGestures!: GesturesPlugin;
  start: boolean = false;
  facePositions: {
    start: number | null;
    end: number | null;
    parts: { index: number; part: CharacterPart }[];
  }[];
  swipesLeft: number;
  swipeInput?: Swipe;
  background?: Phaser.GameObjects.Image;
  wall?: Phaser.GameObjects.Image;
  bankRobber?: Phaser.GameObjects.Image;
  scalingCoeff?: number;

  constructor(name?: string | Phaser.Types.Scenes.SettingsConfig) {
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
      .swipe(this, {
        velocityThreshold: 1000,
        dir: "left&right",
      })
      .on("swipe", this.swipeHandler, this);
  }

  swipeHandler({ lastPointer: { downY }, left, right }: RexSwipeEvent) {
    let swipedPart: number | null = null;
    this.facePositions.forEach(({ start, end }, index) => {
      if (start && end && downY >= start && downY <= end) swipedPart = index;
    });

    if (typeof swipedPart === "number") {
      const direction = right ? Direction.Right : left ? Direction.Left : null;
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

  reorganizeParts(swipedPart: number | null, direction: Direction) {
    if (!swipedPart) return;

    const { parts } = this.facePositions[swipedPart];
    const width = this.cameras.main.width;
    const centerX = width / 2;

    if (direction === Direction.Right) {
      const last = parts.pop();
      if (last) {
        last.part.setX(centerX + width * (1 - 2.0));
        parts.unshift(last);
      }
    } else if (direction === Direction.Left) {
      const first = parts.shift();
      if (first) {
        first.part.setX(centerX + width * (4 - 2.0));
        parts.push(first);
      }
    }
  }

  createBackground() {
    this.createLighting();
    this.createWall();
    this.createBankRobber();
  }

  getScale(
    image: Phaser.GameObjects.Image,
    coeff: number = 1,
    cover: boolean = true,
    dimension: Dimension | null = null,
  ) {
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

    const scale = this.getScale(this.background, 1.5, false, Dimension.X);
    this.background.setScale(scale).setScrollFactor(0);
  }

  createWall() {
    this.wall = this.add.image(this.cameras.main.width / 2, 0, "wall");
    this.scalingCoeff = this.getScale(this.wall, 1.1, false);
    this.wall.setScale(this.scalingCoeff).setScrollFactor(0);
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

    this.bankRobber.setScale((this.scalingCoeff ?? 1) * 0.3).setScrollFactor(0);
    this.bankRobber.setY(
      (this.bankRobber.height * this.bankRobber.scale) / 1.5,
    );
  }

  shuffle<T>(array: Array<T>) {
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

  createFacePartStripe(yIndex: number, xIndex: number, characterIndex: number) {
    const xPos =
      this.cameras.main.width / 2 + this.cameras.main.width * (xIndex - 2.0);
    const char = new CharacterPart(this, characterIndex, yIndex, xPos, 0);

    char.setScale((this.scalingCoeff ?? 1) * 0.8);
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
