import { RestartButton } from "../componentes/RestartButton.js";
//Pantalla final. No hay mucho que explicar.
export class Final extends Phaser.Scene {
  constructor() {
    super({ key: "final" });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image("final", "../imagenes/fin.png");
    this.load.audio("finalTheme", "../audio/finalTheme.mp3");
    this.restartButton.preload();
  }

  create() {
    this.add.image(410, 250, "final");
    this.music = this.sound.add(
      "finalTheme",
      { loop: false },
      { volume: 0.03 }
    );
    this.music.play();
    this.restartButton.create();
  }
}
