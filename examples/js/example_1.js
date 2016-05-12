var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('window', 'assets/window.9.png');
}
function create() {
	game.stage.backgroundColor = "#cccccc";
	game.add.text(game.world.width*0.01, game.world.height*0.01, "Original image (scale x4)", { font: "16px Arial", fill: "#333333" });
	game.add.text(game.world.width*0.51, game.world.height*0.01, "Nine Patch image (stretch center)", { font: "16px Arial", fill: "#333333" });

	var original_image = game.add.image(game.world.width*0.25, game.world.centerY, 'window');
	original_image.anchor.set(0.5);
	original_image.scale.set(4);

	// Create nine-patch image. Arguments: x-coordinate, y-coordinate, width, height, key
	var nine_patch_image = game.add.ninePatchImage(game.world.width*0.51, game.world.height*0.05, game.world.width*0.45, game.world.height*0.9, 'window');

	// Nine-patch image may contain a parameter paddingBox
	game.add.text(nine_patch_image.x + nine_patch_image.paddingBox.x, nine_patch_image.y + nine_patch_image.paddingBox.y, "This demonstration of the nine-patch image with stretchable center", { font: "12px Arial", fill: "#ffffff", align: 'center', wordWrap: true, wordWrapWidth: nine_patch_image.paddingBox.width });
}