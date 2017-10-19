# MDConvert
__MDConvert__ is a simple command line utility that will convert a Markdown file to `.html`. Depending on the content-type of the Markdown file
the convertor will generate a dynamic slide presentation or a PDF print ready document.

## Install
__Currently installing is not yet as easy as it should be, an installer should be implemented soonish__
To use this utility you need to have both the executable file for your operating system (in case of windows this is `mdconvert.exe`) and the 
`lib` folder and its contents. 

The easiest way to install this program is to clone this repository and then add its location to your PATH (if you're on windows).
Adding it to your PATH allows you to use the `mdconvert` command system wide in the terminal. If you don't know how to add something to
the PATH, google it :)

## Presentation or PDF
The difference between a presentation and a static HTML page (ready to be a PDF) is the use of slides. Slides can be made by entering
`---` at slide borders. For example:
```
Slide 1, and its content
---
Slide 2, and its content
```
For the slide separator (`---`) you can use three or more hyphens. The slide separator HAS to be on a separate line.

If there are no slide separators in your document, the document will be interpreted as a single page HTML and a printer friendly
layout is chosen.

## Usage
Usage of the convertor is pretty straightforward: Execute `mdconvert filename.md` to get the default conversion. Open the generated .html
to see the result. You can use any of the following command line parameters / options:

### Options
- `?`: Displays the help menu and all the command line options.
- `b`: Uses a blue background for a presentation. Best used with paperview option (-p) for legibility.
- `f`: Opens the generated file and immediately opens the print dialog to print to PDF. You don't need to include the -o option.
- `g`: Uses a green background for a presentation. Best used with paperview option (-p) for legibility.
- `help`: Displays the help menu and all the command line options.
- `o`: Open the file once the conversion has been finished. Opens the HTML page using the system default browser.
- `p`: The -p parameter means 'paper view'. This is just a layout option. 
- `r`: Uses a red background for a presentation. Best used with paperview option (-p) for legibility.
- `y`: Uses a yellow background for a presentation. Best used with paperview option (-p) for legibility.

Paperview (`p`) and background options (`r`, `g`, `b` and `y`) are ignored for documents that are not slide presentations (Documents without slide separators).

#### Examples
To make a paperview presentation with a yellow background and immediately open it in the default browser:
```
mdconvert -pyo filename.md
```
To make a paperview presentation with a red background:
```
mdconvert -pr filename.md
```
To make a normal presentation or PDF and immediately open the browser print dialog:
```
mdconvert -f filename.md
```
To make a normal presention with a blue background:
```
mdconvert -r filename.md
```
