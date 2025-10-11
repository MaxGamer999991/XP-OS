const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
ctx.imageSmoothingEnabled = true;

function resize() {
	const multi = Math.min(
		(window.innerWidth / canvas.width),
		(window.innerHeight / canvas.height)
	);
	canvas.style.width = (canvas.width * multi) + "px";
	canvas.style.height = (canvas.height * multi) + "px";
}
resize();
window.addEventListener("resize", resize);

ctx.fillStyle = "rgba(41, 41, 41, 1)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let render_i = 0; // Fenster Index
let fensters = []; // Fenster Array
class Fenster {
	constructor(x, y, width, height, title = "Fenster", type = "normal") {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fullscreen = false;
		this.title = title;
		this.type = type;
		this.mouse = {
			down: false,
			x: 0,
			y: 0
		}
		fensters.push(this);
	}
	render() {
		const prevX = (this.fullscreen ? 0 : this.x) + (this.mouse.down ? mouse.dx : 0);
		const prevY = (this.fullscreen ? 0 : this.y) + (this.mouse.down ? mouse.dy : 0);
		const prevWidth = this.fullscreen ? canvas.width : this.width;
		const prevHeight = this.fullscreen ? canvas.height : this.height;

		setColor(0, 0, 0);
		ctx.fillRect(
			prevX - 1, prevY - 1,
			prevWidth + 2, prevHeight + 2
		);
		setColor(100, 100, 100);
		ctx.fillRect(
			prevX, prevY,
			prevWidth, prevHeight
		);

		setColor(125, 125, 125);
		ctx.fillRect(
			prevX + 2, prevY + 2,
			prevWidth - 4, 12
		);

		setColor(150, 150, 150);
		ctx.fillRect(
			prevX + prevWidth - 12,
			prevY + 3,
			10, 10
		);
		ctx.fillRect(
			prevX + prevWidth - 22,
			prevY + 3,
			10, 10
		);
		ctx.fillRect(
			prevX + prevWidth - 34,
			prevY + 3,
			10, 10
		);

		ctx.drawImage(
			getAsset("win_close").img,
			prevX + prevWidth - 11,
			prevY + 4,
			8, 8
		);
		ctx.drawImage(
			getAsset("win_max").img,
			prevX + prevWidth - 21,
			prevY + 4,
			8, 8
		);
		ctx.drawImage(
			getAsset("win_min").img,
			prevX + prevWidth - 33,
			prevY + 4,
			8, 8
		);

		setColor(0, 0, 0);
		setSize(10);
		ctx.fillText(
			this.title,
			prevX + 4,
			prevY + 12
		);

	}
	update() {
		if (this.mouse.down) {
			this.x = mouse.x - this.mouse.x;
			this.y = mouse.y - this.mouse.y;
		}
	}
	front() {
		const index = fensters.indexOf(this);
		if (index != -1) {
			fensters.splice(index, 1);
			fensters.push(this);
		}
	}
	close() {
		fensters = fensters.filter(f => f != this);
	}
}
async function render() {
	const sttime = performance.now();
	const stti = render_i;
	for (let i = 0; i < fensters.length; i++) {
		fensters[render_i].render();

		render_i = (render_i + 1) % fensters.length;
		if (performance.now() - sttime >= (1000 / 60)) {
			break;
		}
		if (render_i == stti - 1) {
			break;
		}
	}

	setColor(0, 0, 0);
	ctx.fillRect(0, canvas.height - 20, 20, 20);
	setColor(255, 255, 255);
	setSize(15);
	ctx.fillText("+", 7, canvas.height - 6);
}

let mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0
};
async function update() {
	for (let i = 0; i < fensters.length; i++) {
		fensters[i].update();
	}
}
function fenstersinit() {
	function mousedown(e) {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) * (canvas.width / rect.width);
		const y = (e.clientY - rect.top) * (canvas.height / rect.height);

		for (let i = fensters.length - 1; i >= 0; i--) {
			const f = fensters[i];
			const prevX = f.fullscreen ? 0 : f.x;
			const prevY = f.fullscreen ? 0 : f.y;
			const prevWidth = f.fullscreen ? canvas.width : f.width;
			const prevHeight = f.fullscreen ? canvas.height : f.height;

			if (
				x >= prevX + prevWidth - 12 &&
				x <= prevX + prevWidth - 2 &&
				y >= prevY + 3 &&
				y <= prevY + 12
			) {
				f.close();
				return;
			}
			
			if (
				x >= prevX && x <= prevX + prevWidth &&
				y >= prevY && y <= prevY + prevHeight
			) {
				f.front();
				if (
					x >= prevX + prevWidth - 22 &&
					x <= prevX + prevWidth - 12 &&
					y >= prevY + 3 &&
					y <= prevY + 12
				) {
					f.fullscreen = !f.fullscreen;
					return;
				}
				if (
					x >= prevX && x <= prevX + prevWidth &&
					y >= prevY && y <= prevY + 16
				) {
					f.mouse.down = true;
					if (f.fullscreen) {
						f.mouse.x = (f.width / 2);
						f.mouse.y = 7;
					} else {
						f.mouse.x = x - prevX;
						f.mouse.y = y - prevY;
					}
					f.fullscreen = false;
				}
				return;
			}
		}

		if (
			x < 20 &&
			y > canvas.height - 20
		) {
			new Fenster(50, 50, 200, 100, "Neues Fenster " + (fensters.length + 1));
		}
	}
	function mousemove(e) {
		mouse.dx = e.movementX * (canvas.width / canvas.clientWidth);
		mouse.dy = e.movementY * (canvas.height / canvas.clientHeight);
		mouse.x = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.clientWidth);
		mouse.y = (e.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.clientHeight);

		if (!e.buttons) {
			mouseup(e);
		}
	}
	function mouseup(e) {
		for (let i = 0; i < fensters.length; i++) {
			fensters[i].mouse.down = false;
		}
	}
	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
}

function setColor(r, g, b) {
	const i = 256 / 12;
	r = Math.min(Math.max(r, 0), 255);
	g = Math.min(Math.max(g, 0), 255);
	b = Math.min(Math.max(b, 0), 255);
	ctx.fillStyle = "rgb(" +
		(Math.floor(r / i) * i) + "," +
		(Math.floor(g / i) * i) + "," +
		(Math.floor(b / i) * i) + ")";
}
function setSize(size) {
	ctx.font = size + "px monospace";
}
const assets = [];
class Asset {
	constructor(path, name) {
		this.path = path;
		this.name = name || path;
		this.img = new Image();
		this.img.src = path;
		assets.push(this);
	}
	isLoaded() {
		if (this.img.complete) {
			return this.img.naturalWidth != 0;
		}
		return false;
	}
	iferror() {
		
	}
}
function getAsset(name) {
	return assets.find(a => a.name == name);
}
async function main() {
	let start = performance.now();
	new Asset("./Maximiren.png", "win_max");
	new Asset("./Minimiren.png", "win_min");
	new Asset("./Schlissen.png", "win_close");
	while (
		performance.now() - start < 2000 ||
		assets.reduce((a, b) => a || !b.isLoaded(), 0)
	) {
		setColor(0, 0, 0);
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const i = (performance.now() - start) / 2000 * 255;
		setColor(i, i, i);
		setSize(25);
		let textWidth = ctx.measureText("Max-OS");
		ctx.fillText("Max-OS",
			(canvas.width / 2) - (textWidth.width / 2),
			(canvas.height * 0.35)
		);

		setColor(50, 50, 50);
		setSize(10);
		let text = (
			assets.reduce((a, b) => a + (b.isLoaded() ? 1 : 0), 0)
		) + " / " + assets.length + " Assets geladen";
		ctx.fillText(
			text,
			0, 10
		);
		if (performance.now() - start > 2000) {
			setColor(150, 150, 150);
			setSize(12);
			let textWidth2 = ctx.measureText(text);
			ctx.fillText(
				text,
				(canvas.width / 2) - (textWidth2.width / 2),
				(canvas.height * 0.5)
			);
		}
		if (performance.now() - start > 12000) {
			location.reload();
			return;
		}

		await new Promise(requestAnimationFrame);
	}
	await new Promise(r => setTimeout(r, 2000));
	fenstersinit();

	new Fenster(50, 50, 200, 100, "Testfenster 1");
	new Fenster(150, 150, 200, 100, "Testfenster 2");

	let x = 0;
	let y = 0;
	let time = 0;
	let frame = 0;
	while (true) {
		while (true && render_i == 0) {
			setColor(
				(x + (performance.now() / 25)) % 256,
				(y + (performance.now() / 100)) % 256,
				0
			);
			ctx.fillRect(x, y, 8, 8);

			x += 8;
			if (x >= canvas.width) {
				x = 0;
				y += 8;
				if (y >= canvas.height) {
					y = 0;
					break;
				}
			}
		}
		let performe = performance.now();
		let dif = performe - time;

		frame = ((frame * dif) + (1000 / dif)) / (dif + 1);
		time = performe;

		setSize(10);
		setColor(0, 0, 0);
		ctx.fillRect(9, 9, 55, 13);
		setColor(255, 255, 255);
		ctx.fillText("FPS: " + Math.round(frame), 10, 20);
	
		await update();
		await render();

		mouse.dx = 0;
		mouse.dy = 0;

		// sim Lag
		// await new Promise(r => setTimeout(r, (1000 / (Math.random() * 30 + 15))));

		await new Promise(requestAnimationFrame);
	}
}
main();