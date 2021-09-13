class GameScene extends BaseGameScene {
  constructor() {
    super("Game");
    this.swipesLeft = 3;
  }

  update() {
    if (this.swipesLeft <= 0) {
      this.scene.launch("Final");
      this.scene.pause();
    }
  }
}
