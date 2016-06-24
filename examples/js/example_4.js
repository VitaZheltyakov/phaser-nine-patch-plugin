var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('window', 'assets/window.9.png');
}
function create() {
	game.stage.backgroundColor = "#cccccc";
	game.add.text(game.world.width*0.01, game.world.height*0.01, "Nine Patch image", { font: "16px Arial", fill: "#333333" });
	game.add.text(game.world.width*0.51, game.world.height*0.01, "Image use Nine Patch image from PIXI.TextureCache", { font: "16px Arial", fill: "#333333" });

	// Create nine-patch image. Arguments: x-coordinate, y-coordinate, width, height, key, keyInCache
	game.add.ninePatchImage(game.world.width*0.01, game.world.height*0.05, game.world.width*0.45, game.world.height*0.9, 'window', 'window-npi');
	// Create image from PIXI.TextureCache
	game.add.image(game.world.width*0.51, game.world.height*0.05, PIXI.TextureCache['window-npi']);
}