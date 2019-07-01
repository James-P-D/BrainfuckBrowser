var BrainFuck = new function () {
    // Constants for our 8 commands
    const INCREMENT_DATA_POINTER = '>';
    const DECREMENT_DATA_POINTER = '<';
    const INCREMENT_DATA = '+';
    const DECREMENT_DATA = '-';
    const WHILE_NOT_ZERO = '[';
    const END_WHILE = ']';
    const INPUT = ',';
    const OUTPUT = '.';

    // Keep all tables at 60 columns
    const COLUMNS = 60;

    this.memoryPointer = 0;
    this.memory = [];
    this.programPointer = 0;
    this.program = [];
    this.brackets = {};

    // Allocate the memory array and draw the table
    this.AllocateMemory = function (memorySize) {
        this.memory = new Array(memorySize)
        this.memoryPointer = 0;
        for (var i = 0; i < memorySize; i++) {
            this.memory[i] = 0;
        }
        var memoryTable = document.getElementById('MemoryTable');
        var html = BrainFuck.GenerateTable(this.memory, this.memoryPointer);
        memoryTable.innerHTML = html;
    }

    // Load the default programs on selection-change
    this.DefaultProgramSelect = function (defaultProgramSelect) {
        if (defaultProgramSelect == 'Alphabet') {
            document.getElementById('Program').value =
                '++++++++++++++++++++++++++\n' +
                '>\n' +
                '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n' +
                '<\n' +
                '[\n' +
                ' >\n' +
                ' .\n' +
                ' +\n' +
                ' <\n' +
                ' -\n' +
                ']';
        }
        else if (defaultProgramSelect == 'Quine') {
            // From https://github.com/itchyny/brainfuck/blob/master/quine.bf
            document.getElementById('Program').value = '->+>+++>>+>++>+>+++>>+>++>>>+>+>+>++>+>>>>+++>+>>++>+>+++>>++>++>>+>>+>++>++>+>>>>+++>+>>>>++>++>>>>+>>++>+>+++>>>++>>++++++>>+>>++>+>>>>+++>>+++++>>+>+++>>>++>>++>>+>>++>+>+++>>>++>>+++++++++++++>>+>>++>+>+++>+>+++>>>++>>++++>>+>>++>+>>>>+++>>+++++>>>>++>>>>+>+>++>>+++>+>>>>+++>+>>>>+++>+>>>>+++>>++>++>+>+++>+>++>++>>>>>>++>+>+++>>>>>+++>>>++>+>+++>+>+>++>>>>>>++>>>+>>>++>+>>>>+++>+>>>+>>++>+>++++++++++++++++++>>>>+>+>>>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++++>>>+>++>>+++>+>+>++>+>+++>>>>>+++>>>+>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++>>+>+++>>>>>>++>+>+++>>+>++>>>>+>+>++>+>>>>+++>>+++>>>+[[->>+<<]<+]+++++[->+++++++++<]>.[+]>>[<<+++++++[->+++++++++<]>-.------------------->-[-<.<+>>]<[+]<+>>>]<<<[-[-[-[>>+<++++++[->+++++<]]>++++++++++++++<]>+++<]++++++[->+++++++<]>+<<<-[->>>++<<<]>[->>.<<]<<]';
        }
        else if (defaultProgramSelect == 'HelloWorld') {
            // From https://codegolf.stackexchange.com/questions/55422/hello-world
            document.getElementById('Program').value = '--->->->>+>+>>+[++++[>+++[>++++>-->+++<<<-]<-]<+++]>>>.>-->-.>..+>++++>+++.+>-->[>-.<<]';
        }
        else {
            document.getElementById('Program').value = '';
        }
    }

    // Generate a table
    this.GenerateTable = function (array, arrayPointer) {
        var html = "<TABLE>";
        var rows = Math.ceil(array.length / COLUMNS);

        var i = 0;
        for (var row = 0; row < rows; row++) {
            var rowHeader = "<TR>";
            var rowData = "<TR>";

            for (var j = 0; j < COLUMNS; j++) {
                if (i >= array.length) {
                    break;
                }

                if (i == arrayPointer) {
                    // Include an asterix for the current position
                    rowHeader += "<TH>*</TH>";
                }
                else {
                    rowHeader += "<TH></TH>";
                }

                rowData += "<TD>" + array[i] + "</TD>";

                i++;
            }

            rowHeader += "</TR>";
            rowData += "</TR>";

            html += rowHeader + rowData;
        }

        html += "</TABLE>";

        return html;
    }

    this.Load = function (sourceCode) {
        this.startWhile = [];
        this.program = [];
        this.brackets = {};
        var depth = 0;
        var index = 0;

        for (var i = 0; i < sourceCode.length; i++) {
            switch (sourceCode[i]) {
                case INCREMENT_DATA_POINTER:
                case DECREMENT_DATA_POINTER:
                case INCREMENT_DATA:
                case DECREMENT_DATA:
                case INPUT:
                case OUTPUT:
                    {
                        this.program.push(sourceCode[i]);
                        index++;
                        break;
                    }
                case WHILE_NOT_ZERO:
                    {
                        this.program.push(sourceCode[i]);
                        this.startWhile[depth] = index;
                        depth++;
                        index++;
                        break;
                    }
                case END_WHILE:
                    {
                        this.program.push(sourceCode[i]);
                        depth--;
                        if (depth < 0) {
                            alert('Unbalanced braces!');
                            return;
                        }

                        this.brackets[index] = this.startWhile[depth];
                        this.brackets[this.startWhile[depth]] = index;
                        index++;
                        break;
                    }
            }
        }

        if (depth != 0) {
            alert('Unbalanced braces!');
            return;
        }

        this.programPointer = 0;

        var programTable = document.getElementById('ProgramTable');
        var html = BrainFuck.GenerateTable(this.program, this.programPointer);
        programTable.innerHTML = html;

        this.AllocateMemory(document.getElementById('MemorySize').value);

        var stepButton = document.getElementById('StepButton');
        stepButton.disabled = false;
        var runButton = document.getElementById('RunButton');
        runButton.disabled = false;
        var outputTextArea = document.getElementById('OutputTextArea');
        outputTextArea.value = "";

        return true;
    }

    this.Step = function () {
        switch (this.program[this.programPointer]) {
            case INCREMENT_DATA_POINTER:
                {
                    // Increment the memory pointer. Remember to wrap.
                    this.memoryPointer++;
                    if (this.memoryPointer >= this.memory.length) {
                        this.memoryPointer = 0;
                    }
                    this.programPointer++;

                    break;
                }
            case DECREMENT_DATA_POINTER:
                {
                    // Decrement the memory pointer. Remember to wrap.
                    this.memoryPointer--;
                    if (this.memoryPointer < 0) {
                        this.memoryPointer = this.memory.length - 1;
                    }
                    this.programPointer++;

                    break;
                }
            case INCREMENT_DATA:
                {
                    // Increment the current cell. Remember to wrap.
                    this.memory[this.memoryPointer]++;
                    if (this.memory[this.memoryPointer] > 255) {
                        this.memory[this.memoryPointer] = this.memory[this.memoryPointer] % 256;
                    }
                    this.programPointer++;

                    break;
                }
            case DECREMENT_DATA:
                {
                    // Decrement the current cell. Remember to wrap.
                    this.memory[this.memoryPointer]--;
                    if (this.memory[this.memoryPointer] < 0) {
                        this.memory[this.memoryPointer] += 256;
                    }
                    this.programPointer++;

                    break;
                }
            case OUTPUT:
                {
                    var outputTextArea = document.getElementById('OutputTextArea');
                    // Output the character for the current cell
                    outputTextArea.value = outputTextArea.value + String.fromCharCode(this.memory[this.memoryPointer]);
                    this.programPointer++;

                    break;
                }
            case INPUT:
                {
                    var inputValue = -1;
                    // Keep reading an input value until its valid
                    while (isNaN(inputValue) || (inputValue < 0) || (inputValue > 255)) {
                        inputValue = parseInt(prompt('Enter a value (0-255)', 0));
                    }

                    // Put the value read into memory
                    this.memory[this.memoryPointer] = inputValue;
                    this.programPointer++;

                    break;
                }
            case WHILE_NOT_ZERO:
                {
                    if (this.memory[this.memoryPointer] == 0) {
                        // If the current cell is zero, then jump to the end of the loop
                        this.programPointer = this.brackets[this.programPointer];
                    }

                    // Always incrememnt the programPointer. (If we are going through our while-loop, we
                    // will want to execute the next command. If we have jumped to the end of our while loop
                    // we will want to jump past the ']' and move to the next command)
                    this.programPointer++;

                    break;
                }
            case END_WHILE:
                {
                    // Jump to the top of the loop
                    this.programPointer = this.brackets[this.programPointer];
                    break;
                }
        }

        var updateProgress = document.getElementById('ShowProgress');
        if (updateProgress.checked == true) {
            // Only update tables if updateProgress is turned on
            var programTable = document.getElementById('ProgramTable');
            var html = BrainFuck.GenerateTable(this.program, this.programPointer);
            programTable.innerHTML = html;

            var memoryTable = document.getElementById('MemoryTable');
            var html = BrainFuck.GenerateTable(this.memory, this.memoryPointer);
            memoryTable.innerHTML = html;
        }

        // If the program is complete, always update the tables
        if (this.programPointer >= this.program.length) {
            var programTable = document.getElementById('ProgramTable');
            var html = BrainFuck.GenerateTable(this.program, this.programPointer);
            programTable.innerHTML = html;

            var memoryTable = document.getElementById('MemoryTable');
            var html = BrainFuck.GenerateTable(this.memory, this.memoryPointer);
            memoryTable.innerHTML = html;

            alert('Complete!');
            return false;
        }

        return true;
    }

    this.Run = function () {
        if (!BrainFuck.Step()) {
            return;
        }
        window.setTimeout(BrainFuck.Run, 10);
    }
}