const mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0
};
function inBox(x, y, w, h, returns = true, pos = mouse) {
	if (
		pos.x >= x &&
		pos.x <= x + w &&
		pos.y >= y &&
		pos.y <= y + h
	) {
		return returns;
	} else return false;
}
function update() {
	fensters.forEach(f => f.update());

	mouse.dx = 0;
	mouse.dy = 0;

	keyspressed.length = 0;
}