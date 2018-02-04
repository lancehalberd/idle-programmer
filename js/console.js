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
/*
function evaluateSimpleExpression(expression, logMethod) {
    expression = expression.trim();
    if (!isNaN(Number(expression))) return Number(expression);
    var first = expression.charAt(0);
    var last = expression.charAt(expression.length - 1);
    if (first === `'` && last === `'`) return expression.substring(1, expression.length - 1);
    if (first === `"` && last === `"`) return expression.substring(1, expression.length - 1);
    var parts = expression.trim().split('.');
    var node = {children: {ui: game}};
    while (parts.length) {
        var piece = parts.shift();
        if (piece.indexOf('(') >= 0) {
            var rest = piece + parts.join('.');
            parts = rest.split('(');
            var method = parts.shift();
            rest = '(' + parts.join('(');
            // Strip ( ) from the arguments
            var args = rest.substring(1, rest.length - 1);
            args = args ? args.split(',').map(arg => evaluateSimpleExpression(arg, logMethod)) : [];
            if (!(node[method] instanceof Function) || !node[method]._mjsCallable) {
                logMethod(`${method} is not a function.`);
                return undefined;
            }
            return node[method].apply(node, args);
        }
        let index = null;
        if (piece.indexOf('[') >= 0) {
            var pieces = piece.split(/\[|\]/);
            piece = pieces[0];
            index = pieces[1];
        }
        if (!node.children[piece]) {
            logMethod(`Could not read "${piece}" in ${expression}`);
            return undefined;
        }
        if (index === null) {
            node = node.children[piece];
        } else {
            if (!node.children[piece][index]) {
                logMethod(`Could not read index ${index} on "${piece}" in ${expression}`);
                return undefined;
            }
            node = node.children[piece][index];
        }
    }
    if (typeof node === 'string' || typeof node === 'number') return node;
    logMethod(`Could not read ${expression}`);
    return undefined;
}*/

