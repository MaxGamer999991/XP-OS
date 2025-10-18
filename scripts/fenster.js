const fensters = [];
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
		this.doUpdate(0);
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
				getAsset("win_close").src,
				prevX + prevWidth - (this.showBorder ? 11 : 10),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.drawImage(
				getAsset("win_max").src,
				prevX + prevWidth - (this.showBorder ? 21 : 20),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.drawImage(
				getAsset("win_min").src,
				prevX + prevWidth - (this.showBorder ? 33 : 32),
				prevY + (this.showBorder ? 4 : 2),
				8, 8
			);
			ctx.imageSmoothingEnabled = false;

			setColor(this.type == "error" || this.type == "warning" ? 255 : 0, this.type == "warning" ? 255 : 0, 0);
			setSize(10);
			let title = this.type == "error" ? this.title.toUpperCase() : this.title;
			let width = 0;
			for (let i = 0; i < title.length; i++) {
				let mess = ctx.measureText(title[i]);
				if (width + mess.width < this.width - (this.showBorder ? 40 : 36) - ctx.measureText("...").width) {
					ctx.fillText(
						title[i],
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
		// mode: 0 = init, 1 = in_click, 2 = win_move, 3 = close, 4 = win_resize, 5 = in_move
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
		this.doUpdate(3);
		fensters.splice(fensters.indexOf(this), 1);
	}
}
function findFensterByTitle(title) {
	return fensters.find(f => f.title == title);
}