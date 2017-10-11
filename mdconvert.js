"use strict";

const marked = require('marked');
const fs = require('fs');
const libDir = (process.argv[0].substring(0, process.argv[0].lastIndexOf('\\'))) + "/lib/";
const css = '@media print{*,:after,:before{background:0 0!important;color:#000!important;box-shadow:none!important;text-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:" (" attr(href) ")"}abbr[title]:after{content:" (" attr(title) ")"}a[href^="#"]:after,a[href^="javascript:"]:after{content:""}blockquote,pre{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}img{max-width:100%!important}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}}@media screen and (min-width:32rem) and (max-width:48rem){html{font-size:15px}}@media screen and (min-width:48rem){html{font-size:16px}}body{line-height:1.85}.splendor-p,p{font-size:1rem;margin-bottom:1.3rem}.splendor-h1,.splendor-h2,.splendor-h3,.splendor-h4,h1,h2,h3,h4{margin:1.414rem 0 .5rem;font-weight:inherit;line-height:1.42}.splendor-h1,h1{margin-top:0;font-size:3.998rem}.splendor-h2,h2{font-size:2.827rem}.splendor-h3,h3{font-size:1.999rem}.splendor-h4,h4{font-size:1.414rem}.splendor-h5,h5{font-size:1.121rem}.splendor-h6,h6{font-size:.88rem}.splendor-small,small{font-size:.707em}canvas,iframe,img,select,svg,textarea,video{max-width:100%}@import url(http://fonts.googleapis.com/css?family=Merriweather:300italic,300);html{font-size:18px;max-width:100%}body{color:#444;font-family:Merriweather,Georgia,serif;margin:0;max-width:100%}:not(div):not(img):not(body):not(html):not(li):not(blockquote):not(p),p{margin:1rem auto;max-width:36rem;padding:.25rem}div,div img{width:100%}blockquote p{font-size:1.5rem;font-style:italic;margin:1rem auto;max-width:48rem}li{margin-left:2rem}h1{padding:4rem 0!important}p{color:#555;height:auto;line-height:1.45}code,pre{font-family:Menlo,Monaco,"Courier New",monospace}pre{background-color:#fafafa;font-size:.8rem;overflow-x:scroll;padding:1.125em}a,a:visited{color:#3498db}a:active,a:focus,a:hover{color:#2980b9}';
const animate = fs.readFileSync(libDir + "an.css", 'utf-8');
const animateFull = fs.readFileSync(libDir + "an_full.css", 'utf-8');
var header = "<!DOCTYPE html><html><head><title>{{FILENAME}}</title><style>" + css + "</style><style>{ANIMATE}</style></head><body style='display:none;'><div class='slide'>";
const footer = "</div><script>{{JQ}}</script><script>{{SHOW}}</script></body></html>";
const jquery = fs.readFileSync(libDir + "jq.js", 'utf-8');
var show = fs.readFileSync(libDir + "show.js", 'utf-8');
var exec = require('child_process').exec;
//by default do not immediately open the output file
var immediateOpen = false;

//If there was actually a file supplied, continue, else display help
if(process.argv.length < 3) {
	showHelp();
	return;
}

//the last option is always the filename
var fileName = process.argv[process.argv.length - 1];
if(fileName == '?' || fileName == 'help' || fileName == '--help' || fileName == '-help'){
	showHelp();
	return;
}

//read the file contents
var fileContents = "";
try{
	fileContents = fs.readFileSync(fileName, 'utf-8');
}catch(err){
	console.log("Could not find file: " + fileName);
	console.log("Abort.");
	return;
}

//if we have any options passed
var options = process.argv[2];
//If there were actually options passed
if(options != fileName){
	if(options.indexOf('p') != -1){
		console.log("Using paper slides look");
		show = show.replace('//{PAPERVIEW}', '');
	}
	if(options.indexOf('r') != -1){
		console.log("Using red background");
		show = show.replace('//{RED}', '');
	}
	if(options.indexOf('g') != -1){
		console.log("Using green background");
		show = show.replace('//{GREEN}', '');
	}
	if(options.indexOf('b') != -1){
		console.log("Using blue background");
		show = show.replace('//{BLUE}', '');
	}
	if(options.indexOf('y') != -1){
		console.log("Using yellow background");
		show = show.replace('//{YELLOW}', '');
	}
	if(options.indexOf('o') != -1){
		console.log("Open file once output is finished");
		immediateOpen = true;
	}
	if(options.indexOf('f') != -1){
		console.log("Open print FILE dialog immediately after browser has opened");
		show = show.replace('//{PRINT}', '');
		immediateOpen = true;
	}

	//include animations
	if(options.indexOf('a') != -1){
		console.log("Using all animations");
		header = header.replace('{ANIMATE}', animateFull);
	}else{
		header = header.replace('{ANIMATE}', animate);		
	}
	
}	
//replace the slide markers with slide divs
fileContents = fileContents.replace(/---+/g, '</div><div class="slide">');

//convert to HTML
var convertedContents = header.replace("{{FILENAME}}", fileName) + marked(fileContents) + footer;

//insert the jquery into the document
convertedContents = convertedContents.replace('{{JQ}}', jquery);
//remove any newlines from the document for even more compression
//convertedContents = convertedContents.replace(/\n/g, '');
//insert the script that controls the slideshow into the document
convertedContents = convertedContents.replace('{{SHOW}}', show);


//write the converted content to disk
fs.writeFile(fileName + ".html", convertedContents, function(err){
	console.log("Succesfully converted " + fileName + " to " + fileName + ".html");
	
	if(!immediateOpen) return;
	console.log("Opening file...");
	exec(getCommandLine() + " " + fileName + ".html");
});

/**
 * Prints the help instructions
 */
function showHelp(){
	console.log("MDConvert converts markdown files to either static HTML pages, or dynamic presentations.");
	console.log("");
	console.log("EXAMPLE: mdconvert [-options] filename");
	console.log("The options can be omitted if you don't want to use them. In that case the syntax is:");
	console.log("EXAMPLE: mdconvert filename");
	console.log("");
	console.log("Options:\t\t(combine multiple letters to combine their options)");
	console.log("?\tDisplays this help menu explaining the various options you have using this program.");
	console.log("a\tIncludes all animations from Animate.css into the presentation to be used in your MD file.");
	console.log("\tEXAMPLE: mdconvert -a filename.md");
	console.log("b\tUses a blue background for a presentation. Best used with paperview option (p) for legibility.");
	console.log("\tEXAMPLE: mdconvert -b filename.md");
	console.log("f\tOpens the generated file and print dialog to print to PDF. You don't need to include the 'o' option.");
	console.log("\tEXAMPLE: mdconvert -f filename.md");
	console.log("g\tUses a green background for a presentation. Best used with paperview option (p) for legibility.");
	console.log("\tEXAMPLE: mdconvert -g filename.md");
	console.log("help\tDisplays this help menu explaining the various options you have using this program.");
	console.log("o\tOpen the file once the conversion has been finished. Opens the HTML page using the default browser.")
	console.log("\tEXAMPLE: mdconvert -o filename.md");
	console.log("p\tthe 'p' parameter means 'paper view'. Use this on slides to give them a 'paper' layout.");
	console.log('\tEXAMPLE: mdconvert -p filename.md');
	console.log("r\tUses a red background for a presentation. Best used with paperview option (p) for legibility.");
	console.log("\tEXAMPLE: mdconvert -r filename.md");
	console.log("y\tUses a yellow background for a presentation. Best used with paperview option (p) for legibility.");
	console.log("\tEXAMPLE: mdconvert -y filename.md");
	console.log("");
	console.log("Output:");
	console.log("The generated presentation or static HTML page will be printed to a .html file with the same name as the source MD file.");
	console.log("");
	console.log("For more help please reference the github page: https://github.com/MGelein/mdconvert/");
}

/**
 * Returns the command to open a file with default application depending on environment
 */
function getCommandLine() {
	switch (process.platform) { 
	   case 'darwin' : return 'open';
	   case 'win32' : return 'start';
	   case 'win64' : return 'start';
	   default : return 'xdg-open';
	}
}