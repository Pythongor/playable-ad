import "phaser";
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
import PreloadScene from "./scenes/PreloadScene";
import TutorialScene from "./scenes/TutorialScene";
import GameScene from "./scenes/GameScene";
import FinalScene from "./scenes/FinalScene";

const initConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [PreloadScene, TutorialScene, GameScene, FinalScene],
  plugins: {
    scene: [
      {
        key: "rexGestures",
        plugin: GesturesPlugin,
        mapping: "rexGestures",
      },
    ],
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

new Phaser.Game(initConfig);
