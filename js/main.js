import { Game } from './Game.js';

const game = new Game();

async function iniciarJuego() {
  const { value: num } = await Swal.fire({
    title: '¿Cuántos jugadores?',
    input: 'number',
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputAttributes: { min: 2, max: 6, step: 1 },
    inputValidator: (value) => {
      if (!value) {
        return 'El campo no puede quedar vacío';
      }
      if (isNaN(value) || value <= 0) {
        return "Introduce un número válido mayor que cero";
      }
    }
  });

  if (num) {
    for (let i = 0; i < num; i++) {
      const { value: nombre } = await Swal.fire({
        title: `Nombre del jugador ${i + 1}`,
        input: 'text',
        inputValidator: (value) => !value ? 'El nombre es obligatorio' : undefined
      });

      game.addPlayer(nombre);
    }

    game.updateInfo();
    document.getElementById('tirarDado').disabled = false;
  }
}

document.getElementById('tirarDado').addEventListener('click', () => {
  game.playTurn();
});

iniciarJuego();
