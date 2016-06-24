/************ Nine patch plugin by Vitaliy Zheltyakov **************/
(function(window, Phaser) {
	'use strict';

	Phaser.NinePatchImage = function(game, x, y, width, height, key, keyInCache) {

		x = x || 0;
		y = y || 0;
		width = width || 0;
		height = height || 0;
		key = key || null;
		keyInCache = keyInCache || null;
		if ((width == 0) || (height == 0) || (key === null)) return game.add.image(x, y, PIXI.TextureCache['__missing']);

		// Because there is a problem of forced smoothing on mobile devices, introduce a special setting, indicating how the alpha channel count 100%
		var alphaSolid = 245;

		var buf = game.make.bitmapData();
		buf.smoothed = false;
		buf.load(key);


		// Get the original image size
		var imageIn = {
			width : buf.width,
			height : buf.height
		}
		// If the window size is too small, it will return an error-image
		if ((width < imageIn.width) || (height < imageIn.height)) return game.add.image(x, y, PIXI.TextureCache['__missing']);

		// Putting the image of the pieces
		// An array of cut points
		var cut = {};
		var cutPaddingBox = {};
		// Horizontal sections
		var segmentHorizontal = [];
		for (var i = 2; i < (imageIn.width - 1); i++) {
			if ((parseInt(buf.getPixelRGB(i, 0).a/alphaSolid) != parseInt(buf.getPixelRGB(i-1, 0).a/alphaSolid))&&(typeof cut.x1 === "undefined")) cut.x1 = i;
			else if ((parseInt(buf.getPixelRGB(i, 0).a/alphaSolid) != parseInt(buf.getPixelRGB(i-1, 0).a/alphaSolid))&&(typeof cut.x1 !== "undefined")) cut.x2 = i;
			if ((parseInt(buf.getPixelRGB(i, imageIn.height - 1).a/alphaSolid) != parseInt(buf.getPixelRGB(i-1, imageIn.height - 1).a/alphaSolid))&&(typeof cutPaddingBox.x1 === "undefined")) cutPaddingBox.x1 = i;
			else if ((parseInt(buf.getPixelRGB(i, imageIn.height - 1).a/alphaSolid) != parseInt(buf.getPixelRGB(i-1, imageIn.height - 1).a/alphaSolid))&&(typeof cutPaddingBox.x1 !== "undefined")) cutPaddingBox.x2 = i;
		}
		segmentHorizontal[0] = {};
		segmentHorizontal[0].x = 1;
		segmentHorizontal[0].xNew = 0;
		segmentHorizontal[0].width = cut.x1 - 1;
		segmentHorizontal[0].widthNew = segmentHorizontal[0].width;
		segmentHorizontal[0].type = (parseInt(buf.getPixelRGB(1, 0).a/alphaSolid)) ? 'stretch' : 'const';
		segmentHorizontal[1] = {};
		segmentHorizontal[1].x = cut.x1;
		segmentHorizontal[1].xNew = cut.x1 - 1;
		segmentHorizontal[1].width = cut.x2 - cut.x1 - 1;
		segmentHorizontal[1].widthNew = segmentHorizontal[1].width;
		segmentHorizontal[1].type = (parseInt(buf.getPixelRGB(cut.x1, 0).a/alphaSolid)) ? 'stretch' : 'const';
		segmentHorizontal[2] = {};
		segmentHorizontal[2].x = cut.x2;
		segmentHorizontal[2].xNew = cut.x2 - 1;
		segmentHorizontal[2].width = imageIn.width - cut.x2 - 1;
		segmentHorizontal[2].widthNew = segmentHorizontal[2].width;
		segmentHorizontal[2].type = (parseInt(buf.getPixelRGB(cut.x2, 0).a/alphaSolid)) ? 'stretch' : 'const';

		// The vertical sections
		var segmentVertical = [];
		for (var i = 2; i < (imageIn.height - 1); i++) {
			if ((parseInt(buf.getPixelRGB(0, i).a/alphaSolid) != parseInt(buf.getPixelRGB(0, i-1).a/alphaSolid))&&(typeof cut.y1 === "undefined")) cut.y1 = i;
			else if ((parseInt(buf.getPixelRGB(0, i).a/alphaSolid) != parseInt(buf.getPixelRGB(0, i-1).a/alphaSolid))&&(typeof cut.y1 !== "undefined")) cut.y2 = i;
			if ((parseInt(buf.getPixelRGB(imageIn.width - 1, i).a/alphaSolid) != parseInt(buf.getPixelRGB(imageIn.width - 1, i-1).a/alphaSolid))&&(typeof cutPaddingBox.y1 === "undefined")) cutPaddingBox.y1 = i;
			else if ((parseInt(buf.getPixelRGB(imageIn.width - 1, i).a/alphaSolid) != parseInt(buf.getPixelRGB(imageIn.width - 1, i-1).a/alphaSolid))&&(typeof cutPaddingBox.y1 !== "undefined")) cutPaddingBox.y2 = i;
		}
		segmentVertical[0] = {};
		segmentVertical[0].y = 1;
		segmentVertical[0].yNew = 0;
		segmentVertical[0].height = cut.y1 - 1;
		segmentVertical[0].heightNew = segmentVertical[0].height;
		segmentVertical[0].type = (parseInt(buf.getPixelRGB(0, 1).a/alphaSolid)) ? 'stretch' : 'const';
		segmentVertical[1] = {};
		segmentVertical[1].y = cut.y1;
		segmentVertical[1].yNew = cut.y1 - 1;
		segmentVertical[1].height = cut.y2 - cut.y1 - 1;
		segmentVertical[1].heightNew = segmentVertical[1].height;
		segmentVertical[1].type = (parseInt(buf.getPixelRGB(0, cut.y1).a/alphaSolid)) ? 'stretch' : 'const';
		segmentVertical[2] = {};
		segmentVertical[2].y = cut.y2;
		segmentVertical[2].yNew = cut.y2 - 1;
		segmentVertical[2].height = imageIn.height - cut.y2 - 1;
		segmentVertical[2].heightNew = segmentVertical[2].height;
		segmentVertical[2].type = (parseInt(buf.getPixelRGB(0, cut.y2).a/alphaSolid)) ? 'stretch' : 'const';

		// Process the possible situations
		// The stretch central region
		if ((segmentHorizontal[0].type == 'const')&&(segmentHorizontal[1].type == 'stretch')&&(segmentHorizontal[2].type == 'const')) {
			segmentHorizontal[1].widthNew = width - segmentHorizontal[0].widthNew - segmentHorizontal[2].widthNew + 1;
			segmentHorizontal[2].xNew = width - segmentHorizontal[2].widthNew;
		}
		// The stretch edge
		else if ((segmentHorizontal[0].type == 'stretch')&&(segmentHorizontal[1].type == 'const')&&(segmentHorizontal[2].type == 'stretch')) {
			segmentHorizontal[0].widthNew = Math.round((width - segmentHorizontal[1].width)/2);
			segmentHorizontal[2].widthNew = width - segmentHorizontal[1].width - segmentHorizontal[0].widthNew;
			segmentHorizontal[1].xNew = Math.round((width - segmentHorizontal[1].width)/2);
			segmentHorizontal[2].xNew = segmentHorizontal[1].xNew + segmentHorizontal[1].widthNew;
		}
		// Error
		else return game.add.image(x, y, PIXI.TextureCache['__missing']);
		// The stretch central region
		if ((segmentVertical[0].type == 'const')&&(segmentVertical[1].type == 'stretch')&&(segmentVertical[2].type == 'const')) {
			segmentVertical[1].heightNew = height - segmentVertical[0].heightNew - segmentVertical[2].heightNew + 1;
			segmentVertical[2].yNew = height - segmentVertical[2].heightNew;
		}
		// The stretch edge
		else if ((segmentVertical[0].type == 'stretch')&&(segmentVertical[1].type == 'const')&&(segmentVertical[2].type == 'stretch')) {
			segmentVertical[0].heightNew = Math.round((height - segmentVertical[1].height)/2);
			segmentVertical[2].heightNew = height - segmentVertical[1].height - segmentVertical[0].heightNew;
			segmentVertical[1].yNew = Math.round((height - segmentVertical[1].height)/2);
			segmentVertical[2].yNew = segmentVertical[1].yNew + segmentVertical[1].heightNew;
		}
		else return game.add.image(x, y, PIXI.TextureCache['__missing']);

		var bmd = game.add.bitmapData(width, height);
		bmd.smoothed = false;

		// Putting the image of the pieces
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				bmd.copy(buf, segmentHorizontal[i].x, segmentVertical[j].y, segmentHorizontal[i].width, segmentVertical[j].height, segmentHorizontal[i].xNew, segmentVertical[j].yNew, segmentHorizontal[i].widthNew, segmentVertical[j].heightNew);
			}
		}

		// Save the image in the cache and create an image of it
		if (keyInCache === null) keyInCache = key + '-' + width + '-' + height;
		// Since there is a problem with generateTexture at the first generation, we need to work directly with the PIXI
		// Get PIXI.Texture of bitmapData
		var copyCanvas = PIXI.CanvasPool.create(this, bmd.width, bmd.height);
		var copyContext = copyCanvas.getContext('2d', { alpha: true });
		copyContext.putImageData(bmd.ctx.getImageData(0, 0, bmd.width, bmd.height), 0, 0);
		var texture = PIXI.Texture.fromCanvas(copyCanvas);

		// We put the resulting texture in PIXI.Texture Cache
		PIXI.Texture.addTextureToCache(texture, keyInCache);

		Phaser.Image.call(this, game, x, y, texture);

		// Be sure to destroy the bitmaps, because they are not auto destroyed
		buf.destroy();
		bmd.destroy();

		// Determine the content area
		this.paddingBox = {
			'x' : 0,
			'y' : 0,
			'width' : width,
			'height' : height
		}

		if ((typeof cutPaddingBox.x1 !== "undefined")&&(typeof cutPaddingBox.x2 !== "undefined")&&(typeof cutPaddingBox.y1 !== "undefined")&&(typeof cutPaddingBox.y2 !== "undefined")) {
			if ((cutPaddingBox.x1 < cut.x1)&&(segmentHorizontal[0].type == 'const')) cutPaddingBox.x1 = cutPaddingBox.x1;
			else if ((cutPaddingBox.x1 < cut.x1)&&(segmentHorizontal[0].type == 'stretch')) cutPaddingBox.x1 = (cutPaddingBox.x1 / segmentHorizontal[1].x) * segmentHorizontal[0].widthNew;
			else if ((cutPaddingBox.x1 < cut.x2)&&(segmentHorizontal[1].type == 'const')) cutPaddingBox.x1 = segmentHorizontal[0].widthNew + segmentHorizontal[1].widthNew - (segmentHorizontal[2].x - cutPaddingBox.x1);
			else if ((cutPaddingBox.x1 < cut.x2)&&(segmentHorizontal[1].type == 'stretch')) cutPaddingBox.x1 = ((cutPaddingBox.x1 - segmentHorizontal[0].x) / segmentHorizontal[1].width) * segmentHorizontal[1].widthNew;
			else if ((cutPaddingBox.x1 > cut.x2)&&(segmentHorizontal[2].type == 'const')) cutPaddingBox.x1 = width - (imageIn.width - cutPaddingBox.x1);
			else if ((cutPaddingBox.x1 > cut.x2)&&(segmentHorizontal[2].type == 'stretch')) cutPaddingBox.x1 = (width - ((imageIn.width - cutPaddingBox.x1) / segmentHorizontal[2].width) * segmentHorizontal[2].widthNew);
			if ((cutPaddingBox.x2 < cut.x1)&&(segmentHorizontal[0].type == 'const')) cutPaddingBox.x2 = cutPaddingBox.x2;
			else if ((cutPaddingBox.x2 < cut.x1)&&(segmentHorizontal[0].type == 'stretch')) cutPaddingBox.x2 = (cutPaddingBox.x2 / segmentHorizontal[1].x) * segmentHorizontal[0].widthNew;
			else if ((cutPaddingBox.x2 < cut.x2)&&(segmentHorizontal[1].type == 'const')) cutPaddingBox.x2 = segmentHorizontal[0].widthNew + segmentHorizontal[1].widthNew - (segmentHorizontal[2].x - cutPaddingBox.x2);
			else if ((cutPaddingBox.x2 < cut.x2)&&(segmentHorizontal[1].type == 'stretch')) cutPaddingBox.x2 = ((cutPaddingBox.x2 - segmentHorizontal[0].x) / segmentHorizontal[1].width) * segmentHorizontal[1].widthNew;
			else if ((cutPaddingBox.x2 > cut.x2)&&(segmentHorizontal[2].type == 'const')) cutPaddingBox.x2 = width - (imageIn.width - cutPaddingBox.x2);
			else if ((cutPaddingBox.x2 > cut.x2)&&(segmentHorizontal[2].type == 'stretch')) cutPaddingBox.x2 = (width - ((imageIn.width - cutPaddingBox.x2) / segmentHorizontal[2].width) * segmentHorizontal[2].widthNew);
			if ((cutPaddingBox.y1 < cut.y1)&&(segmentVertical[0].type == 'const')) cutPaddingBox.y1 = cutPaddingBox.y1;
			else if ((cutPaddingBox.y1 < cut.y1)&&(segmentVertical[0].type == 'stretch')) cutPaddingBox.y1 = (cutPaddingBox.y1 / segmentVertical[1].y) * segmentVertical[0].heightNew;
			else if ((cutPaddingBox.y1 < cut.y2)&&(segmentVertical[1].type == 'const')) cutPaddingBox.y1 = segmentVertical[0].heightNew + segmentVertical[1].heightNew - (segmentVertical[2].y - cutPaddingBox.y1);
			else if ((cutPaddingBox.y1 < cut.y2)&&(segmentVertical[1].type == 'stretch')) cutPaddingBox.y1 = ((cutPaddingBox.y1 - segmentVertical[0].y) / segmentVertical[1].height) * segmentVertical[1].heightNew;
			else if ((cutPaddingBox.y1 > cut.y2)&&(segmentVertical[2].type == 'const')) cutPaddingBox.y1 = height - (imageIn.height - cutPaddingBox.y1);
			else if ((cutPaddingBox.y1 > cut.y2)&&(segmentVertical[2].type == 'stretch')) cutPaddingBox.y1 = (height - ((imageIn.height - cutPaddingBox.y1) / segmentVertical[2].height) * segmentVertical[2].heightNew);
			if ((cutPaddingBox.y2 < cut.y1)&&(segmentVertical[0].type == 'const')) cutPaddingBox.y2 = cutPaddingBox.y2;
			else if ((cutPaddingBox.y2 < cut.y1)&&(segmentVertical[0].type == 'stretch')) cutPaddingBox.y2 = (cutPaddingBox.y2 / segmentVertical[1].y) * segmentVertical[0].heightNew;
			else if ((cutPaddingBox.y2 < cut.y2)&&(segmentVertical[1].type == 'const')) cutPaddingBox.y2 = segmentVertical[0].heightNew + segmentVertical[1].heightNew - (segmentVertical[2].y - cutPaddingBox.y2);
			else if ((cutPaddingBox.y2 < cut.y2)&&(segmentVertical[1].type == 'stretch')) cutPaddingBox.y2 = ((cutPaddingBox.y2 - segmentVertical[0].y) / segmentVertical[1].height) * segmentVertical[1].heightNew;
			else if ((cutPaddingBox.y2 > cut.y2)&&(segmentVertical[2].type == 'const')) cutPaddingBox.y2 = height - (imageIn.height - cutPaddingBox.y2);
			else if ((cutPaddingBox.y2 > cut.y2)&&(segmentVertical[2].type == 'stretch')) cutPaddingBox.y2 = (height - ((imageIn.height - cutPaddingBox.y2) / segmentVertical[2].height) * segmentVertical[2].heightNew);
			// Add the object of the basic values of the content area
			this.paddingBoxOriginal = {
				'x' : cutPaddingBox.x1,
				'y' : cutPaddingBox.y1,
				'width' : cutPaddingBox.x2 - cutPaddingBox.x1,
				'height' : cutPaddingBox.y2 - cutPaddingBox.y1
			}
		}

		return this;
	};

	Phaser.NinePatchImage.prototype = Object.create(Phaser.Image.prototype);
	Phaser.NinePatchImage.prototype.constructor = Phaser.NinePatchImage;

	// Add the ability to create through the add method
	Phaser.GameObjectFactory.prototype.ninePatchImage = function (x, y, width, height, key, keyInCache, group) {
		if (group === undefined) { group = this.world; }
		return group.add(new Phaser.NinePatchImage(this.game, x, y, width, height, key, keyInCache));
	};

	// Address to property paddingBox considering scaling
	Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'paddingBox', {
		get: function() {
			return {
				'x' : this.scale.x * this.paddingBoxOriginal.x,
				'y' : this.scale.y * this.paddingBoxOriginal.y,
				'width' : this.scale.x * this.paddingBoxOriginal.width,
				'height' : this.scale.y * this.paddingBoxOriginal.height
			}
		},
		set: function(value) {
			if (typeof paddingBoxOriginal !== "undefined") {
				this.paddingBoxOriginal.x = value.x / this.scale.x;
				this.paddingBoxOriginal.y = value.x / this.scale.y;
				this.paddingBoxOriginal.width = value.x / this.scale.width;
				this.paddingBoxOriginal.height = value.x / this.scale.height;
			}
		}
	});

}(window, Phaser));