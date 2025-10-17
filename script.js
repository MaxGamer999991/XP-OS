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

let fensters = [];
class Fenster {
	constructor(x, y, width, height, title = "Fenster", type = "normal", code = { render: () => { }, update: () => { } }, content = null) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.fullscreen = false;
		this.title = title;
		this.type = type;
		this.showTitle = true;
		this.showBorder = true;
		this.canResize = true;
		this.code = code;
		this.var = {};
		this.content = content;

		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;

		this.mouse = {
			down: false,
			resize: {
				down: false,
				dir: "",
				x: 0,
				y: 0,
				offsetX: 0,
				offsetY: 0,
				w: 0,
				h: 0
			},
			x: 0,
			y: 0
		};
		if (!["normal", "warning", "error"].includes(type)) {
			throw new Error("Fenstertyp '" + type + "' nicht gefunden!");
		}

		fensters.push(this);
	}
	render() {
		if (this.type == "warning" || this.type == "error") {
			this.showTitle = true;
			this.showBorder = true;
			this.fullscreen = false;
		}

		const prevX = (this.fullscreen ? 0 : this.x) + (this.mouse.down ? mouse.dx : 0);
		const prevY = (this.fullscreen ? 0 : this.y) + (this.mouse.down ? mouse.dy : 0);
		const prevWidth = this.fullscreen ? canvas.width : this.width;
		const prevHeight = this.fullscreen ? canvas.height : this.height;
		const innerWidth = Math.floor(prevWidth - (this.fullscreen && !this.showTitle ? 0 : (this.showBorder ? 4 : 0)));
		const innerHeight = Math.floor(prevHeight - (this.showTitle ? (this.showBorder ? 18 : 12) : (this.fullscreen ? 0 : (this.showBorder ? 4 : 0))));

		if (
			this.canvas.width != innerWidth ||
			this.canvas.height != innerHeight
		) {
			this.canvas.width = innerWidth;
			this.canvas.height = innerHeight;
			if (this.code.render && this.type == "normal")
				this.code.render(this, this.ctx, innerWidth, innerHeight, true);
		} else {
			if (this.code.render && this.type == "normal")
				this.code.render(this, this.ctx, innerWidth, innerHeight, false);
		}

		if (this.showBorder) {
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
		}

		if (this.showTitle) {
			setColor(125, 125, 125);
			ctx.fillRect(
				prevX + (this.showBorder ? 2 : 0), prevY + (this.showBorder ? 2 : 0),
				prevWidth - (this.showBorder ? 4 : 0), 12
			);

			setColor(150, 150, 150);
			ctx.fillRect(
				prevX + prevWidth - (this.showBorder ? 12 : 11),
				prevY + (this.showBorder ? 3 : 1),
				10, 10
			);
			ctx.fillRect(
				prevX + prevWidth - (this.showBorder ? 22 : 21),
				prevY + (this.showBorder ? 3 : 1),
				10, 10
			);
			ctx.fillRect(
				prevX + prevWidth - (this.showBorder ? 34 : 33),
				prevY + (this.showBorder ? 3 : 1),
				10, 10
			);

			ctx.imageSmoothingEnabled = true;
			ctx.drawImage(
				getAsset("win_close").img,
				prevX + prevWidth - (this.showBorder ? 11 : 10),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.drawImage(
				getAsset("win_max").img,
				prevX + prevWidth - (this.showBorder ? 21 : 20),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.drawImage(
				getAsset("win_min").img,
				prevX + prevWidth - (this.showBorder ? 33 : 32),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.imageSmoothingEnabled = false;

			setColor(this.type == "error" || this.type == "warning" ? 255 : 0, this.type == "warning" ? 255 : 0, 0);
			setSize(10);
			if (this.type == "error" || this.type == "warning") {
				ctx.fillText(
					this.type.toUpperCase(),
					prevX + (this.showBorder ? 4 : 2),
					prevY + (this.showBorder ? 12 : 10)
				);
			} else {
				let width = 0;
				for (let i = 0; i < this.title.length; i++) {
					let mess = ctx.measureText(this.title[i]);
					if (width + mess.width < this.width - (this.showBorder ? 40 : 36) - ctx.measureText("...").width) {
						ctx.fillText(
							this.title[i],
							prevX + (this.showBorder ? 4 : 2) + width,
							prevY + (this.showBorder ? 12 : 10)
						);
						width += mess.width;
					} else {
						ctx.fillText(
							"...",
							prevX + this.width - (this.showBorder ? 37 : 33) - ctx.measureText("...").width,
							prevY + (this.showBorder ? 12 : 10)
						);
						break;
					}
				}
			}
		}

		if (this.type == "warning" || this.type == "error") {
			this.ctx.clearRect(0, 0, innerWidth, innerHeight);
			setColor(125, 125, 125, this.ctx);
			this.ctx.fillRect(0, 0, innerWidth, innerHeight);
			setColor(0, 0, 0, this.ctx);
			setSize(10, this.ctx);

			let x = 0;
			let y = 0;
			let i = 0;
			while (y < innerHeight && i < this.content.length) {
				while (x < innerWidth && i < this.content.length) {
					let mess = this.ctx.measureText(this.content[i]);
					if (x + mess.width > innerWidth || this.content[i] == "\n") {
						x = 0;
						y += 12;
						if (y >= innerHeight) break;
					}
					if (this.content[i] == "\n") i++;
					this.ctx.fillText(this.content[i], x, y + 10);
					x += mess.width;
					i++;
				}
			}

			setColor(0, 0, 0, this.ctx);
			this.ctx.fillRect(innerWidth - 55, innerHeight - 20, 50, 15);
			if (this.type == "error") {
				setColor(150, 50, 50, this.ctx);
			} else {
				setColor(100, 100, 100, this.ctx);
			}
			this.ctx.fillRect(innerWidth - 54, innerHeight - 19, 48, 13);
			setColor(0, 0, 0, this.ctx);
			setSize(10, this.ctx);
			this.ctx.fillText("OK", innerWidth - 36, innerHeight - 8);
		}
		ctx.drawImage(
			this.canvas,
			prevX + (this.fullscreen && !this.showTitle ? 0 : (this.showBorder ? 2 : 0)),
			prevY + (this.showTitle ? (this.showBorder ? 16 : 12) : (this.fullscreen ? 0 : (this.showBorder ? 2 : 0))),
			innerWidth,
			innerHeight
		);
	}
	update() {
		if (this.mouse.down) {
			this.x = mouse.x - this.mouse.x;
			this.y = mouse.y - this.mouse.y;
			this.doUpdate(2);
		}
		if (this.mouse.resize.down) {
			if (this.mouse.resize.dir.includes("U")) {
				this.y = Math.min(mouse.y - this.mouse.resize.offsetY, this.y + this.height - 20);
				this.height = Math.max(this.mouse.resize.h + (this.mouse.resize.y - mouse.y), 20);
			}
			if (this.mouse.resize.dir.includes("L")) {
				this.x = Math.min(mouse.x - this.mouse.resize.offsetX, this.x + this.width - 100);
				this.width = Math.max(this.mouse.resize.w + (this.mouse.resize.x - mouse.x), 100);
			}
			if (this.mouse.resize.dir.includes("D")) {
				this.height = Math.max(mouse.y - this.y, 20);
			}
			if (this.mouse.resize.dir.includes("R")) {
				this.width = Math.max(mouse.x - this.x, 100);
			}
			this.doUpdate(4);
		}

	}
	doUpdate(mode) {
		// mode: 1 = click, 2 = move, 3 = close of win types [error, warning], 4 = resize
		if (this.code.update && (this.type == "normal" || mode != 3))
			this.code.update(this, mode,
				(this.fullscreen ? canvas.width : this.width) - (this.fullscreen && !this.showTitle ? 0 : (this.showBorder ? 4 : 0)),
				(this.fullscreen ? canvas.height : this.height) - (this.showTitle ? (this.showBorder ? 18 : 12) : (this.fullscreen ? 0 : (this.showBorder ? 4 : 0)))
			);
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
function findFensterByTitle(title) {
	return fensters.find(f => f.title == title);
}
function render() {
	fensters.forEach(f => f.render());
}

let mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0
};
function update() {
	fensters.forEach(f => f.update());
}
function fenstersinit() {
	function mousedown(e) {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) * (canvas.width / rect.width);
		const y = (e.clientY - rect.top) * (canvas.height / rect.height);

		const radius = 10;
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
				y <= prevY + 12 &&
				f.showTitle
			) {
				f.close();
				return;
			}

			if (
				x >= prevX - radius && x <= prevX + prevWidth + radius &&
				y >= prevY - radius && y <= prevY + prevHeight + radius
			) {
				f.front();
				if (
					x >= prevX + prevWidth - 22 &&
					x <= prevX + prevWidth - 12 &&
					y >= prevY + 3 &&
					y <= prevY + 12 &&
					f.showTitle
				) {
					f.fullscreen = !f.fullscreen;
					return;
				}
				if (
					x >= prevX && x <= prevX + prevWidth &&
					y >= prevY && y <= prevY + 16 &&
					f.showTitle
				) {
					f.mouse.down = true;
					if (f.fullscreen) {
						f.mouse.x = (f.width / 2);
						f.mouse.y = 7;
					} else {
						f.mouse.x = x - prevX;
						f.mouse.y = y - prevY;
					}
					return;
				}

				if (f.canResize && !f.fullscreen) {
					function inResizeZone(xx, yy, w, h, mode) {
						if (
							x >= xx &&
							x <= xx + w &&
							y >= yy &&
							y <= yy + h
						) {
							return mode;
						} else {
							return false;
						}
					}

					let mode = (
						(
							inResizeZone(f.x - radius, f.y - radius, radius, radius, "UL") ||
							inResizeZone(f.x + f.width, f.y - radius, radius, radius, "UR") ||
							inResizeZone(f.x - radius, f.y + f.height, radius, radius, "DL") ||
							inResizeZone(f.x + f.width, f.y + f.height, radius, radius, "DR")
						) || (
							inResizeZone(f.x, f.y - radius, f.width, radius, "U") ||
							inResizeZone(f.x, f.y + f.height, f.width, radius, "D") ||
							inResizeZone(f.x - radius, f.y, radius, f.height, "L") ||
							inResizeZone(f.x + f.width, f.y, radius, f.height, "R")
						)
					);
					if (mode) {
						f.mouse.resize.down = true;
						f.mouse.resize.dir = mode;
						f.mouse.resize.x = x;
						f.mouse.resize.y = y;
						f.mouse.resize.offsetX = x - prevX;
						f.mouse.resize.offsetY = y - prevY;
						f.mouse.resize.w = f.width;
						f.mouse.resize.h = f.height;
						return;
					}
				}

				f.mouse.x = x - prevX - (f.fullscreen && !f.showTitle ? 0 : 2);
				f.mouse.y = y - prevY - (f.showTitle ? 16 : (f.fullscreen ? 0 : 2));
				f.doUpdate(1);
				if (f.type == "warning" || f.type == "error") {
					if (
						f.mouse.x >= f.canvas.width - 55 &&
						f.mouse.x <= f.canvas.width - 5 &&
						f.mouse.y >= f.canvas.height - 20 &&
						f.mouse.y <= f.canvas.height - 5
					) {
						f.doUpdate(3);
						f.close();
					}
				}
				return;
			}
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

		let cursor = "default";
		const radius = 8;
		for (let i = fensters.length - 1; i >= 0; i--) {
			if (fensters[i].mouse.down) {
				fensters[i].fullscreen = false;
			}
			if (fensters[i].mouse.resize.down) {
				cursor = (
					(fensters[i].mouse.resize.dir == "UL" || fensters[i].mouse.resize.dir == "DR") ? "nwse-resize" :
						(fensters[i].mouse.resize.dir == "DL" || fensters[i].mouse.resize.dir == "UR") ? "nesw-resize" :
							(fensters[i].mouse.resize.dir == "U" || fensters[i].mouse.resize.dir == "D") ? "ns-resize" :
								(fensters[i].mouse.resize.dir == "L" || fensters[i].mouse.resize.dir == "R") ? "ew-resize" :
									"default"
				);
			}
			if (
				fensters[i].canResize &&
				!fensters[i].fullscreen &&
				cursor == "default" &&
				(fensters[i].showBorder || fensters[i].showTitle)
			) {
				const f = fensters[i];
				function inResizeZone(x, y, w, h) {
					return (
						mouse.x >= x &&
						mouse.x <= x + w &&
						mouse.y >= y &&
						mouse.y <= y + h
					);
				}
				if (
					inResizeZone(f.x - radius, f.y - radius, radius, radius) ||
					inResizeZone(f.x + f.width, f.y + f.height, radius, radius)
				) {
					cursor = "nwse-resize";
					break;
				}
				if (
					inResizeZone(f.x + f.width, f.y - radius, radius, radius) ||
					inResizeZone(f.x - radius, f.y + f.height, radius, radius)
				) {
					cursor = "nesw-resize";
					break;
				}
				if (
					inResizeZone(f.x, f.y - radius, f.width, radius) ||
					inResizeZone(f.x, f.y + f.height, f.width, radius)
				) {
					cursor = "ns-resize";
					break;
				}
				if (
					inResizeZone(f.x - radius, f.y, radius, f.height) ||
					inResizeZone(f.x + f.width, f.y, radius, f.height)
				) {
					cursor = "ew-resize";
					break;
				}
				if (
					inResizeZone(f.x, f.y, f.width, f.height)
				) {
					cursor = "win";
					break;
				}
			}
		}
		canvas.style.cursor = cursor == "win" ? "default" : cursor;
	}
	function mouseup(e) {
		for (let i = 0; i < fensters.length; i++) {
			fensters[i].mouse.down = false;
			fensters[i].mouse.resize.down = false;
		}
	}
	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
}

function setColor(r, g, b, canvas = ctx) {
	const i = 256 / 12;
	r = Math.min(Math.max(r, 0), 255);
	g = Math.min(Math.max(g, 0), 255);
	b = Math.min(Math.max(b, 0), 255);
	canvas.fillStyle = "rgb(" +
		(Math.floor(r / i) * i) + "," +
		(Math.floor(g / i) * i) + "," +
		(Math.floor(b / i) * i) + ")";
}
function setSize(size, canvas = ctx) {
	canvas.font = size + "px monospace";
}
const assets = [];
class Asset {
	constructor(path, name) {
		this.path = path;
		this.name = name || path;
		this.img = new Image();
		this.img.src = path;
		this.hasError = false;
		this.img.addEventListener("error", () => this.hasError = true);
		assets.push(this);
	}
	isLoaded() {
		if (this.img.complete) {
			return this.img.naturalWidth != 0;
		}
		return false;
	}
	error() {
		if (this.hasError) {
			if (!this.timeout) this.timeout = performance.now();
			if (performance.now() - this.timeout > 5000) {
				this.img.src = this.path;
				this.timeout = false;
				return true;
			}
		}
		return false;
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
	new Asset("./Logo.png", "logo");
	let log = [];
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

		while (log.length > 15) log.shift();
		log.forEach((l, i) => {
			setColor(100, 100, 100);
			ctx.fillRect(0, canvas.height - ((i + 1) * 12), canvas.width, 12);
			setColor(255, 255, 255);
			setSize(10);
			ctx.fillText(l, 0, canvas.height - (i * 12) - 2);
		});
		assets.forEach(a => {
			if (a.error()) {
				log.push("Fehler beim Laden von Asset '" + a.name + "'!");
			}
		});

		await new Promise(requestAnimationFrame);
	}
	await new Promise(r => setTimeout(r, 2000));
	fenstersinit();

	new Fenster(50, 50, 200, 100, "Testfenster 1", "normal", {
		render: (fenster, ctx, width, height, isChanged) => {
			if (isChanged) {
				fenster.var.x = 0;
				fenster.var.y = 0;
				setColor(255, 255, 255, ctx);
				ctx.fillRect(0, 0, width, height);
			}

			const i = 10;
			setColor(
				Math.random() * 255,
				Math.random() * 255,
				Math.random() * 255,
				ctx
			);
			ctx.fillRect(
				fenster.var.x * (width / i),
				fenster.var.y * (height / i),
				(width / i),
				(height / i)
			);

			fenster.var.x = fenster.var.x + 1;
			if (fenster.var.x > i) {
				fenster.var.x = 0;
				fenster.var.y = fenster.var.y + 1;
				if (fenster.var.y > i) fenster.var.y = 0;
			}

			setColor(0, 0, 0, ctx);
			ctx.fillRect(0, 0, 16, 16);
			setSize(10, ctx);
			ctx.fillText("<- Toggle Title", 20, 12);
			ctx.fillRect(0, 20, 16, 16);
			ctx.fillText("<- Toggle Border", 20, 32);
			ctx.fillText(Math.floor(fenster.x) + " " + Math.floor(fenster.y), 1, 50);

			setColor(255, 0, 0, ctx);
			ctx.fillRect(width - 20, height - 20, 20, 20);
			setColor(0, 0, 0, ctx);
			ctx.fillText("E", width - 13, height - 6);

			setColor(255, 0, 0, ctx);
			ctx.fillRect(width - 20, height - 45, 20, 20);
			setColor(0, 0, 0, ctx);
			ctx.fillText("W", width - 13, height - 31);
		},
		update: (fenster, mode, width, height) => {
			if (mode == 1) {
				if (
					fenster.mouse.x < 16 &&
					fenster.mouse.y < 16
				) {
					fenster.showTitle = !fenster.showTitle;
				}

				if (
					fenster.mouse.x < 16 &&
					fenster.mouse.y > 20 &&
					fenster.mouse.y < 36
				) {
					fenster.showBorder = !fenster.showBorder;
				}

				if (
					fenster.mouse.x > width - 20 &&
					fenster.mouse.y > height - 20
				) {
					new Fenster(
						fenster.x + 25,
						fenster.y + 25,
						200, 100,
						"Error", "error",
						{},
						"Dies ist eine Fehlermeldung!\nBitte schließen Sie dieses Fenster."
					).front();
				}
				if (
					fenster.mouse.x > width - 20 &&
					fenster.mouse.y > height - 45 &&
					fenster.mouse.y < height - 25
				) {
					new Fenster(
						fenster.x + 25,
						fenster.y + 25,
						200, 100,
						"Warnung", "warning",
						{},
						"Dies ist eine Warnung!\nBitte schließen Sie dieses Fenster."
					).front();
				}

				setColor(0, 0, 0, fenster.ctx);
				fenster.ctx.fillRect(fenster.mouse.x - 2, fenster.mouse.y - 2, 4, 4);
			}
			if (mode == 2) {
				setColor(255, 255, 255, fenster.ctx);
				fenster.ctx.fillRect(0, 40, 50, 13);
			}
		}
	});
	new Fenster(150, 150, 200, 100, "Testfenster 2", "normal", {
		render: (fenster, ctx, width, height, isChanged) => {
			fenster.var.dx = (fenster.var.dx || -1);
			fenster.var.dy = (fenster.var.dy || 1);

			if (
				fenster.x < 0 ||
				fenster.x + fenster.width > canvas.width
			) fenster.var.dx *= -1;
			if (
				fenster.y < 0 ||
				fenster.y + fenster.height > canvas.height
			) fenster.var.dy *= -1;

			setColor(0, 0, 0, ctx);
			ctx.fillRect(0, 0, width, height);
			setSize(20, ctx);
			setColor(255, 255, 255, ctx);
			ctx.fillText("DVD", 10, 20);

			fenster.x += fenster.var.dx;
			fenster.y += fenster.var.dy;

			fenster.fullscreen = false;
			fenster.showTitle = false;
			fenster.showBorder = false;
			fenster.canResize = false;
		},
		update: (fenster, mode, width, height) => {

		}
	});
	new Fenster(300, 100, 200, 100, "Warnung", "warning", {}, "Dies ist eine Warnung!\nBitte schließen Sie dieses Fenster.");
	new Fenster(280, 250, 200, 100, "Error", "error", {}, "Dies ist eine Error!\nBitte schließen Sie dieses Fenster.");
	findFensterByTitle("Testfenster 1").front();

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

		update();
		render();

		mouse.dx = 0;
		mouse.dy = 0;

		let performe = performance.now();
		let dif = performe - time;
		frame = ((frame * dif) + (1000 / dif)) / (dif + 1);
		time = performe;

		setSize(10);
		setColor(0, 0, 0);
		ctx.fillRect(9, 9, 55, 13);
		setColor(255, 255, 255);
		ctx.fillText("FPS: " + Math.round(frame), 10, 20);

		await new Promise(requestAnimationFrame);
	}
}
main();