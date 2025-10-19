// Max-OS Fenster Signature
new Fenster(150, 150, 200, 100, "Title", "normal", {
	render: (fenster, ctx, width, height, isChanged) => {
		ctx.clearRect(0, 0, width, height);
		
		setColor(125, 125, 125, ctx);
		ctx.fillRect(0, 0, width, height);
	},
	update: (fenster, mode, width, height) => {
		switch (mode) {
			case 1:
				console.log("In Click");
				break;
			case 2:
				console.log("Window Move");
				break;
			case 3:
				console.log("Close");
				break;
			case 4:
				console.log("Window Resize");
				break;
			case 5:
				console.log("In Move");
				break;
			case 6:
				console.log("Update");
				break;
			default:
				console.warn("Unknown update mode: " + mode);
				break;
		}
	}
});