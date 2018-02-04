$('.js-console-input').on('keydown', event => {
    if (event.which === 13) {
        var command = $('.js-console-input').val();
        $('.js-console-input').val('');
        runCommand(command);
    }
});

var commandHistory = [];
function runCommand(command) {
    command = command.trim();
    if (!command) return;
    var commandEntry = {command};
    commandHistory.push(commandEntry);
    processCommand(commandEntry);
    renderHistory();
}
function processCommand(commandEntry) {
    try {
        if (!commandEntry.program) {
            commandEntry.program = parseProgram(commandEntry.command);
            commandEntry.scope = makeRootScope();
        }
        if (commandEntry.result && commandEntry.result instanceof ProcessNode) {
            console.log('continuing');
            commandEntry.result = runProgramSteps(commandEntry.result, 20);
            console.log(commandEntry.result);
        } else {
            commandEntry.result = runProgram(commandEntry.program, commandEntry.scope, 20);
            console.log(commandEntry.result);
        }
        if (commandEntry.result instanceof ProcessNode) {
            setTimeout(() => processCommand(commandEntry), 100);
        }
    } catch (e) {
        console.log(e);
        logError(e);
    }
}
function logInfo(info) {
    commandHistory.push({info});
    renderHistory();
}
logInfo._mjsCallable = true;
function logError(error) {
    commandHistory.push({error});
}
function renderHistory() {
    commandHistory = commandHistory.slice(Math.max(0, commandHistory.length - 100), commandHistory.length);
    $('.js-console-log').html(commandHistory.map(node => {
         if (node.hasOwnProperty('info')) {
            return `<div style="color: yellow;">${node.info}</div>`;
         }
         if (node.error) {
            return `<div style="color: red;">${node.error}</div>`;
         }
         var result = `<div>&gt; ${node.command}</div>`;
         if (node.result && !(node.result instanceof ProcessNode)) result += `<div>${node.result}</div>`;
         return result;
     }).join(''));
    $('.js-console-log')[0].scrollTo(0, $('.js-console-log')[0].scrollHeight);
}

