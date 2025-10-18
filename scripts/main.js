let DEBUG_FPS = true;
async function main() {

	fenstersinit();

	await openFenster("background");
	await openFenster("task");
	openFenster("DVD");
	openFenster("ERROR");
	openFenster("WARNING");
	openFenster("Demo");

	let frame = 0;
	let time = performance.now();
	while (true) {
		
		update();
		render();

		if (DEBUG_FPS) {
			let performe = performance.now();
			let dif = performe - time;
			frame = ((frame * dif) + (1000 / dif)) / (dif + 1);
			time = performe;

			if (frame == Infinity) frame = 0;

			setSize(10);
			setColor(0, 0, 0);
			ctx.fillRect(9, 9, 55, 13);
			setColor(255, 255, 255);
			ctx.fillText("FPS: " + Math.round(frame), 10, 20);
		}

		await new Promise(requestAnimationFrame);
	}
}