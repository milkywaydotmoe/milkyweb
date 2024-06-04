function runBrainFuck() {
    const code = document.getElementById('code').value;
    const input = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');
    let output = '';
    const memory = new Uint8Array(30000);
    let pointer = 0;
    let codePointer = 0;
    let inputPointer = 0;
    const loops = [];

    while (codePointer < code.length) {
        const command = code[codePointer];
        switch (command) {
            case '>':
                pointer++;
                break;
            case '<':
                pointer--;
                break;
            case '+':
                memory[pointer]++;
                break;
            case '-':
                memory[pointer]--;
                break;
            case '.':
                output += String.fromCharCode(memory[pointer]);
                break;
            case ',':
                if (inputPointer < input.length) {
                    memory[pointer] = input.charCodeAt(inputPointer);
                    inputPointer++;
                } else {
                    memory[pointer] = 0;
                }
                break;
            case '[':
                if (memory[pointer] === 0) {
                    let openBrackets = 1;
                    while (openBrackets > 0) {
                        codePointer++;
                        if (code[codePointer] === '[') openBrackets++;
                        if (code[codePointer] === ']') openBrackets--;
                    }
                } else {
                    loops.push(codePointer);
                }
                break;
            case ']':
                if (memory[pointer] !== 0) {
                    codePointer = loops[loops.length - 1];
                } else {
                    loops.pop();
                }
                break;
        }
        codePointer++;
    }

    outputDiv.innerHTML = output || 'Output will be displayed here...';
}