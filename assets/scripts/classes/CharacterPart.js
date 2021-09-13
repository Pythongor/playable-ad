class CharacterPart extends Phaser.GameObjects.Sprite {
  constructor(scene, character, part, x, y) {
    super(scene, x, y, "characters", `char${character}_0${part}.png`);
    console.log();
    this.init();
  }

  init() {
    this.scene.add.existing(this);
  }

  swipe(direction, onComplete = () => {}) {
    if (direction)
      this.scene.tweens.add({
        targets: this,
        x:
          direction === "right"
            ? this.x + this.scene.cameras.main.width
            : this.x - this.scene.cameras.main.width,
        ease: "Linear",
        duration: 300,
        onComplete,
      });
  }
}
