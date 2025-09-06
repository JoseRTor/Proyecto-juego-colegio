// Botón que recibe la escena actual y el nombre de la siguiente escena. Al hacer clic en el botón, se cambia a la siguiente escena.

export class SiguienteMundoButton {
  constructor(scene, nextScene) {
    this.relatedScene = scene;
    // Nombre del siguiente nivel
    this.nextScene = nextScene;
  }

  preload() {
    this.relatedScene.load.spritesheet(
      "button_next",
      "../imagenes/playbutton.png",
      {
        frameWidth: 190,
        frameHeight: 49,
      }
    );
  }

  create() {
    this.startButton = this.relatedScene.add
      .sprite(400, 300, "button_next")
      .setInteractive();

    this.startButton.on("pointerover", () => {
      this.startButton.setFrame(1);
    });

    this.startButton.on("pointerout", () => {
      this.startButton.setFrame(0);
    });

    this.startButton.on("pointerdown", () => {
      console.log("Cambiando a:", this.nextScene);
      this.relatedScene.scene.start(this.nextScene);
    });
  }
}
