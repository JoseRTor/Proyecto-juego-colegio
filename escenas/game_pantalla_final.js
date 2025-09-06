import { Scoreboard } from "../componentes/Scoreboard.js";
import { Vidas } from "../componentes/Vidas.js";
import { Lives } from "../componentes/Lives.js";

export class GameFinal extends Phaser.Scene {
  constructor() {
    super({ key: "gameFinal" });
  }

  init() {
    this.scoreboard = new Scoreboard(this);
    this.vidas = new Vidas(this);
  }

  preload() {
    this.load.audio("finalSong", "../audio/finalSong.mp3");
    this.load.image("gameFinalbackground", "../imagenes/mundoFinal.png");
    this.load.image("nave", "../imagenes/nave.png");
    this.load.image("bala", "../imagenes/disparo.png");
    this.load.image("meteorito1", "../imagenes/meteorito1.png");
    this.load.image("meteorito2", "../imagenes/meteorito2.png");
    this.load.image("meteorito3", "../imagenes/meteorito3.png");
    this.load.image("jefe", "../imagenes/malomaloso.png");
    this.load.image("laser", "../imagenes/rayo.png");
    this.load.audio("explosion", "../audio/explosion.mp3");
    this.load.audio("disparo", "../audio/laserShot.mp3");
    this.load.audio("daño", "../audio/muerteJefe.mp3");
    this.load.audio("laserEnemigo", "../audio/laserEnemigo.mp3");
    this.lives = new Lives(this, 680, 50);
    this.lives.preload();
  }

  create() {
    this.physics.world.setBoundsCollision(false, false, false, false);

    const background = this.add
      .image(0, 0, "gameFinalbackground")
      .setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;
    this.lives.create();

    this.music = this.sound.add("finalSong", { loop: true }, { volume: 0.03 });
    this.music.play();

    this.scoreboard.create();
    this.vidas.create();

    this.nave = this.physics.add.image(400, 460, "nave").setImmovable();
    this.nave.body.allowGravity = false;

    this.balas = this.physics.add.group();
    this.meteoritos = this.physics.add.group();
    //Añadimos el grupo de los lasers
    this.lasers = this.physics.add.group();
    //Inicializamos el jefe del juego, definiendo una salud inicial.
    //Si el jefe es muy difícil, baja la salud inicial para ver la escena final.
    this.jefe = this.physics.add.sprite(400, 100, "jefe").setImmovable(true);
    this.jefe.setCollideWorldBounds(true);
    this.jefe.salud = 2000;
    // Salud inicial del jefe

    this.addBala();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.time.addEvent({
      delay: 1000,
      callback: this.addMeteorito,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.addLaser,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(
      this.lasers,
      this.nave,
      this.impactoLaser,
      null,
      this
    );
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
    //Este es el collider del jefe. Me ha costado mucho hacer la parte del jefe.
    this.physics.add.collider(
      this.balas,
      this.jefe,
      this.impactoJefe,
      null,
      this
    );
  }

  addBala() {
    const bala = this.physics.add.image(this.nave.x, this.nave.y + 20, "bala");
    bala.setVisible(false);
    bala.setCollideWorldBounds(true);
    bala.setBounce(1, 0);
    this.balas.add(bala);
  }

  addMeteorito() {
    const x = Phaser.Math.Between(0, this.scale.width);
    const meteoritoKey = Phaser.Math.RND.pick([
      "meteorito1",
      "meteorito2",
      "meteorito3",
    ]);
    const meteorito = this.physics.add.image(x, 0, meteoritoKey);

    meteorito.speed = Phaser.Math.Between(7, 10);

    if (meteoritoKey === "meteorito1") {
      meteorito.impactosRestantes = 2;
    } else if (meteoritoKey === "meteorito2") {
      meteorito.impactosRestantes = 3;
    } else if (meteoritoKey === "meteorito3") {
      meteorito.impactosRestantes = 4;
    }

    this.meteoritos.add(meteorito);
  }
  //Añadí láseres enemigas, para aumentar la dificultad del juego.
  //Es exactamente igual que impactoMeteorito, pero con láseres.
  addLaser() {
    const x = Phaser.Math.Between(0, this.scale.width);
    this.sound.play("laserEnemigo");
    const laser = this.physics.add.image(x, 0, "laser");

    laser.speed = Phaser.Math.Between(10, 10);
    laser.setVelocityY(laser.speed * 50);

    this.lasers.add(laser);
  }
  //Igual que los meteoritos, pero con láseres.
  impactoLaser(nave, laser) {
    laser.destroy();
    nave.setTint(0xff0000);
    this.lives.decreaseLife();

    this.vidas.adiosVida(1);

    this.time.addEvent({
      delay: 100,
      callback: () => {
        nave.clearTint();
      },
      callbackScope: this,
      loop: false,
    });

    if (this.vidas.vidas <= 0) {
      this.showGameOver();
    }
  }

  impactoMeteorito(bala, meteorito) {
    meteorito.impactosRestantes -= 1;
    bala.destroy();
    if (meteorito.impactosRestantes === 0) {
      meteorito.destroy();
      this.sound.play("explosion");
      this.scoreboard.incrementPoints(0);
      if (this.scoreboard.score >= 10) {
        this.showCongratulations();
      }
    } else {
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
  // He estado un día entero sólo con este método. No me salía y no sabía por qué.
  // Al parecer, si cambiamos los parámetros que recibe, no obtiene un objeto jefe, sino uno bala.
  // Es decir, jefe.salud nunca existía porque no estaba recibiendo eso.
  //Al cambiar los parámetros, el método logró funcionar.
  //Ni chatGPT ha sido capaz de resolverlo. Me decía que lo tenía todo bien.
  impactoJefe(jefe, bala) {
    console.log("Salud del jefe antes de impacto:", jefe.salud);

    jefe.salud -= 10;
    console.log("Salud del jefe después del impacto:", jefe.salud);

    bala.destroy();
    this.sound.play("daño");
    jefe.setTint(0xff0000);

    this.time.addEvent({
      delay: 100,
      callback: () => {
        jefe.clearTint();
      },
      callbackScope: this,
      loop: false,
    });

    if (jefe.salud <= 0) {
      jefe.destroy();
      this.music.stop();
      //Sólo ganaremos cuando derrotemos al jefe. Aquí no hay score por matar meteoritos.

      this.showCongratulations();
    }
  }

  colisionNaveMeteorito(nave, meteorito) {
    this.sound.play("getDaño");
    nave.setTint(0xff0000);
    this.physics.pause();
    this.lives.decreaseLife();

    this.vidas.adiosVida(1);
    if (this.vidas.vidas > 0) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          nave.clearTint();
          this.physics.resume();
        },
        callbackScope: this,
      });
    } else {
      this.showGameOver();
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.nave.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.nave.x += 5;
    }
    if (this.nave.x < this.nave.width / 2) {
      this.nave.x = this.nave.width / 2;
    } else if (this.nave.x > this.scale.width - this.nave.width / 2) {
      this.nave.x = this.scale.width - this.nave.width / 2;
    }
    let meteoritosAEliminar = [];
    //He añadido láseres para hacer la escena más difícil.
    let lasersAEliminar = [];

    this.meteoritos.children.iterate((meteorito) => {
      meteorito.y += meteorito.speed;

      if (meteorito.y > this.scale.height) {
        meteoritosAEliminar.push(meteorito);
      }
    });
    //Es exactamente igual que los meteoritos. Si un método me funcionó...
    this.lasers.children.iterate((laser) => {
      laser.y += laser.speed;

      if (laser.y > this.scale.height) {
        lasersAEliminar.push(laser);
      }
    });

    meteoritosAEliminar.forEach((meteorito) => meteorito.destroy());
    lasersAEliminar.forEach((laser) => laser.destroy());

    this.balas.children.iterate((bala) => {
      if (!bala.visible) {
        bala.x = this.nave.x;
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.addBala();
      this.sound.play("disparo");
      this.balas.children.iterate((bala) => {
        if (!bala.visible) {
          bala.setVisible(true);
          bala.setVelocityY(-300);
          return false;
        }
      });
    }
  }

  showGameOver() {
    this.music.stop();

    this.scene.start("gameover");
  }

  showCongratulations() {
    this.scene.start("final", { nextScene: "game" });
  }
}
