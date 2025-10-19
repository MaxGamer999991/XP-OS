// Max-OS Fenster Signature
new Fenster(150, 150, 200, 100, "DVD", "dvd", "normal", {
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