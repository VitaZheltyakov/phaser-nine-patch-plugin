var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('window', 'assets/splash.9.png');
}
function create() {
	game.stage.backgroundColor = "#cccccc";
	game.add.text(game.world.width*0.01, game.world.height*0.01, "Original image", { font: "16px Arial", fill: "#333333" });
	game.add.text(game.world.width*0.51, game.world.height*0.01, "Nine Patch image (stretch sides)", { font: "16px Arial", fill: "#333333" });

	var original_image = game.add.image(game.world.width*0.25, this.world.centerY, 'window');
	original_image.anchor.set(0.5);

	// Create nine-patch image. Arguments: x-coordinate, y-coordinate, width, height, key
	var nine_patch_image = game.add.ninePatchImage(game.world.width*0.75, this.world.centerY, game.world.width*0.45, game.world.height*0.9, 'window');
	nine_patch_image.anchor.set(0.5);
}