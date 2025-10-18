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
		switch (mode) {
			case 1:
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
				break;
			case 2:
				setColor(255, 255, 255, fenster.ctx);
				fenster.ctx.fillRect(0, 40, 50, 13);
				break;
			case 5:
				setColor(255, 0, 0, fenster.ctx);
				fenster.ctx.fillRect(fenster.mouse.x - 1, fenster.mouse.y - 1, 2, 2);
				break;
			default:
				break;
		}
	}
});