import { Player } from './Player.js';
import { specialTiles } from './map.js';

export class Game {
	constructor() {
		this.players = [];
		this.currentTurn = 0;
		this.goal = 50;
		this.gameOver = false;
		this.specialTiles = specialTiles;
	}

	addPlayer(input) {
		const name = input.charAt(0).toUpperCase() + input.slice(1);
		this.players.push(new Player(name));
	}

	getCurrentPlayer() {
		return this.players[this.currentTurn];
	}

	nextTurn() {
		this.currentTurn = (this.currentTurn + 1) % this.players.length;
	}

	updateInfo() {
		let info = '<ul>';
		this.players.forEach((player, index) => {
			const isCurrent = index === this.currentTurn && !this.gameOver;
			const isWinner = this.gameOver && player.position >= this.goal;

			const prefix = isWinner ? '👑 ' : isCurrent ? '👉 ' : '';
			const className = isCurrent ? 'jugador-actual' : isWinner ? 'jugador-ganador' : '';

			info += `<li class="${className}">${prefix}${player.name}: Casilla ${player.position}</li>`;
		});

		info += '</ul>';

		document.getElementById('infoJuego').innerHTML = info;
	}


	async playTurn() {
		if (this.gameOver) return;

		const player = this.getCurrentPlayer();
		const roll = player.rollDice();
		player.move(roll);

		await Swal.fire({
			title: `${player.name} ha tirado el dado`,
			text: `Sacó un ${roll}. Nueva posición: ${player.position}`,
			imageUrl: "media/img/dice/dice" + roll + ".png",
			imageWidth: 100,
			imageHeight: 100
		});

		// Verifica si ya ganó tras moverse con el dado
		if (player.position >= this.goal) {
			// player.position = this.goal;
			this.gameOver = true;

			await Swal.fire({
				title: `🎉 ¡${player.name} ha ganado!`,
				text: `Llegó a la casilla ${this.goal}.`,
				icon: 'success',
				allowOutsideClick: false,
				allowEscapeKey: false,
				showConfirmButton: false,
				timer: 10000,
				timerProgressBar: true
			});

			document.getElementById('tirarDado').disabled = true;
			this.updateInfo();
			return; // Muy importante: termina aquí si ya ganó
		}

		const special = this.specialTiles[player.position];

		if (special) {

			if (special.sound) {
				const audio = new Audio("media/audio/" + special.sound);
				audio.play().catch((error) => {
					console.log("No se pudo reproducir audio.", error);
				});
			}

			await Swal.fire({
				title: `Casilla ${player.position}`,
				text: special.message ? special.message : '',
				imageUrl: special.image ? "media/img/" + special.image + ".png" : undefined,
				imageWidth: 400,
				imageHeight: 200
			});

			if (special.effect) {
				player.move(special.effect);

				// Lógica de límites
				if (player.position < 1) player.position = 1;
				if (player.position > this.goal) player.position = this.goal;
			}
		}

		this.nextTurn();
		this.updateInfo();
	}
}
