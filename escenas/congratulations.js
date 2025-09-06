import { SiguienteMundoButton } from "../componentes/SiguienteMundoButton.js";
//congratulations pero es la principal. Seguramente haya una manera de poder usar sólo una pantalla, e
// ir cambiando de fondo en función de la pantalla del juego en la que estemos, pero no he encontrado la manera.
//Bastante es que me funciona.
export class Congratulations extends Phaser.Scene {
  constructor() {
    super({ key: "congratulations" });
    this.siguienteMundoButton = new SiguienteMundoButton(this);
  }

  init(data) {
    this.nextScene = data.nextScene || "game"; //
  }

  preload() {
    this.load.image("victory", "../imagenes/victory.png");

    this.siguienteMundoButton.preload();
  }

  create() {
    this.add.image(410, 250, "victory");

    // 🔹 Ahora `this.nextScene` tiene valor correcto
    this.siguienteMundoButton = new SiguienteMundoButton(this, this.nextScene);
    this.siguienteMundoButton.create();
  }
}
