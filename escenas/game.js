import { Scoreboard } from "../componentes/Scoreboard.js";
import { Vidas } from "../componentes/Vidas.js";
import { Lives } from "../componentes/Lives.js";
// Clase principal del juego

export class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
    this.lives = null;
  }
  // Método de Inicializar

  init() {
    //Inicializamos el marcador
    this.scoreboard = new Scoreboard(this);
    //Inicializamos el sistema de vidas. Hay dos sistemas. Este es para saber cuándo hemos perdido
    this.vidas = new Vidas(this);
    // Con esto hacemos que el resto de la música pare. Evitamos que se superponga la música en caso de venir de otra escena.
    this.sound.stopAll();
  }
  // Cargamos todos los recursos (imágenes y sonidos)
  // He aprendido demasiado tarde a que todo lo que carga aquí, se carga en todas las pantallas. No he sabido gestionar bien las imágenes y los sonidos.
  //Pero al menos ya lo sé para la próxima vez.
  preload() {
    this.load.image("background", "../imagenes/mundo1.png");
    this.load.image("nave", "../imagenes/nave.png");
    this.load.image("bala", "../imagenes/disparo.png");
    this.load.image("meteorito1", "../imagenes/meteorito1.png");
    this.load.image("meteorito2", "../imagenes/meteorito2.png");
    this.load.image("meteorito3", "../imagenes/meteorito3.png");
    this.load.audio("themeSongLevelOne", "../audio/themeSongLevelOne.mp3");
    this.load.audio("explosion", "../audio/explosion.mp3");
    this.load.audio("disparo", "../audio/laserShot.mp3");
    this.load.audio("getDaño", "../audio/dañoRecibido.mp3");
    this.lives = new Lives(this, 680, 50);
    this.lives.preload();
  }
  // Creamos las vidas (imagenes que se irán quitando en función del daño que recibamos)

  create() {
    //Configuramos los límites del mundo.
    this.physics.world.setBoundsCollision(false, false, false, false);
    // Para que ocupe todo el fondo. Se ajusta al tamaño de la pantalla
    const background = this.add.image(0, 0, "background").setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;
    // Se crean las vidas
    this.lives.create();
    // Es la banda sonora
    this.music = this.sound.add(
      "themeSongLevelOne",
      { loop: true },
      { volume: 0.03 }
    );
    this.music.play();
    //Los puntos que recibimos
    this.scoreboard.create();
    //Para restar vidas y terminar el juego
    this.vidas.create();
    // Creación de la nave
    this.nave = this.physics.add.image(400, 460, "nave").setImmovable();
    this.nave.body.allowGravity = false;

    // Creamos los grupos de balas y meteoritos
    this.balas = this.physics.add.group();
    this.meteoritos = this.physics.add.group();

    // Generar la primera bala debajo de la nave y hacerla invisible
    this.addBala();
    // Configuración de controles. En este caso, añado el uso del espacio, no como en el juego anterior que no era usado.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Evento que crea meteoritos cada cierto tiempo y en bucle.
    this.time.addEvent({
      delay: 1000,
      // Intervalo de tiempo en milisegundos
      callback: this.addMeteorito,
      callbackScope: this,
      loop: true,
    });
    // Colisiones
    this.physics.add.collider(
      this.balas,
      this.meteoritos,
      this.impactoMeteorito,
      null,
      this
    );
    this.physics.add.collider(
      this.meteoritos,
      this.nave,
      this.colisionNaveMeteorito,
      null,
      this
    );
  }
  // Método que añade una bala debajo de la nave
  addBala() {
    const bala = this.physics.add.image(this.nave.x, this.nave.y + 20, "bala");
    bala.setVisible(false);
    bala.setCollideWorldBounds(true);
    bala.setBounce(1, 0);
    this.balas.add(bala);
  }
  // Método que genera aleatoriamente uno de los 3 meteoritos proporcionados
  addMeteorito() {
    const x = Phaser.Math.Between(0, this.scale.width);
    const meteoritoKey = Phaser.Math.RND.pick([
      "meteorito1",
      "meteorito2",
      "meteorito3",
    ]);
    const meteorito = this.add.image(x, 0, meteoritoKey);
    // La velocidad asignada a los meteoritos es aleatoria
    meteorito.speed = Phaser.Math.Between(2, 5);
    // Definimos la "vida" de cada meteorito
    if (meteoritoKey === "meteorito1") {
      meteorito.impactosRestantes = 2;
    } else if (meteoritoKey === "meteorito2") {
      meteorito.impactosRestantes = 3;
    } else if (meteoritoKey === "meteorito3") {
      meteorito.impactosRestantes = 4;
    }
    //Los añadimos a un grupo para que no se rompa el juego.
    this.meteoritos.add(meteorito);
  }
  // Con este método manejamos el daño que recibe un meteorito.
  impactoMeteorito(bala, meteorito) {
    //Restamos vida
    meteorito.impactosRestantes -= 1;
    //Destruimos la bala.
    bala.destroy();
    //Si la vida del meteorito llega a cero, se destruye
    if (meteorito.impactosRestantes === 0) {
      //Sonido de explosión
      this.sound.play("explosion");
      meteorito.destroy();
      this.scoreboard.incrementPoints(10);
      //Los puntos necesarios para ganar
      if (this.scoreboard.score >= 100) {
        this.music.stop();
        this.showCongratulations();
      }
    }
    //si no, se vuelve de color rojo, para alertar de que recibe daño
    else {
      meteorito.setTint(0xff0000);
      this.time.addEvent({
        delay: 100,
        callback: () => {
          meteorito.clearTint();
        },
        callbackScope: this,
        loop: false,
      });
    }
  }
  // Método para manejar el daño recibido por la nave.

  colisionNaveMeteorito(nave, meteorito) {
    //Cambiamos el color
    nave.setTint(0xff0000);
    //Sonido de daño
    this.sound.play("getDaño");
    this.physics.pause();
    this.vidas.adiosVida(1);
    //Quitamos una vida
    this.lives.decreaseLife();
    //Quitamos la imagen. No he sabido gestionar las dos cosas en un solo componente y se me rompía el juego :(
    // Se reanuda el juego si quedan vidas, pero con segundos para no acumular otros impactos.
    if (this.vidas.vidas > 0) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          nave.clearTint();
          this.physics.resume();
        },
        callbackScope: this,
      });
    }
    //Paramos la música y el juego. Hemos perdido en este punto
    else {
      this.music.stop();
      //Enseñamos pantalla de Game Over
      this.showGameOver();
    }
  }
  // Control de movimiento y disparo de la nave
  update() {
    //movimiento de la nave de izquierda a derecha
    if (this.cursors.left.isDown) {
      this.nave.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.nave.x += 5;
    }
    //Para que no se salga de la pantalla
    if (this.nave.x < this.nave.width / 2) {
      this.nave.x = this.nave.width / 2;
    } else if (this.nave.x > this.scale.width - this.nave.width / 2) {
      this.nave.x = this.scale.width - this.nave.width / 2;
    }
    //Lo gestiono como grupo, ya que al eliminar varios sin grupo, se rompe el juego.
    let meteoritosAEliminar = [];

    //Eliminamos los meteoritos que se salen de la pantalla. No queremos que se acumulen.
    this.meteoritos.children.iterate((meteorito) => {
      meteorito.y += meteorito.speed;

      if (meteorito.y > this.scale.height) {
        meteoritosAEliminar.push(meteorito);
      }
    });

    meteoritosAEliminar.forEach((meteorito) => meteorito.destroy());

    //Este es el disparo de la nave.
    this.balas.children.iterate((bala) => {
      if (!bala.visible) {
        bala.x = this.nave.x;
      }
    });
    //funcionamiento del espacio (Tecla)
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.addBala();
      //Sonido de disparo

      this.sound.play("disparo");
      //Donde salen las balas y la velocidad de las mismas.
      this.balas.children.iterate((bala) => {
        if (!bala.visible) {
          bala.setVisible(true);
          bala.setVelocityY(-300);
          return false;
        }
      });
    }
  }
  // Cambia a la escena de Game Over
  showGameOver() {
    this.scene.start("gameover");
  }
  // Cambia a la escena de victoria
  showCongratulations() {
    this.scene.start("congratulations", { nextScene: "gameDos" });
  }
}
