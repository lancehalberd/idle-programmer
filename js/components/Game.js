
class Game extends Component {
    render() {
        this.path = 'ui.';
        return this.child(Clicker, {key: 'clicker'}) + this.child(Adder, {key: 'adder'});
    }
}