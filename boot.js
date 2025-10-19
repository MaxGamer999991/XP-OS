const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

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

const ColorSteps = 256 / 12;
function setColor(r, g, b, cctx = ctx) {
	r = Math.min(Math.max(r, 0), 255);
	g = Math.min(Math.max(g, 0), 255);
	b = Math.min(Math.max(b, 0), 255);
	cctx.fillStyle = "rgb(" +
		(Math.floor(r / ColorSteps) * ColorSteps) + "," +
		(Math.floor(g / ColorSteps) * ColorSteps) + "," +
		(Math.floor(b / ColorSteps) * ColorSteps) + ")";
}
function setSize(size, cctx = ctx) {
	cctx.font = size + "px monospace";
}

const assets = [];
class Asset {
	constructor(path, name, type) {
		this.path = path;
		this.name = name || path;

		if (!["img", "script", "fenster"].includes(type)) throw new Error("Unknown asset type: " + type);
		this.type = type;
		switch (type) {
			case "img":
				this.src = new Image();
				this.hasError = false;
				this.src.addEventListener("error", () => this.hasError = true);
				this.src.src = path;
				break;
			case "script":
				this.src = document.createElement("script");
				this.src.onerror = () => this.hasError = true;
				this.src.src = path;
				this.done = false;
				this.src.onload = () => this.done = true;
				document.body.appendChild(this.src);
				break;
			case "fenster":
				this.src = "";
				this.code = null;
				fetch(path)
					.then(r => {r.text().then(t => this.src = t); this.code = r.status;})
					.catch(() => this.hasError = true);
				break;
			default:
				break;
		}
		assets.push(this);
	}
	isLoaded() {
		switch (this.type) {
			case "img":
				if (this.src.complete) {
					return this.src.naturalWidth != 0;
				}
				return false;
			case "script":
				return this.done;
			case "fenster":
				return this.src != "";
			default:
				return false;
		}
	}
	error() {
		if (this.hasError) {

			if (!this.timeout) this.timeout = performance.now();
			if (performance.now() - this.timeout > 5000) {

				switch (this.type) {
					case "img":
						this.src.src = this.path;
						break;
					case "script":
						this.src.remove();
						this.src = document.createElement("script");
						this.src.onerror = () => this.hasError = true;
						this.src.src = this.path;
						this.done = false;
						this.src.onload = () => this.done = true;
						document.body.appendChild(this.src);
						break;
					case "fenster":
						fetch(this.path)
							.then(r => {r.text().then(t => this.src = t); this.code = r.status;})
							.catch(() => this.hasError = true);
						break;
					default:
						break;
				}
				this.timeout = false;
				return true;
			}
		}
		return false;
	}
	clear() {
		assets.splice(assets.indexOf(this), 1);
	}
}
function getAsset(name) {
	return assets.find(a => a.name == name) || assets.find(a => a.path == name);
}
async function openFenster(name, ignore = false) {
	const fensterAsset = getAsset(name);
	if (!fensterAsset) {
		let path = ((name.startsWith("./") || name.startsWith("../") || name.startsWith(":")) ? "" : "./fensters/") + (name.startsWith(":") ? name.slice(1) : name) + (name.endsWith(".js") ? "" : ".js");
		new Asset(path, name, "fenster");
	}
	await new Promise(r => {
		const check = setInterval(() => {
			const a = getAsset(name);
			if (!a) return;
			if (a.isLoaded()) {
				clearInterval(check);
				r();
			} else a.error();
		}, 100);
	});
	if (getAsset(name).code == 404) {
		return console.warn("Fenster '" + name + "' nicht gefunden!");
	}
	if (getAsset(name).src.startsWith("// Max-OS Fenster Signature") || ignore) {
		eval(getAsset(name).src);
	} else {
		return console.warn("Fenster '" + name + "' ist kein gültiges Max-OS Fenster!");
	}
}
async function boot() {
	let start = performance.now();
	let startt = start;

	new Asset("./scripts/fenster.js", "fenster.js", "script");
	new Asset("./scripts/fensterinit.js", "fensterinit.js", "script");
	new Asset("./scripts/render.js", "render.js", "script");
	new Asset("./scripts/update.js", "update.js", "script");
	new Asset("./scripts/main.js", "main.js", "script");

	new Asset("./img/Maximiren.png", "win_max", "img");
	new Asset("./img/Minimiren.png", "win_min", "img");
	new Asset("./img/Schlissen.png", "win_close", "img");
	new Asset("./img/Logo.png", "logo", "img");

	new Asset("./fensters/background.js", "background", "fenster");
	new Asset("./fensters/task.js", "task", "fenster");

	while (
		performance.now() - startt < 2000 ||
		assets.reduce((a, b) => a || !b.isLoaded(), false)
	) {
		setColor(0, 0, 0);
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const i = (performance.now() - start) / 2000 * 255;
		setColor(i, i, i);
		setSize(25);
		ctx.fillText("Max-OS",
			(canvas.width / 2) - (ctx.measureText("Max-OS").width / 2),
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

		assets.forEach(a => a.error());

		if (assets.reduce((a, b) => a || !b.isLoaded(), false)) {
			startt = performance.now();
		}
		await new Promise(requestAnimationFrame);
	}

	await main();
}
boot();