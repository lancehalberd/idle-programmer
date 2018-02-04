var game = new Game({path: ''});

// Controls for the console/game resizing
var resizingX = null;
$('.verticalGrabBar').on('mousedown', event => {
    resizingX = event.pageX - $('.verticalGrabBar').offset().left;
    event.preventDefault();
});
$(document).on('mousemove', event => {
    if (resizingX === null) return;
    // Subtract 8 here because we want these values relative to their container,
    // which has 8 pixel margins, but event.pageX doesn't take that into consideration.
    var position = Math.min(1600, Math.max(200, event.pageX - 8 - resizingX));
    $('.verticalGrabBar').prev().css('width', `${position}px`);
    $('.verticalGrabBar').css('left', `${position}px`);
    $('.verticalGrabBar').next().css('left', `${position + 8}px`);
});
$(document).on('mouseup', event => {
    resizingX = null;
});

// Loop for updating the display of the game.
var updateGameSections = true;
var mainLoop = () => {
    if (state.cyclesChanged) {
        state.cyclesChanged = false;
        $('.js-cycles').text(state.cycles.abbreviate());
    }
    // Right now we have to update everything when the game changes...
    if (updateGameSections) {
        $('.js-gameSections').html(game.render());
        updateGameSections = false;
    }
};
setInterval(mainLoop, 20);

// Generic code for running actions on any elements with actions defined on them.
$('body').on('click', '[action]', function () {
    var action = $(this).attr('action');
    runCommand(action);
});

// Generic code for running actions on input elements that have submit-action defined on them.
$('body').on('keypress', '[submit-action]', function () {
    // We only care about pressing the enter/return key.
    if (event.which !== 13) return;
    var action = $(this).attr('submit-action');
    var value = $(this).val();
    if (isNaN(Number(value))) value = `"${value}"`;
    action = action.replace('{value}', value);
    runCommand(action);
});
