// Max-OS Fenster Signature
new Fenster(150, 150, 200, 100, "Taskmanager", "normal", {
	render: (fenster, ctx, width, height, isChanged) => {
		ctx.clearRect(0, 0, width, height);

		setColor(125, 125, 125, ctx);
		setSize(10, ctx);
		ctx.fillRect(0, 0, ctx.measureText("Prozesse", 10).width + 6, 14);
		ctx.fillRect(ctx.measureText("Prozesse", 10).width + 8, 0, ctx.measureText("Cache", 10).width + 6, 14);

		setColor(0, 0, 0, ctx);
		ctx.fillText("Prozesse", 2, 10);
		ctx.fillText("Cache", ctx.measureText("Prozesse", 10).width + 8 + 2, 10);


		setColor(125, 125, 125, ctx);
		ctx.fillRect(0, 16, width, height - 16);

		setSize(10, ctx);
		let height2 = 0;
		let list = [];
		switch (fenster.var.tab) {
			case 0:
				for (let i = 0; i < fensters.length; i++) {
					let f = fensters[i];
					let mess = ctx.measureText(f.title, 10);
					if (list.find(e => e.title.title == f.title)) {
						list.find(e => e.title.title == f.title).num.num++;
						list.find(e => e.title.title == f.title).num.width = ctx.measureText(list.find(e => e.title.title == f.title).num.num.toString(), 10).width;
					} else {
						list.push({ num: { num: 1, width: ctx.measureText("1").width }, title: { title: f.title, width: mess.width } });
					}
				}
				const colNum = list.reduce((a, c) => Math.max(a, c.num.width), 0);
				const NumMax = list.reduce((a, c) => Math.max(a, c.num.num), 0);
				for (let i = list.length - 1; i >= 0; i--) {
					setColor(0, 0, 0, ctx);
					if (list[i].num.num > 1) {
						ctx.fillText(list[i].num.num + "x", 2, 26 + height2);
					}
					ctx.fillText(list[i].title.title, NumMax == 1 ? 2 : colNum + 12, 26 + height2);
					setColor(100, 100, 100, ctx);
					ctx.fillRect(2, 29 + height2, width - 4, 1);
					
					setColor(125, 125, 125, ctx);
					ctx.fillRect(
						width - ctx.measureText("Close", 10).width - 10 - ctx.measureText("Kill", 10).width - 11,
						height2 + 16,
						ctx.measureText("Kill", 10).width + 11 + ctx.measureText("Close", 10).width + 14,
						13
					);
					setColor(0, 0, 0, ctx);
					ctx.fillRect(width - ctx.measureText("Kill", 10).width - 9, height2 + 16, ctx.measureText("Kill", 10).width + 8, 13);
					ctx.fillRect(width - ctx.measureText("Close", 10).width - 10 - ctx.measureText("Kill", 10).width - 9, height2 + 16, ctx.measureText("Close", 10).width + 8, 13);
					
					setColor(125, 100, 100, ctx);
					ctx.fillRect(width - ctx.measureText("Kill", 10).width - 8, height2 + 17, ctx.measureText("Kill", 10).width + 6, 11);
					setColor(100, 100, 100, ctx);
					ctx.fillRect(width - ctx.measureText("Close", 10).width - 10 - ctx.measureText("Kill", 10).width - 8, height2 + 17, ctx.measureText("Close", 10).width + 6, 11);
					setColor(0, 0, 0, ctx);
					ctx.fillText("Kill", width - ctx.measureText("Kill", 10).width - 4, height2 + 26);
					ctx.fillText("Close", width - ctx.measureText("Close", 10).width - 10 - ctx.measureText("Kill", 10).width - 4, height2 + 26);

					height2 += 14;
				}
				break;
			case 1:
				for (let i = 0; i < assets.length; i++) {
					if (assets[i].type == "fenster") {
						list.push({ name: assets[i].name, path: assets[i].path, code: assets[i].code });
					}
				}
				let colWidth = list.reduce((a, c) => Math.max(a, ctx.measureText(c.name.split("/").pop(), 10).width), 0);
				for (let i = 0; i < list.length; i++) {
					setColor(
						list[i].code == 404 || !getAsset(list[i].name).src.startsWith("// Max-OS Fenster Signature") ? 100 : 0,
						list[i].code != 404 && !getAsset(list[i].name).src.startsWith("// Max-OS Fenster Signature") ? 100 : 0,
						0, ctx
					);
					ctx.fillText(list[i].name.split("/").pop(), 2, height2 + 26);
					ctx.fillText(list[i].path, colWidth + 12, height2 + 26);
					setColor(100, 100, 100, ctx);
					ctx.fillRect(2, height2 + 29, width - 4, 1);

					setColor(125, 125, 125, ctx);
					ctx.fillRect(
						width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 11,
						height2 + 16,
						ctx.measureText("Run", 10).width + 11 + ctx.measureText("Clear", 10).width + 14,
						13
					);
					setColor(0, 0, 0, ctx);
					if (list[i].code != 404) {
						ctx.fillRect(width - ctx.measureText("Run", 10).width - 9, height2 + 16, ctx.measureText("Run", 10).width + 8, 13);
					}
					ctx.fillRect(width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 9, height2 + 16, ctx.measureText("Clear", 10).width + 8, 13);

					if (list[i].code != 404) {
						setColor(getAsset(list[i].name).src.startsWith("// Max-OS Fenster Signature") ? 100 : 125, 125, 100, ctx);
						ctx.fillRect(width - ctx.measureText("Run", 10).width - 8, height2 + 17, ctx.measureText("Run", 10).width + 6, 11);
					}
					setColor(125, 100, 100, ctx);
					ctx.fillRect(width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 8, height2 + 17, ctx.measureText("Clear", 10).width + 6, 11);
					setColor(0, 0, 0, ctx);
					if (list[i].code != 404) {
						ctx.fillText("Run", width - ctx.measureText("Run", 10).width - 4, height2 + 26);
					}
					ctx.fillText("Clear", width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 4, height2 + 26);

					height2 += 14;
				}

				setColor(0, 0, 0, ctx);
				ctx.fillRect(1, height - 16 - 1, width - 2, 16);
				setColor(100, 100, 100, ctx);
				ctx.fillRect(2, height - 14 - 2, width - 4, 14);
				let num = fenster.var.text ? 0 : 50;
				let text = fenster.var.text.text || (fenster.var.text.select != -1 ? "" : "Loud Fenster");
				setColor(num, num, num, ctx);
				ctx.fillText(text, 4, height - 4);
				if (fenster.var.text.select >= 0 && performance.now() % 1000 < 500) {
					const before = text.slice(0, fenster.var.text.select);
					const mess = ctx.measureText(before, 10).width;
					setColor(0, 0, 0, ctx);
					ctx.fillText("|", mess + 1, height - 6);
				}
				break;
		}

	},
	update: (fenster, mode, width, height) => {
		switch (mode) {
			case 0:
				fenster.var.tab = 0;
				fenster.var.text = { text: "", select: -1 };
				break;
			case 1:
				const x = fenster.mouse.x;
				const y = fenster.mouse.y;

				if (inBox(0, 0, ctx.measureText("Prozesse", 10).width + 6, 14, true, { x, y })) {
					fenster.var.tab = 0;
				}
				if (inBox(ctx.measureText("Prozesse", 10).width + 8, 0, ctx.measureText("Cache", 10).width + 6, 14, true, { x, y })) {
					fenster.var.tab = 1;
				}

				switch (fenster.var.tab) {
					case 0:
						if (inBox(width - ctx.measureText("Close", 10).width - 10 - ctx.measureText("Kill", 10).width - 11, 16, ctx.measureText("Close", 10).width + 8, height - 16, true, { x, y })) {
							let index = fensters.length - 1 - Math.floor((y - 16) / 14);
							if (fensters[index]) {
								for (let i = 0; i < fensters.length; i++) {
									if (fensters[i].title == fensters[index].title) {
										fensters[i].close();
										break;
									}
								}
							}
						}
						if (inBox(width - ctx.measureText("Kill", 10).width - 9, 16, ctx.measureText("Kill", 10).width + 8, height - 16, true, { x, y })) {
							let index = fensters.length - 1 - Math.floor((y - 16) / 14);
							if (fensters[index]) {
								for (let i = 0; i < fensters.length; i++) {
									if (fensters[i].title == fensters[index].title) {
										if (["Taskmanager", "Background"].includes(fensters[i].title) ? fenster.var.war : true) {
											fensters.splice(i, 1);
											fenster.var.war = false;
										} else {
											fenster.var.war = true;
											new Fenster(200, 200, 200, 100, "System Error", "error", {}, "Möchten Sie den Prozess \"" + fensters[i].title + "\" wirklich beenden? Dies kann ungewollte System Fehler verursachen. Klicken Sie erneut auf 'Kill' um den Prozess zu beenden.");
										}
										break;
									}
								}
							}
						}
						break;
					case 1:
						if (inBox(2, height - 16, width - 4, 16, true, { x, y })) {
							let text = fenster.var.text.text || "";
							let select = 0;
							while (select < text.length && ctx.measureText(text.slice(0, select + 1), 10).width < x - 4) {
								select++;
							}
							fenster.var.text.select = select;
							break;
						} else {
							fenster.var.text.select = -1;
						}
						if (inBox(width - ctx.measureText("Run", 10).width - 9, 16, ctx.measureText("Run", 10).width + 8, height - 16, true, { x, y })) {
							let list = [];
							for (let i = 0; i < assets.length; i++) {
								if (assets[i].type == "fenster") {
									list.push({ name: assets[i].name, path: assets[i].path, code: assets[i].code });
								}
							}
							let index = Math.floor((y - 16) / 14);
							if (list[index] && list[index].code != 404) {
								openFenster(list[index].name, true).then(() => fenster.front());
							}
						}
						if (inBox(width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 9, 16, ctx.measureText("Clear", 10).width + 8, height - 16, true, { x, y })) {
							let list = [];
							for (let i = 0; i < assets.length; i++) {
								if (assets[i].type == "fenster") {
									list.push({ name: assets[i].name, path: assets[i].path });
								}
							}
							let index = Math.floor((y - 16) / 14);
							if (["task", "background"].includes(list[index].name)) return new Fenster(200, 200, 200, 100, "System Error", "error", {}, "Diese Fenster im Cache kann nicht geschlossen werden.");
							if (list[index]) {
								getAsset(list[index].name).clear();
							}
						}
						break;
				}

				break;
			case 3:
				if (!fenster.var.cwar && fensters.reduce((a, c) => a + (c.title == "Taskmanager" ? 1 : 0), 0) == 1) {
					openFenster("task").then(() => {
						fensters[fensters.length - 1].var.cwar = true;
						new Fenster(200, 200, 200, 100, "System Error", "error", {}, "Möchten Sie den Taskmanager wirklich beenden? Dies kann ungewollte System Fehler verursachen. Klicken Sie erneut auf Schließen um den Taskmanager zu beenden.");
					});
				}
				break;
			case 6:
				if (keyspressed.length > 0) {
					for (let k = 0; k < keyspressed.length; k++) {
						const key = keyspressed[k];
						if (key.code.startsWith("Key") || key.code.startsWith("Digit") || ["Period", "Space"].includes(key.code)) {
							if (fenster.var.text.select >= 0) {
								let char = key.key;
								char = keyspress.some(k => k.code.startsWith("Shift")) ? char.toUpperCase() : char.toLowerCase();
								fenster.var.text.text =
									fenster.var.text.text.slice(0, fenster.var.text.select) +
									char +
									fenster.var.text.text.slice(fenster.var.text.select);
								fenster.var.text.select++;
							}
						}
						switch (key.code) {
							case "Backspace":
								if (fenster.var.text.select > 0 && fenster.var.text.text && fenster.var.text.text.length > 0) {
									fenster.var.text.text =
										fenster.var.text.text.slice(0, fenster.var.text.select - 1) +
										fenster.var.text.text.slice(fenster.var.text.select);
									fenster.var.text.select--;
								}
								break;
							case "Delete":
								if (fenster.var.text.text && fenster.var.text.text.length > 0) {
									fenster.var.text.text =
										fenster.var.text.text.slice(0, fenster.var.text.select) +
										fenster.var.text.text.slice(fenster.var.text.select + 1);
								}
								break;
							case "ArrowLeft":
								fenster.var.text.select = Math.max(0, fenster.var.text.select - 1);
								break;
							case "ArrowRight":
								fenster.var.text.select = Math.min(fenster.var.text.text.length, fenster.var.text.select + 1);
								break;
							case "Enter":
								if (fenster.var.text.text && fenster.var.text.text.length > 0) {
									openFenster(fenster.var.text.text).then(() => fenster.front());
									fenster.var.text.text = "";
									fenster.var.text.select = -1;
								}
								break;
							default:
								break;
						}
					}
				}
			default:
				break;
		}
	}
});