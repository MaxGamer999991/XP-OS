new Fenster(150, 150, 200, 100, "Background", "normal", {
	render: (fenster, ctx, width, height, isChanged) => {
		ctx.clearRect(0, 0, width, height);

		setColor(75, 75, 75, ctx);
		ctx.fillRect(0, 0, width, height);

		setSize(30, ctx);
		let num = performance.now() / 50;
		num = Math.floor(num) % 100;
		if (num > 50) num = 100 - num;
		num += Math.random() * 5;
		setColor(num, num, num, ctx);

		ctx.fillText(
			"Max-OS",
			(width / 2) - (ctx.measureText("Max-OS").width / 2),
			height / (3 / 1)
		);

		fenster.fullscreen = true;
		fenster.showTitle = false;
		fenster.showBorder = false;
		fenster.canResize = false;
	},
	update: (fenster, mode, width, height) => {
		if (mode == 1) {
			const i = fensters.indexOf(fenster);
			if (i > -1) {
				fensters.splice(i, 1);
				fensters.unshift(fenster);
			}
		}
	}
});