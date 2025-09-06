//Puntuacion del juego. No es muy complicado. Se añade un texto en la esquina superior izquierda.

export class Scoreboard {
  constructor(scene) {
    this.relatedScene = scene;
    this.score = 0;
  }

  create() {
    this.scoreText = this.relatedScene.add.text(16, 16, "PUNTOS: 0", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "verdana,arial,sans-serif",
      color: "#ff0000",
    });
  }
  incrementPoints(points) {
    this.score += points;
    this.scoreText.setText("PUNTOS: " + this.score);
  }
}
