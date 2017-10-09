# MDConvert
__MDConvert__ is a simple command line utility that will convert a Markdown file to `.html`. Depending on the content-type of the Markdown file
the convertor will generate a dynamic slide presentation or a PDF print ready document.

## Install
To use this utility you need to have both the executable file for your operating system (in case of windows this is `mdconvert.exe`) and the 
`lib` folder and its contents. 

The easiest way to install this program is to clone this repository and then add its location to your PATH (if you're on windows).

## Usage
Usage of the convertor is pretty straightforward: Execute `mdconvert filename.md` to get the default conversion. Open the generated .html
to see the result. You can use any of the following command line parameters / options:

### Options
- `?`: Displays the help menu and all the command line options|
- `b`: Uses a blue background for a presentation. Best used with paperview option (-p) for legibility|
