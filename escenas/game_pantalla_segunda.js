import { Scoreboard } from "../componentes/Scoreboard.js";
import { Vidas } from "../componentes/Vidas.js";
import { Lives } from "../componentes/Lives.js";

export class GameDos extends Phaser.Scene {
  constructor() {
    super({ key: "gameDos" });
  }

  init() {
    this.scoreboard = new Scoreboard(this);
    this.vidas = new Vidas(this);
  }

  preload() {
    this.load.image("gameDosbackground", "../imagenes/mundo2.png");
    this.load.image("nave", "../imagenes/nave.png");
    this.load.image("bala", "../imagenes/disparo.png");
    this.load.image("meteorito1", "../imagenes/meteorito1.png");
    this.load.image("meteorito2", "../imagenes/meteorito2.png");
    this.load.image("meteorito3", "../imagenes/meteorito3.png");
    this.load.audio("themeSongLevelTwo", "../audio/themeSongLevelTwo.mp3");
    this.load.audio("explosion", "../audio/explosion.mp3");
    this.load.audio("disparo", "../audio/laserShot.mp3");
    this.lives = new Lives(this, 680, 50);
    this.lives.preload();
  }

  create() {
    this.physics.world.setBoundsCollision(false, false, false, false);

    const background = this.add
      .image(0, 0, "gameDosbackground")
      .setOrigin(0, 0);
    background.displayWidth = this.scale.width;
    background.displayHeight = this.scale.height;
    this.lives.create();

    this.music = this.sound.add(
      "themeSongLevelTwo",
      { loop: true },
      { volume: 0.03 }
    );
    this.music.play();

    this.scoreboard.create();
    this.vidas.create();

    this.nave = this.physics.add.image(400, 460, "nave").setImmovable();
    this.nave.body.allowGravity = false;

    this.balas = this.physics.add.group();

    this.meteoritos = this.physics.add.group();

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
    const meteorito = this.add.image(x, 0, meteoritoKey);

    meteorito.speed = Phaser.Math.Between(4, 7);
    //A parte de la música, lo unico que cambio aquí es la velocidad de los meteoritos, para que sea más dificil.

    if (meteoritoKey === "meteorito1") {
      meteorito.impactosRestantes = 2;
    } else if (meteoritoKey === "meteorito2") {
      meteorito.impactosRestantes = 3;
    } else if (meteoritoKey === "meteorito3") {
      meteorito.impactosRestantes = 4;
    }

    this.meteoritos.add(meteorito);
  }

  impactoMeteorito(bala, meteorito) {
    meteorito.impactosRestantes -= 1;
    bala.destroy();
    if (meteorito.impactosRestantes === 0) {
      this.sound.play("explosion");
      meteorito.destroy();
      this.scoreboard.incrementPoints(10);
      if (this.scoreboard.score >= 200) {
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

    this.meteoritos.children.iterate((meteorito) => {
      meteorito.y += meteorito.speed;

      if (meteorito.y > this.scale.height) {
        meteoritosAEliminar.push(meteorito);
      }
    });

    meteoritosAEliminar.forEach((meteorito) => meteorito.destroy());

    this.balas.children.iterate((bala) => {
      if (!bala.visible) {
        bala.x = this.nave.x;
      }
    });

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.sound.play("disparo");
      this.addBala();
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
    this.music.stop();
    this.scene.start("congratulations", { nextScene: "gameTres" });
  }
}
