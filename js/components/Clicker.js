
state.clicker = {
    range: 1,
    choices: [1]
};

function rerollClickerButtons(indexClicked) {
    var factors = [];
    for (var i = 1; i < state.clicker.choices.length; i++) factors.push(4 ** i);
    for (var i = 0; i < state.clicker.choices.length; i++) {
        let factor = 1;
        if (i !== indexClicked) {
            factor = factors.splice(_.random(factors.length - 1), 1)[0];
        }
        state.clicker.choices[i] = Math.floor((1 + Math.random()) * factor * state.clicker.range);
    }
    updateGameSections = true;
}

class Clicker extends Component {
    render() {
        return `<div class="gameSection">
                <div class="flexRow">
                    <div class="js-actions sectionActions">
                        ${this.child(ClickerRange, {key: 'range'})}
                        ${this.child(ClickerChoices, {key: 'choices'})}
                    </div>
                    <div class="sectionContent">
                        <div class="flexRow">
                            Generate cycles:
                        </div>
                        <div class="js-cycleButtonRow flexRow">
                            ${this.getButtons()}
                        </div>
                    </div>
                </div>
            </div>`;
    }
    getButtons() {
        const buttons = [];
        for (let index = 0; index < state.clicker.choices.length; index++) {
            buttons.push(this.child(ClickerButton, {'key': 'buttons', index}));
        }
        return buttons.join('');
    }
}

class ClickerButton extends Component {
    render() {
        return `<button class="js-cycleButton gameButton smallButton" action="${this.path}click();">
            ${state.clicker.choices[this.index]}
            </button>`;
    }
    click() {
        gainCycles(state.clicker.choices[this.index]);
        rerollClickerButtons(this.index);
        return true;
    }
}
ClickerButton.prototype.click._mjsCallable = true;

class ClickerRange extends BuyAction {
    renderHeader() {
        return `<span>
                Range ${this.child(Text, {action: 'this.minValue();'})} -
                ${this.child(Text, {action: 'this.maxValue();'})}
            </span>`;
    }
    price() {
        return 10 * state.clicker.range;
    }
    minValue() {
        return state.clicker.range;
    }
    maxValue() {
        return state.clicker.range * 2 - 1;
    }
    onBuy() {
        state.clicker.range++;
        this.markToUpdate();
        rerollClickerButtons(0);
        return true;
    }
}
ClickerRange.prototype.price._mjsCallable = true;
ClickerRange.prototype.minValue._mjsCallable = true;
ClickerRange.prototype.maxValue._mjsCallable = true;


class ClickerChoices extends BuyAction {
    renderHeader() {
        return `<span>Choices ${this.child(Text, {action: 'this.value();'})} </span>
                <span>Bonus x${this.child(Text, {action: 'this.bonus();'})} </span>`;
    }
    available() {
        return state.clicker.choices.length < 5;
    }
    price() {
        return 100 ** (state.clicker.choices.length);
    }
    value() {
        return state.clicker.choices.length;
    }
    bonus() {
        return 4 ** (state.clicker.choices.length - 1);
    }
    onBuy() {
        state.clicker.choices.push(0);
        this.markToUpdate();
        rerollClickerButtons(0);
        return true;
    }
}
ClickerChoices.prototype.price._mjsCallable = true;
ClickerChoices.prototype.value._mjsCallable = true;
ClickerChoices.prototype.bonus._mjsCallable = true;


