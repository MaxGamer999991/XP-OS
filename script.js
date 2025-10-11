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
		setColor(0, 0, 0);
		ctx.fillRect(
			this.x - 1, this.y - 1,
			this.width + 2, this.height + 2
		);
		setColor(100, 100, 100);
		ctx.fillRect(
			this.x, this.y,
			this.width, this.height
		);

		setColor(125, 125, 125);
		ctx.fillRect(
			this.x + 2, this.y + 2,
			this.width - 4, 12
		);

		setColor(150, 150, 150);
		ctx.fillRect(
			this.x + this.width - 12,
			this.y + 3,
			10, 10
		);
		ctx.fillRect(
			this.x + this.width - 22,
			this.y + 3,
			10, 10
		);
		ctx.fillRect(
			this.x + this.width - 34,
			this.y + 3,
			10, 10
		);

		ctx.drawImage(
			getAsset("win_close").img,
			this.x + this.width - 11,
			this.y + 4,
			8, 8
		);
		ctx.drawImage(
			getAsset("win_max").img,
			this.x + this.width - 21,
			this.y + 4,
			8, 8
		);
		ctx.drawImage(
			getAsset("win_min").img,
			this.x + this.width - 33,
			this.y + 4,
			8, 8
		);

		setColor(0, 0, 0);
		setSize(10);
		ctx.fillText(
			this.title,
			this.x + 4,
			this.y + 12
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
	for (let i = 0; i < fensters.length; i++) {
		fensters[render_i].render();

		render_i = (render_i + 1) % fensters.length;
		if (performance.now() - sttime >= (1000 / 60)) {
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

	mouse.dx = 0;
	mouse.dy = 0;
}
function fenstersinit() {
	canvas.addEventListener("mousedown", e => {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) * (canvas.width / rect.width);
		const y = (e.clientY - rect.top) * (canvas.height / rect.height);

		for (let i = fensters.length - 1; i >= 0; i--) {
			const f = fensters[i];
			if (
				x >= f.x + f.width - 12 &&
				x <= f.x + f.width - 2 &&
				y >= f.y + 3 &&
				y <= f.y + 12
			) {
				f.close();
				return;
			}
			if (
				x >= f.x && x <= f.x + f.width &&
				y >= f.y && y <= f.y + f.height
			) {
				f.front();
				if (
					x >= f.x && x <= f.x + f.width &&
					y >= f.y && y <= f.y + 16
				) {
					f.mouse.down = true;
					f.mouse.x = x - f.x;
					f.mouse.y = y - f.y;
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
	});
	canvas.addEventListener("mousemove", e => {
		mouse.dx = e.movementX * (canvas.width / canvas.clientWidth);
		mouse.dy = e.movementY * (canvas.height / canvas.clientHeight);
		mouse.x = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.clientWidth);
		mouse.y = (e.clientY - canvas.getBoundingClientRect().top) * (canvas.height / canvas.clientHeight);
	});
	canvas.addEventListener("mouseup", e => {
		for (let i = 0; i < fensters.length; i++) {
			fensters[i].mouse.down = false;
		}
	});
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
		while (true) {
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

		await new Promise(requestAnimationFrame);
	}
}
main();