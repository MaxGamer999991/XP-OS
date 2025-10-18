const resizeZone = 10;
const renderResizeZone = 8;
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
				y <= prevY + 12 &&
				f.showTitle
			) {
				f.close();
				return;
			}

			if (
				x >= prevX - resizeZone && x <= prevX + prevWidth + resizeZone &&
				y >= prevY - resizeZone && y <= prevY + prevHeight + resizeZone
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
							inResizeZone(f.x - resizeZone, f.y - resizeZone, resizeZone, resizeZone, "UL") ||
							inResizeZone(f.x + f.width, f.y - resizeZone, resizeZone, resizeZone, "UR") ||
							inResizeZone(f.x - resizeZone, f.y + f.height, resizeZone, resizeZone, "DL") ||
							inResizeZone(f.x + f.width, f.y + f.height, resizeZone, resizeZone, "DR")
						) || (
							inResizeZone(f.x, f.y - resizeZone, f.width, resizeZone, "U") ||
							inResizeZone(f.x, f.y + f.height, f.width, resizeZone, "D") ||
							inResizeZone(f.x - resizeZone, f.y, resizeZone, f.height, "L") ||
							inResizeZone(f.x + f.width, f.y, resizeZone, f.height, "R")
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

		if (!e.buttons)
			return mouseup(e);

		let cursor = "default";
		for (let i = fensters.length - 1; i >= 0; i--) {
			if (fensters[i].mouse.down) {
				fensters[i].fullscreen = false;
			}
			if (fensters[i].mouse.resize.down) {
				cursor = (
					((fensters[i].mouse.resize.dir == "UL" || fensters[i].mouse.resize.dir == "DR") ? "nwse-resize" : false) ||
					((fensters[i].mouse.resize.dir == "DL" || fensters[i].mouse.resize.dir == "UR") ? "nesw-resize" : false) ||
					((fensters[i].mouse.resize.dir == "U" || fensters[i].mouse.resize.dir == "D") ? "ns-resize" : false) ||
					((fensters[i].mouse.resize.dir == "L" || fensters[i].mouse.resize.dir == "R") ? "ew-resize" : false) ||
					"default"
				);
			}
			if (
				fensters[i].canResize &&
				!fensters[i].fullscreen &&
				(fensters[i].showBorder || fensters[i].showTitle)
			) {
				const f = fensters[i];
				function inBox(x, y, w, h) {
					return (
						mouse.x >= x &&
						mouse.x <= x + w &&
						mouse.y >= y &&
						mouse.y <= y + h
					);
				}

				if (
					inBox(f.x - renderResizeZone, f.y - renderResizeZone, renderResizeZone, renderResizeZone) ||
					inBox(f.x + f.width, f.y + f.height, renderResizeZone, renderResizeZone)
				) {
					cursor = "nwse-resize";
					break;
				}
				if (
					inBox(f.x + f.width, f.y - renderResizeZone, renderResizeZone, renderResizeZone) ||
					inBox(f.x - renderResizeZone, f.y + f.height, renderResizeZone, renderResizeZone)
				) {
					cursor = "nesw-resize";
					break;
				}
				if (
					inBox(f.x, f.y - renderResizeZone, f.width, renderResizeZone) ||
					inBox(f.x, f.y + f.height, f.width, renderResizeZone)
				) {
					cursor = "ns-resize";
					break;
				}
				if (
					inBox(f.x - renderResizeZone, f.y, renderResizeZone, f.height) ||
					inBox(f.x + f.width, f.y, renderResizeZone, f.height)
				) {
					cursor = "ew-resize";
					break;
				}
				if (
					inBox(f.x, f.y, f.width, f.height) ||
					f.mouse.down
				) {
					cursor = "default";
					break;
				}
			}
		}
		canvas.style.cursor = cursor;
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