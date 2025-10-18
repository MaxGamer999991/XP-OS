new Fenster(150, 150, 200, 100, "Title", "normal", {
	render: (fenster, ctx, width, height, isChanged) => {
		ctx.clearRect(0, 0, width, height);
		
		setColor(125, 125, 125, ctx);
		ctx.fillRect(0, 0, width, height);
	},
	update: (fenster, mode, width, height) => {
		// mode: 1 = in_click, 2 = win_move, 3 = close, 4 = win_resize, 5 = in_move

	}
});