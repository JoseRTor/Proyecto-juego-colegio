// Botón para reiniciar el juego. Es el mismo que el usado en el ejemplo realizado en clase, pero con otra imagen.
export class RestartButton {
  constructor(scene) {
    this.relatedScene = scene;
  }

  preload() {
    this.relatedScene.load.spritesheet("button", "../imagenes/restart.png", {
      frameWidth: 190,
      frameHeight: 49,
    });
  }

  create() {
    this.startButton = this.relatedScene.add
      .sprite(400, 230, "button")
      .setInteractive();
    this.startButton.on("pointerover", () => {
      this.startButton.setFrame(1);
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setFrame(0);
    });
    this.startButton.on("pointerdown", () => {
      this.relatedScene.scene.start("game");
    });
  }
}
