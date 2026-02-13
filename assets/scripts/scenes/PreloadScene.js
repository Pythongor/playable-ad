import charactersBase64 from "/assets/images/face-elements/characters.png";
import charactersJsonRaw from "/assets/images/face-elements/characters.json";
import lightingImg from "/assets/images/lighting.png";
import wallImg from "/assets/images/wall.png";
import bankrobberImg from "/assets/images/bankrobber.png";
import fingerImg from "/assets/images/tutorial/finger.png";
import tutorialBtnImg from "/assets/images/tutorial/button.png";
import icon from "/assets/images/icon.png";
import playNowBtn from "/assets/images/playNowBtn.png";

import { availableParts } from "../classes/CharacterPart";

const allowedPrefixes = availableParts.map((id) => `char${id}`);

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.textures.addBase64("lighting", lightingImg);
    this.textures.addBase64("wall", wallImg);
    this.textures.addBase64("bankrobber", bankrobberImg);
    this.textures.addBase64("finger", fingerImg);
    this.textures.addBase64("tutorialBtn", tutorialBtnImg);
    this.textures.addBase64("icon", icon);
    this.textures.addBase64("playNowBtn", playNowBtn);

    const sheetImg = new Image();

    sheetImg.onload = () => {
      const fullData = charactersJsonRaw.default || charactersJsonRaw;

      const filteredData = {
        ...fullData,
        frames: Array.isArray(fullData.frames)
          ? fullData.frames.filter(
              allowedPrefixes.some((prefix) =>
                frame.filename.startsWith(prefix),
              ),
            )
          : fullData.frames,
      };

      this.textures.addAtlas("characters", sheetImg, filteredData);
      this.atlasReady = true;
    };

    sheetImg.src = charactersBase64;
  }

  create() {
    this.createText();
    this.time.delayedCall(100, () => {
      this.scene.start("Tutorial");
    });
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
        },
      )
      .setOrigin(0.5, 0.5);
  }
}
