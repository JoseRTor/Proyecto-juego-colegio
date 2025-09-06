import { SiguienteMundoButton } from "../componentes/SiguienteMundoButton.js";
//Pantalla de congratulations pero Dos.
export class CongratulationsDos extends Phaser.Scene {
  constructor() {
    super({ key: "congratulationsDos" });
    this.siguienteMundoButton = new SiguienteMundoButton(this);
  }

  init(data) {
    //Defino el || "game" por si hay algún error a la hora de recoger el nextScene
    this.nextScene = data.nextScene || "game"; 
  }

  preload() {
    this.load.image("victoryFinal", "../imagenes/finalVictory.png");

    this.siguienteMundoButton.preload();
  }

  create() {
    this.add.image(410, 250, "victoryFinal");

    this.siguienteMundoButton = new SiguienteMundoButton(this, this.nextScene);
    this.siguienteMundoButton.create();
  }
}
