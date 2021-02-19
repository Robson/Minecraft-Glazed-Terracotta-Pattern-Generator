# Minecraft *Glazed Terracotta* Pattern Generator

## Table of Contents

 * [Demo](#demo)
 * [Explanation](#explanation)
 * [Example](#example) 
 * [Live Version](#live-version)
 * [Compatibility](#compatibility)
 * [Testing](#testing) 
 * [File Descriptions](#file-descriptions)
 * [License](#license)
 * [Technologies](#technologies)
 * [Validation](#validation)
 
## Demo

Coming Soon
 
## Explanation

An interactive webpage that randomly generates nice/terrible patterns for the <a href="https://minecraft.gamepedia.com/Glazed_Terracotta">glazed terracotta blocks</a> in <a href="https://www.minecraft.net/en-us/">Minecraft</a>.

## Example

<img src="https://raw.githubusercontent.com/Robson/Minecraft-Glazed-Terracotta-Pattern-Generator/main/example.png" />

## Live Version

https://robson.plus/minecraft-glazed-terracotta-pattern-generator/

## Compatibility

The output for this project is designed for desktop and mobile.

| Platform | OS      | Browser          | Version | Status  |
| :------- | :------ | :--------------- | :------ | :------ |
| Desktop  | Windows | Firefox          | 85      | Working |
| Desktop  | Windows | Opera            | 74      | Working |
| Desktop  | Windows | Chrome           | 88      | Working |
| Desktop  | Windows | Edge             | 88      | Working |
| Mobile   | Android | Chrome           | 85      | Working |

Last tested on 19th February 2021.

## Testing

The webpage in this project uses canvases, which means it needs to be viewed through a web server, such as [Apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server). This guide assumes you know how to use Apache.

After installing Apache, you can then run this on your computer by doing this:
 * [Download the repository](https://github.com/Robson/Minecraft-Glazed-Terracotta-Pattern-Generator/archive/master.zip).
 * Unzip anywhere.
 * Copy the unzipped files into the Apache web directory.
 * In your browser, navigate to http://localhost/ and the page should appear.

## File Descriptions

### Everything in the textures-improved directory

These textures are my in-progress attempt at improving the default textures. These are hidden away and not intended to be used, but they can be accessed by clicking the "r" at the end of the page title.

### Everything in the textures-original directory

These textures are used by the webpage.

### arrow-black.png + arrow-white.png

These are used in the building guide. The page chooses the arrow that will be most visible against the background colour.

### index.html + page.js + style.css

These are the most important files. They consist of the webpage, the JavaScript to power the page and the formatting to style the page.

### names.js

This file generates random names for each pattern, which are displayed by hovering over the pattern on desktop. This does not improve the generator in any way and it's expected that most users won't notice this.
 
## License

The images in the "textures-original" folder are the glazed terracotta textures from Minecraft. Their copyright belongs with Mojang/Microsoft.

Everything else uses the license of the repository.

## Technologies

This is built using:
 * HTML
 * CSS
 * JavaScript
   * <a href="https://github.com/d3/d3">D3.js</a>

## Validation
   
<a href="https://validator.w3.org/nu/?doc=https%3A%2F%2Frobson.plus%2Fminecraft-glazed-terracotta-pattern-generator%2F"><img src="https://www.w3.org/Icons/valid-html401-blue" alt="Valid HTML" /></a>
<a href="http://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Frobson.plus%2Fminecraft-glazed-terracotta-pattern-generator%2Fstyle.css&profile=css3svg&usermedium=all&warning=1"><img src="https://jigsaw.w3.org/css-validator/images/vcss-blue" alt="Valid CSS" /></a>   
