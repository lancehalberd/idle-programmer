class Component {
    constructor({path, key, index}) {
        this.path = path;
        this.key = key;
        this.index = index;
        this.children = {};
    }

    _mjsRead(key) {
        if (this.children[key]) return this.children[key];
        if (this[key] && this[key]._mjsCallable) return this[key];
    }
    _mjsEvaluate() {
        return `Instance of ${this.constructor.name}. Fields: ` + Object.keys(this.children).join(', ');
    }

    child(classOrFunction, props) {
        for (var k in props) {
            if (typeof props[k] !== 'string') continue;
            props[k] = this.expandExpression(props[k]);
        }
        if (!(classOrFunction.prototype instanceof Component)) {
            return classOrFunction(props);
        }
        if (!props.key) {
            throw new Error(`${classOrFunction} Component requires a key`);
        }
        props.path = (this.path || '') + props.key + '.';
        let instance;
        if (typeof props.index === 'number') {
            props.path = `${(this.path || '')}${props.key}[${props.index}].`;
            instance = new classOrFunction(props);
            this.children[props.key] = this.children[props.key] || [];
            this.children[props.key][props.index] = instance;
        } else {
            instance = new classOrFunction(props);
            this.children[props.key] = instance;
        }
        return instance.render();
    }

    expandExpression(expression) {
        return expression.replace('this.', this.path);
    }

    markToUpdate() {
        updateGameSections = true;
    }
}

var Button = ({action, label}) => {
    return `<button class="gameButton" action="${action}">${label}</button>`;
};

var Text = ({action}) => {
    var rootScope = makeRootScope();
    var value = parseAndRunProgram(action, rootScope, 20).abbreviate();
    return `<span class="textValue" action="${action}">${value}</span>`;
};
