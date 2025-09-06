import { Congratulations } from "./escenas/congratulations.js";
import { Gameover } from "./escenas/game-over.js";
import { Game } from "./escenas/game.js";
import { GameDos } from "./escenas/game_pantalla_segunda.js";
import { GameTres } from "./escenas/game_pantalla_tercera.js";
import { GameFinal } from "./escenas/game_pantalla_final.js";
import { CongratulationsDos } from "./escenas/congratulationsDos.js";
import { Final } from "./escenas/final.js";

const config = {
  type: Phaser.AUTO,
  parent: "contenedor-juego",
  width: 800,
  height: 500,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Game,
    GameDos,
    GameTres,
    GameFinal,
    Gameover,
    Congratulations,
    CongratulationsDos,
    Final,
  ],
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
};

new Phaser.Game(config);
