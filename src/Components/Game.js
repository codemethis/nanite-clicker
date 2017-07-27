import React, { Component } from 'react';

class Game extends Component {
	constructor() {
		super();

		this.state = {
			nanites: 0
		};
	}

	handleButtonClick = () => this.setState({nanites: this.state.nanites + 1});

	render() {
		return (
			<div>
				<h1>You have {this.state.nanites} nanites.</h1>
				<button onClick={this.handleButtonClick}>Click to generate nanite</button>
			</div>
		);
	}
}

export default Game;
