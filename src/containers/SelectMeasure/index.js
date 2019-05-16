import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class SelectMeasure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  componentDidMount() {
    this.getOptions(this.props.indicatorId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indicatorId !== this.props.indicatorId) {
      this.setState({ value: '' });
      this.getOptions(nextProps.indicatorId);
    }
  }

  async getOptions(indicatorId) {
    if (indicatorId) {
      try {
        const response = await axios(
          `https://ephtracking.cdc.gov/apigateway/api/v1/measures/${indicatorId}`
        );
        this.setState({
          options: response.data
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  handleChange(event) {
    const title = this.state.options
      .find(o => o.id === event.target.value)
      .name;
    this.props.handleSelect(event.target.value, title);
    this.setState({ value: event.target.value });
  }

  render() {
    const { value, options } = this.state;
    const disabled = this.props.indicatorId === null;

    const optionsToRender = options.map((item, index) => (
      <option key={index} value={item.id}>
        {item.name}
      </option>
    ));
    optionsToRender.unshift(
      <option key="-1" value="" disabled>
        Select measure
      </option>
    );

    return (
      <div className="field">
        <label className="label">Measure</label>
        <div className="control">
          <div className="select">
            <select
              value={value}
              onChange={this.handleChange}
              disabled={disabled}
            >
              {optionsToRender}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

SelectMeasure.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  indicatorId: PropTypes.string
};

export default SelectMeasure;
