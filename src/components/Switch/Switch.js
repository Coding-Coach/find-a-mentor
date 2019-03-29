import React, { Component } from "react";

import "./Switch.css";

export default class Switch extends Component {
	state = {
		checked: false
	}

	toggleSwitch = () => {
		this.setState({
			checked: !this.state.checked	
		});
		this.props.onToggle(!this.state.checked);
	}

	render() {	
		const { id, label } = this.props;

		return (
		  <div className="switch-container">
		    <label htmlFor={id}>
		      {label}
		    </label>
		    <div className="switch-input">
			    <input type="checkbox"
		    		id={`switch-${id}`}
		    		checked={this.state.checked}
		    		onChange={this.toggleSwitch}
			    />
			    <label htmlFor={`switch-${id}`}>Toggle</label>
		    </div>
		  </div>
		);
	}
}