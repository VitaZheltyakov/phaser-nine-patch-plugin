# Phaser Nine Patch Image plugin
Created by [Vitaliy Zheltyakov](mailto:vita-zhelt@yandex.ru).

Phaser is a fast, free and fun open source HTML5 game framework. This plugin adds to framework the possibility to use Nine Patch Images.

A Nine Patch Image is a stretchable image, which plugin creates according to the specified size. A Nine Patch Image drawable is a standard PNG image that includes an extra 1-pixel-wide border.

The border is used to define the stretchable and static areas of the image. You indicate a stretchable section by drawing one (or more) 1-pixel-wide black line(s) in the left and top part of the border (the other border pixels should be fully transparent or white). You can have 1 or 2 stretchable sections.

<img src="http://developer.android.com/images/ninepatch_raw.png" align="center">

You can also define an optional drawable section of the image (effectively, the padding lines) by drawing a line on the right and bottom lines.

### How to add a plugin

Add to your index.html link to plugin file:

<script src="js/phaser-nine-patch-plugin.js" type="text/javascript"></script>

### How to use a plugin

First, create an image according to the standard described above. Then you can create an nine-patch image as follows:

game.add.ninePatchImage(x, y, width, height, key);

or

new Phaser.NinePatchImage(x, y, width, height, key);

This object behaves like an image, but may contain information about the padding box. For information about the content area can be obtained by contacting the property "paddingBox" (for example: image.paddingBox.x).


### Note

#1 - The plugin works only with images. It does not work with atlases, bitmaps or cache.
#2 - On mobile devices with specific anti-aliasing settings may be a problem with the original image reading. This  is not a problem of plugin or Phiser, is the problem of mobile browsers.

### License

Phaser Nine Patch Image plugin is released under the [MIT License](http://opensource.org/licenses/MIT).

### Examples

The repository has 3 examples of using the plugin.