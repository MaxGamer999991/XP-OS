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
						list.push({ name: assets[i].name, path: assets[i].path });
					}
				}
				let colWidth = list.reduce((a, c) => Math.max(a, ctx.measureText(c.name, 10).width), 0);
				for (let i = 0; i < list.length; i++) {
					setColor(0, 0, 0, ctx);
					ctx.fillText(list[i].name, 2, height2 + 26);
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
					ctx.fillRect(width - ctx.measureText("Run", 10).width - 9, height2 + 16, ctx.measureText("Run", 10).width + 8, 13);
					ctx.fillRect(width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 9, height2 + 16, ctx.measureText("Clear", 10).width + 8, 13);

					setColor(100, 125, 100, ctx);
					ctx.fillRect(width - ctx.measureText("Run", 10).width - 8, height2 + 17, ctx.measureText("Run", 10).width + 6, 11);
					setColor(125, 100, 100, ctx);
					ctx.fillRect(width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 8, height2 + 17, ctx.measureText("Clear", 10).width + 6, 11);
					setColor(0, 0, 0, ctx);
					ctx.fillText("Run", width - ctx.measureText("Run", 10).width - 4, height2 + 26);
					ctx.fillText("Clear", width - ctx.measureText("Clear", 10).width - 10 - ctx.measureText("Run", 10).width - 4, height2 + 26);

					height2 += 14;
				}
				break;
		}
	},
	update: (fenster, mode, width, height) => {
		switch (mode) {
			case 0:
				fenster.var.tab = 0;
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
						if (inBox(width - ctx.measureText("Run", 10).width - 9, 16, ctx.measureText("Run", 10).width + 8, height - 16, true, { x, y })) {
							let list = [];
							for (let i = 0; i < assets.length; i++) {
								if (assets[i].type == "fenster") {
									list.push({ name: assets[i].name, path: assets[i].path });
								}
							}
							let index = Math.floor((y - 16) / 14);
							if (list[index]) {
								openFenster(list[index].name).then(() => fenster.front());
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
			default:
				break;
		}
	}
});