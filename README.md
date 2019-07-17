# BrainfuckBrowser

A very simple browser-based [Brainfuck](https://en.wikipedia.org/wiki/Brainfuck) interpreter in Javascript, HTML &amp; CSS

The [Quine](https://en.wikipedia.org/wiki/Quine_(computing)) Brainfuck example is taken from [here](https://github.com/itchyny/brainfuck/blob/master/quine.bf) whilst the 'Hello World' program was taken from [here](https://codegolf.stackexchange.com/questions/55422/hello-world)

![Screenshot](https://github.com/James-P-D/BrainfuckBrowser/blob/master/screenshot.png)

## Brainfuck Commands

Brainfuck is a simple [turing complete](https://en.wikipedia.org/wiki/Turing_completeness) programming language which consists of only eight commands. The commands operate on a memory array which is indexed by a pointer.

The eight commands in Brainfuck are detailed below. Any non-Brainfuck characters are treated as comments.

Command | Meaning
------- | -------------
&gt; | Increment the data pointer by one
&lt; | Decrement the data pointer by one
&#43; | Increment the byte in memory location pointed at by data pointer by one
&minus; | Decrement the byte in memory location pointed at by data pointer by one
. | Output the byte in memory location pointed at by data pointer
, | Input a byte and place in memory location pointed at by data pointer
&#91; | While the current byte pointed at in memory is zero
&#92; | End-while