class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.multiatlas(
      "characters",
      "assets/images/face-elements/characters.json",
      "assets/images/face-elements/"
    );
    this.load.image("lighting", "assets/images/lighting.png");
    this.load.image("wall", "assets/images/wall.png");
    this.load.image("bankrobber", "assets/images/bankrobber.png");
    this.load.image("icon", "assets/images/icon.png");
    this.load.image("playNowBtn", "assets/images/playNowBtn.png");
    this.load.image("infinity", "assets/images/tutorial/infinity.png");
    this.load.image("finger", "assets/images/tutorial/finger.png");
    this.load.image("tutorialBtn", "assets/images/tutorial/button.png");
    this.load.scenePlugin({
      key: "rexgesturesplugin",
      url: "assets/scripts/libs/rexgesturesplugin.min.js",
      sceneKey: "rexGestures",
    });
    console.log("Preload loaded");
  }

  create() {
    this.createText();
    this.scene.start("Tutorial");
  }

  createText() {
    this.text = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        `Loading...`,
        {
          font: "40px",
          fill: "white",
        }
      )
      .setOrigin(0.5, 0.5);
  }
}
