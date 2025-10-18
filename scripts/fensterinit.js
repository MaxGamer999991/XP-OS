const resizeZone = 10;
const renderResizeZone = 8;
function fenstersinit() {
	function inBox(x, y, w, h, returns = true) {
		if (
			mouse.x >= x &&
			mouse.x <= x + w &&
			mouse.y >= y &&
			mouse.y <= y + h
		) {
			return returns;
		} else return false;
	}

	function mousedown(e) {
		const rect = canvas.getBoundingClientRect();
		mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
		mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);

		for (let i = fensters.length - 1; i >= 0; i--) {
			const f = fensters[i];
			const prevX = f.fullscreen ? 0 : f.x;
			const prevY = f.fullscreen ? 0 : f.y;
			const prevWidth = f.fullscreen ? canvas.width : f.width;
			const prevHeight = f.fullscreen ? canvas.height : f.height;

			// Check if in fenster
			if (
				inBox(prevX - resizeZone, prevY - resizeZone, prevWidth + (resizeZone * 2), prevHeight + (resizeZone * 2))
			) {
				f.front();
				// Title bar
				if (f.showTitle) {
					// Close button
					if (inBox(prevX + prevWidth - 12, prevY + 3, 10, 10)) {
						f.close();
						return;
					}
					// Maximize button
					if (inBox(prevX + prevWidth - 22, prevY + 3, 10, 10)) {
						f.fullscreen = !f.fullscreen;
						return;
					}
					// Title bar dragging
					if (inBox(prevX, prevY, prevWidth, 16)) {
						f.mouse.down = true;
						if (f.fullscreen) {
							f.mouse.x = (f.width / 2);
							f.mouse.y = 7;
						} else {
							f.mouse.x = mouse.x - prevX;
							f.mouse.y = mouse.y - prevY;
						}
						return;
					}
				}

				// Resize zones
				if (f.canResize && !f.fullscreen) {
					let mode = (
						(
							inBox(f.x - resizeZone, f.y - resizeZone, resizeZone, resizeZone, "UL") ||
							inBox(f.x + f.width, f.y - resizeZone, resizeZone, resizeZone, "UR") ||
							inBox(f.x - resizeZone, f.y + f.height, resizeZone, resizeZone, "DL") ||
							inBox(f.x + f.width, f.y + f.height, resizeZone, resizeZone, "DR")
						) || (
							inBox(f.x, f.y - resizeZone, f.width, resizeZone, "U") ||
							inBox(f.x, f.y + f.height, f.width, resizeZone, "D") ||
							inBox(f.x - resizeZone, f.y, resizeZone, f.height, "L") ||
							inBox(f.x + f.width, f.y, resizeZone, f.height, "R")
						)
					);
					if (mode) {
						f.mouse.resize.down = true;
						f.mouse.resize.dir = mode;
						f.mouse.resize.x = mouse.x;
						f.mouse.resize.y = mouse.y;
						f.mouse.resize.offsetX = mouse.x - prevX;
						f.mouse.resize.offsetY = mouse.y - prevY;
						f.mouse.resize.w = f.width;
						f.mouse.resize.h = f.height;
						return;
					}
				}

				f.mouse.x = mouse.x - prevX - (f.fullscreen && !f.showTitle ? 0 : 2);
				f.mouse.y = mouse.y - prevY - (f.showTitle ? 16 : (f.fullscreen ? 0 : 2));
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
		const rect = canvas.getBoundingClientRect();
		mouse.dx = e.movementX * (canvas.width / canvas.clientWidth);
		mouse.dy = e.movementY * (canvas.height / canvas.clientHeight);
		mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
		mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);

		if (!e.buttons)
			mouseup(e);

		let cursor = "default";
		for (let i = fensters.length - 1; i >= 0; i--) {
			const f = fensters[i];
			if (f.mouse.down) {
				f.fullscreen = false;
			}
			if (f.mouse.resize.down) {
				cursor = (
					((f.mouse.resize.dir == "UL" || f.mouse.resize.dir == "DR") ? "nwse-resize" : false) ||
					((f.mouse.resize.dir == "DL" || f.mouse.resize.dir == "UR") ? "nesw-resize" : false) ||
					((f.mouse.resize.dir == "U" || f.mouse.resize.dir == "D") ? "ns-resize" : false) ||
					((f.mouse.resize.dir == "L" || f.mouse.resize.dir == "R") ? "ew-resize" : false) ||
					"default"
				);
				break;
			}
			if (
				f.canResize &&
				!f.fullscreen &&
				(f.showBorder || f.showTitle)
			) {
				cursor = (
					(
						inBox(f.x - renderResizeZone, f.y - renderResizeZone, renderResizeZone, renderResizeZone, "nwse-resize") ||
						inBox(f.x + f.width, f.y + f.height, renderResizeZone, renderResizeZone, "nwse-resize")
					) ||
					(
						inBox(f.x + f.width, f.y - renderResizeZone, renderResizeZone, renderResizeZone, "nesw-resize") ||
						inBox(f.x - renderResizeZone, f.y + f.height, renderResizeZone, renderResizeZone, "nesw-resize")
					) ||
					(
						inBox(f.x, f.y - renderResizeZone, f.width, renderResizeZone, "ns-resize") ||
						inBox(f.x, f.y + f.height, f.width, renderResizeZone, "ns-resize")
					) ||
					(
						inBox(f.x - renderResizeZone, f.y, renderResizeZone, f.height, "ew-resize") ||
						inBox(f.x + f.width, f.y, renderResizeZone, f.height, "ew-resize")
					) ||
					(
						inBox(f.x, f.y, f.width, f.height, "default") ||
						(f.mouse.down ? "default" : false)
					) ||
					cursor
				);
				if (inBox(f.x, f.y, f.width, f.height) || f.mouse.down) {
					cursor = "default";
					break;
				}
				if (cursor != "default") break;
			}
			
			if ((inBox(f.x, f.y, f.width, f.height) || f.fullscreen) && e.buttons == 1) {
				f.mouse.x = mouse.x - (f.fullscreen ? 0 : f.x) - (f.fullscreen && !f.showTitle ? 0 : 2);
				f.mouse.y = mouse.y - (f.fullscreen ? 0 : f.y) - (f.showTitle ? 16 : (f.fullscreen ? 0 : 2));
				f.doUpdate(5);
			}

			if (f.fullscreen) {
				cursor = "default";
				break;
			}
		}
		canvas.style.cursor = cursor;
	}
	function mouseup(e) {
		for (let i = 0; i < fensters.length; i++) {
			fensters[i].mouse.down = false;
			fensters[i].mouse.resize.down = false;
			fensters[i].mouse.x = 0;
			fensters[i].mouse.y = 0;
		}
	}

	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
}