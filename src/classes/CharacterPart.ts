export const availableParts: Array<number> = [2, 3, 5, 7];

export enum Direction {
  Right = "right",
  Left = "left",
}

export default class CharacterPart extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    character: number,
    part: number,
    x: number,
    y: number,
  ) {
    super(scene, x, y, "characters", `char${character}_0${part}.png`);
    this.init();
  }

  init() {
    this.scene.add.existing(this);
  }

  swipe(direction: Direction, onComplete: () => void = () => {}) {
    if (direction)
      this.scene.tweens.add({
        targets: this,
        x:
          direction === Direction.Right
            ? this.x + this.scene.cameras.main.width
            : this.x - this.scene.cameras.main.width,
        ease: "Linear",
        duration: 300,
        onComplete,
      });
  }
}
