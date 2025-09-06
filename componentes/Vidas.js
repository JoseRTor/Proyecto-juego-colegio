//Maneja las vidas. Pero no en imagen.
//No ha habido manera de poder poner imagenes aquí. Sé que podría haber aprovechado este componente
//para poner imágenes, pero se me rompía el juego. Debería haberlo hecho antes de haber avanzado tanto, para no ponerme a cambiarlo todo.
export class Vidas {
  constructor(scene) {
    this.relatedScene = scene;
    this.vidas = 3;
  }

  create() {}
  adiosVida(vida) {
    this.vidas -= vida;
  }
}
