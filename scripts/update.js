const mouse = {
	x: 0,
	y: 0,
	dx: 0,
	dy: 0
};
function update() {
	fensters.forEach(f => f.update());

	mouse.dx = 0;
	mouse.dy = 0;
}