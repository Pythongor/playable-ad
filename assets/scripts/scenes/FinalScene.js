export default class FinalScene extends Phaser.Scene {
  constructor() {
    super("Final");
  }

  create() {
    this.addBlur();
    this.addIcon();
    this.addButton();
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

  addIcon() {
    const icon = this.add
      .image(
        this.cameras.main.width / 2,
        -(this.cameras.main.height / 6),
        "icon",
      )
      .setAngle(45);

    const scale = this.getScale(icon, 0.3, false);
    icon.setScale(scale).setScrollFactor(0);

    this.tweens.add({
      targets: icon,
      y: this.cameras.main.height / 6,
      angle: 0,
      ease: "Back",
      duration: 1000,
    });
  }

  addButton() {
    const button = this.add
      .sprite(
        this.cameras.main.width / 2,
        this.cameras.main.height * 1.2,
        "playNowBtn",
      )
      .setInteractive();
    const scale = this.getScale(button, 0.5, false, "x");

    button.setScale(scale).setScrollFactor(0);
    button.on("pointerdown", function (pointer) {
      window.open("http://google.com/");
    });

    this.tweens.add({
      targets: button,
      y: this.cameras.main.height / 1.2,
      ease: "Back",
      duration: 1000,
      repeatDelay: 1000,
      onComplete: () =>
        this.tweens.add({
          targets: button,
          scale: scale * 2,
          ease: "Back",
          duration: 1000,
          yoyo: true,
          delay: 1000,
          repeat: 1,
        }),
    });
  }

  addBlur() {
    const rectangle = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        "black",
      )
      .setOrigin(0, 0)
      .setAlpha(0);

    this.tweens.add({
      targets: rectangle,
      alpha: 0.8,
      ease: "Linear",
      duration: 500,
    });
  }
}
