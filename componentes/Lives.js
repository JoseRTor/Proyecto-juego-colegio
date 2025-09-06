// Son las vidas del juego. Se crean en la esquina superior derecha. Se pueden perder vidas al chocar con meteoritos o láseres enemigos.
// Podría haber creado aquí lo de las vidas para el showGameOver, pero me da mil errores y no sé por dónde empezar. Debería haberlo creado junto.
// Mi error ha sido añadir esto una vez terminé el juego.
export class Lives {
  constructor(scene, x, y, maxLives = 3) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.maxLives = maxLives;
    this.lives = maxLives;
    this.hearts = [];
  }

  preload() {
    this.scene.load.image("heart", "../imagenes/heart.png");
  }

  create() {
    const separation = 40;
     // Espaciado entre corazones

    for (let i = 0; i < this.maxLives; i++) {
      let heart = this.scene.add.image(
        this.x + i * separation,
        this.y,
        "heart"
      );
      heart.setScale(0.1);
       // Tamaño muy pequeño que ocupa si no toda la pantalla.
      this.hearts.push(heart);
    }
  }

  decreaseLife() {
    if (this.lives > 0) {
      this.lives--;
      this.hearts[this.lives].setVisible(false);
    }
  }
}
