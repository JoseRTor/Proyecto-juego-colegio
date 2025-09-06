import { RestartButton } from "../componentes/RestartButton.js";
//Pantalla de gameover. No hay mucho que explicar. Es exáctamente la misma pantalla que la del juego
//de muestra que hicimos, pero con música añadida.
export class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: "gameover" });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image("gameover", "../imagenes/gameover.png");
    this.load.audio("themeSongGameOver", "../audio/themeSongGameOver.mp3");
    this.restartButton.preload();
  }

  create() {
    this.add.image(410, 250, "gameover");

    this.music = this.sound.add("themeSongGameOver", {
      loop: false,
      volume: 1,
    });

    this.music.play();

    this.restartButton.create();
  }
}
