const initConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [PreloadScene, TutorialScene, GameScene, FinalScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(initConfig);
