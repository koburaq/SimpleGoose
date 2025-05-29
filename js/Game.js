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

	addPlayer(name) {
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
        const prefix = isCurrent ? '👉 ' : '';
        const className = isCurrent ? 'jugador-actual' : '';
        
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
			icon: 'info'
		});

		const special = this.specialTiles[player.position];
		if (special.sound) {
			const audio = new Audio("media/" + special.sound);
			audio.play();
		}
		await Swal.fire({
			title: `Casilla ${player.position}`,
			text: special.message,
			imageUrl: special.image ? "media/" + special.image : undefined,
			imageWidth: 400,
			imageHeight: 200
		});

		if (special.effect) {
			player.move(special.effect);
			if (player.position < 1) player.position = 1;
			if (player.position > this.goal) player.position = this.goal;
		}

		if (player.hasWon(this.goal)) {
			player.position = this.goal;
			this.gameOver = true;

			await Swal.fire({
				title: `🎉 ¡${player.name} ha ganado!`,
				text: `Llegó a la casilla ${this.goal}.`,
				icon: 'success'
			});

			document.getElementById('tirarDado').disabled = true;
		} else {
			this.nextTurn();
		}

		this.updateInfo();
	}
}
