var BrainFuck = new function()
{
    const INCREMENT_DATA_POINTER = '>';
    const DECREMENT_DATA_POINTER = '<';
    const INCREMENT_DATA = '+';
    const DECREMENT_DATA = '-';
    const WHILE_NOT_ZERO = '[';
    const END_WHILE = ']';
    const INPUT = ',';
    const OUTPUT = '.';

    const COLUMNS = 60;

    this.memoryPointer = 0;
    this.memory = [];
    this.programPointer = 0;
    this.program = [];
	this.brackets = {};

    this.AllocateMemory = function(memorySize)
    {
        this.memory = new Array(memorySize)
        this.memoryPointer = 0;
        for(var i = 0; i < memorySize; i++)
        {
            this.memory[i] = 0;
        }
        var memoryTable = document.getElementById('MemoryTable');
        var html = BrainFuck.GenerateTable(this.memory, this.memoryPointer);
        memoryTable.innerHTML = html;  
    }

    this.DefaultProgramSelect = function(defaultProgramSelect)
    {
		if(defaultProgramSelect == 'Alphabet')
		{
			document.getElementById('Program').value =
			    '++++++++++++++++++++++++++\n'+
				'>\n'+
				'+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n'+
				'<\n'+
				'[\n'+
				' >\n'+
				' .\n'+
				' +\n'+
				' <\n'+
				' -\n'+
				']';
		}
		else if(defaultProgramSelect == 'Quine')
        {
            // From https://github.com/itchyny/brainfuck/blob/master/quine.bf
            document.getElementById('Program').value = '->+>+++>>+>++>+>+++>>+>++>>>+>+>+>++>+>>>>+++>+>>++>+>+++>>++>++>>+>>+>++>++>+>>>>+++>+>>>>++>++>>>>+>>++>+>+++>>>++>>++++++>>+>>++>+>>>>+++>>+++++>>+>+++>>>++>>++>>+>>++>+>+++>>>++>>+++++++++++++>>+>>++>+>+++>+>+++>>>++>>++++>>+>>++>+>>>>+++>>+++++>>>>++>>>>+>+>++>>+++>+>>>>+++>+>>>>+++>+>>>>+++>>++>++>+>+++>+>++>++>>>>>>++>+>+++>>>>>+++>>>++>+>+++>+>+>++>>>>>>++>>>+>>>++>+>>>>+++>+>>>+>>++>+>++++++++++++++++++>>>>+>+>>>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++++>>>+>++>>+++>+>+>++>+>+++>>>>>+++>>>+>+>>++>+>+++>>>++>>++++++++>>+>>++>+>>>>+++>>++++>>+>+++>>>>>>++>+>+++>>+>++>>>>+>+>++>+>>>>+++>>+++>>>+[[->>+<<]<+]+++++[->+++++++++<]>.[+]>>[<<+++++++[->+++++++++<]>-.------------------->-[-<.<+>>]<[+]<+>>>]<<<[-[-[-[>>+<++++++[->+++++<]]>++++++++++++++<]>+++<]++++++[->+++++++<]>+<<<-[->>>++<<<]>[->>.<<]<<]';
        }
        else if (defaultProgramSelect == 'HelloWorld')
        {
            // From https://codegolf.stackexchange.com/questions/55422/hello-world
            document.getElementById('Program').value = '--->->->>+>+>>+[++++[>+++[>++++>-->+++<<<-]<-]<+++]>>>.>-->-.>..+>++++>+++.+>-->[>-.<<]';
        }
        else
        {
            document.getElementById('Program').value = '';
        }
    }

    this.GenerateTable = function(array, arrayPointer)
    {
        var html = "<TABLE>";
        var rows = Math.ceil(array.length / COLUMNS);

        var i = 0;
        for(var row = 0; row < rows; row++)
        {
            var rowHeader = "<TR>";
            var rowData = "<TR>";

            for(var j = 0; j < COLUMNS; j++)
            {
                if(i >= array.length)
                {
                    break;
                }

                if(i == arrayPointer)
                {
                    rowHeader += "<TH>*</TH>";
                }
                else
                {
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

    this.Load = function(sourceCode)
    {
		this.startWhile = [];
        this.program = [];
		this.brackets = {};
		var depth = 0;
		var index = 0;

        for(var i = 0; i < sourceCode.length; i++)
        {
            switch(sourceCode[i])
            {
                case INCREMENT_DATA_POINTER :
                case DECREMENT_DATA_POINTER :
                case INCREMENT_DATA :
                case DECREMENT_DATA :
                case INPUT :
                case OUTPUT :
                {
                    this.program.push(sourceCode[i]);
					index++;
                    break;
                }                
                case WHILE_NOT_ZERO :
                {					
                    this.program.push(sourceCode[i]);
                    this.startWhile[depth] = index;
					depth++;
                    index++;
                    break;					
                }
                case END_WHILE :
                {					
                    this.program.push(sourceCode[i]);
					depth--;
					this.brackets[index] = this.startWhile[depth];
					this.brackets[this.startWhile[depth]] = index;
					index++;
                    break;					
                }
            }
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

    this.Step = function()
    {        
        switch (this.program[this.programPointer])
        {
            case INCREMENT_DATA_POINTER :
            {
                this.memoryPointer++;
                if (this.memoryPointer >= this.memory.length)
                {
                    alert("Memory overrun!");
                    return false;
                }
                this.programPointer++;
                
				break;
            }        
            case DECREMENT_DATA_POINTER :
            {
                this.memoryPointer--;
                if (this.memoryPointer < 0)
                {
					alert("Memory underrun!");
                    return false;
                }
                this.programPointer++;
                
				break;
            }
            case INCREMENT_DATA :
            {
                this.memory[this.memoryPointer]++;
                if(this.memory[this.memoryPointer] > 255)
                {
                    this.memory[this.memoryPointer] = this.memory[this.memoryPointer] % 256;
                }
                this.programPointer++;
                
				break;
            }
            case DECREMENT_DATA :
            {
                this.memory[this.memoryPointer]--;
                if(this.memory[this.memoryPointer] < 0)
                {
                    this.memory[this.memoryPointer] += 256;
                }
                this.programPointer++;
                
				break;
            }
            case OUTPUT :
            {
                var outputTextArea = document.getElementById('OutputTextArea');
                outputTextArea.value = outputTextArea.value + String.fromCharCode(this.memory[this.memoryPointer]);
                this.programPointer++;
                
				break;
            }
            case INPUT : 
            {
                var inputValue = -1;
                while(isNaN(inputValue) || (inputValue < 0) || (inputValue > 255))
                {
                    inputValue = parseInt(prompt('Enter a value (0-255)', 0));
                }
                
				this.memory[this.memoryPointer] = inputValue;
                this.programPointer++;
                
				break;
            }
            case WHILE_NOT_ZERO :
            {
				if (this.memory[this.memoryPointer] == 0)
				{
					this.programPointer = this.brackets[this.programPointer];
				}
                this.programPointer++;

                break;
            }
            case END_WHILE :
            {
				this.programPointer = this.brackets[this.programPointer];
                break;
            }            
        }
		
		var updateProgress =document.getElementById('ShowProgress');
		if(updateProgress.checked == true)
		{
			var programTable = document.getElementById('ProgramTable');
			var html = BrainFuck.GenerateTable(this.program, this.programPointer);
			programTable.innerHTML = html;  
			
			var memoryTable = document.getElementById('MemoryTable');
			var html = BrainFuck.GenerateTable(this.memory, this.memoryPointer);
			memoryTable.innerHTML = html;  
		}

        if (this.programPointer >= this.program.length)
        {			
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

    this.Run = function()
    {
        if(!BrainFuck.Step())
        {
            return;
        }
        window.setTimeout(BrainFuck.Run, 10);
    }

    this.RunAll = function()
    {
        while (BrainFuck.programPointer < BrainFuck.program.length)
        {
            if(!Step())
            {
                return;
            }
        }
    }
}