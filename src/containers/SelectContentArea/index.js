import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

class SelectContentArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await axios(
        'https://ephtracking.cdc.gov/apigateway/api/v1/contentareas/json'
      );
      this.setState({
        options: response.data
      })
    } catch (error) {
      console.error(error);
    }
  }

  handleChange(event) {
    this.props.handleSelect(event.target.value);
    this.setState({ value: event.target.value });
  }

  render() {
    const { value, options } = this.state;

    const optionsToRender = options.map((item, index) => (
      <option key={index} value={item.id}>
        {item.name}
      </option>
    ));
    optionsToRender.unshift(
      <option key="-1" value="" disabled>
        Select content area
      </option>
    );

    return (
      <div className="field">
        <label className="label">Content Area</label>
        <div className="control">
          <div className="select">
            <select value={value} onChange={this.handleChange}>
              {optionsToRender}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

SelectContentArea.propTypes = {
  handleSelect: PropTypes.func.isRequired
};

export default SelectContentArea;
