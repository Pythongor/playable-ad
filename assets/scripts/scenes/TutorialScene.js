import BaseGameScene from "./BaseGameScene";

export default class TutorialScene extends BaseGameScene {
  constructor() {
    super("Tutorial");
    this.tutorial = true;
  }

  create() {
    this.createLighting();
    this.createWall();
    this.addBlur();
    this.createBankRobber();
    this.createText();
    this.addButton();
    this.createParts();
    this.hideParts();
  }

  createBankRobber() {
    this.bankRobber = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height * -0.2,
      "bankrobber",
    );

    this.bankRobber.setScale(this.scale * 0.3).setScrollFactor(0);

    this.tweens.add({
      targets: this.bankRobber,
      y: (this.bankRobber.height * this.bankRobber.scale) / 1.5,
      angle: 0,
      ease: "Back",
      duration: 1000,
    });
  }

  update() {
    if (this.swipesLeft <= 0 && this.tutorial) {
      this.tutorial = false;
      this.endOfTutorial();
    }
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

  addFinger() {
    this.finger = this.add
      .image(
        this.cameras.main.width / 2,
        -(this.cameras.main.height / 6),
        "finger",
      )
      .setAngle(45);

    const scale = this.getScale(this.finger, 0.3, false);
    this.finger.setScale(scale).setScrollFactor(0);

    this.tweens.add({
      targets: this.finger,
      x: this.finger.width * this.finger.scale,
      y: this.cameras.main.height / 6,
      angle: 0,
      ease: "Back",
      duration: 500,
      delay: 500,
      onComplete: () => this.swipeFinger(),
    });
  }

  swipeFinger() {
    this.tweens.add({
      targets: this.finger,
      x: 0,
      y: this.cameras.main.height / 1.5,
      angle: -45,
      ease: "Back",
      duration: 500,
      delay: 500,
      onComplete: () =>
        this.tweens.add({
          targets: this.finger,
          angle: 45,
          x: this.cameras.main.width / 2,
          ease: "Linear",
          duration: 500,
          yoyo: true,
          onComplete: () =>
            this.tweens.add({
              targets: this.finger,
              x: this.cameras.main.width / 4,
              angle: 0,
              ease: "Linear",
              duration: 500,
              onComplete: () => this.enableSwipe(),
            }),
        }),
    });
  }
  forEachPart(handler) {
    this.facePositions.forEach(({ parts }) =>
      parts.forEach(({ part }) => handler(part)),
    );
  }

  hideParts() {
    this.forEachPart((part) => part.setAlpha(0));
  }

  showParts() {
    this.forEachPart((part) =>
      this.tweens.add({
        targets: part,
        alpha: 1,
        ease: "Linear",
        duration: 1000,
      }),
    );
  }

  fadeParts() {
    this.forEachPart((part) =>
      this.tweens.add({
        targets: part,
        alpha: 0,
        ease: "Linear",
        duration: 1000,
      }),
    );
  }

  createText() {
    this.text = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "Find\nBank robber!",
        {
          font: "40px",
          fill: "white",
          align: "center",
        },
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: this.text,
      alpha: 1,
      ease: "Back",
      duration: 1000,
    });
  }

  addButton() {
    this.button = this.add
      .sprite(
        this.cameras.main.width / 2,
        this.cameras.main.height * 1.2,
        "tutorialBtn",
      )
      .setInteractive();

    const scale = this.getScale(this.button, 0.13, true, "y");
    this.button.setScale(scale).setScrollFactor(0);

    this.buttonText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height * 1.2,
        "Next",
        {
          font: "40px bold",
          fill: "black",
          align: "center",
        },
      )
      .setOrigin(0.5, 0.5);

    this.buttonText.setScale(scale).setScrollFactor(0);
    this.button.on("pointerdown", () => this.swipeTutorial());

    this.tweens.add({
      targets: [this.button, this.buttonText],
      y: this.cameras.main.height * 0.8,
      ease: "Back",
      duration: 1000,
      repeatDelay: 1000,
    });
  }

  swipeTutorial() {
    this.button.on("pointerdown", () => {});
    this.text.setAlpha(0);

    this.tweens.add({
      targets: this.bankRobber,
      alpha: 0.3,
      ease: "Linear",
      duration: 500,
    });

    this.tweens.add({
      targets: [this.button, this.buttonText],
      alpha: 0,
      ease: "Linear",
      duration: 500,
    });

    this.addFinger();
    this.showParts();
  }

  enableSwipe() {
    this.text.setY(this.cameras.main.height / 4);
    this.text.text = "Swipe to\nchange face";
    this.text.setAlpha(1);
    this.addSwipeBehavior();
  }

  endOfTutorial() {
    this.text.text = "You got it!\nLets play!";
    this.buttonText.text = "Play";
    this.button.on("pointerdown", () => this.scene.start("Game"));

    this.fadeParts();

    this.tweens.add({
      targets: this.finger,
      alpha: 0,
      ease: "Linear",
      duration: 1000,
    });
    this.bounceButton();
  }

  bounceButton() {
    this.tweens.add({
      targets: [this.button, this.buttonText],
      alpha: 1,
      ease: "Linear",
      duration: 1000,
    });

    this.tweens.add({
      targets: [this.button, this.buttonText],
      scale: this.button.scale * 1.5,
      ease: "Back",
      duration: 1000,
      yoyo: true,
      delay: 1000,
      repeat: 1,
    });
  }
}
