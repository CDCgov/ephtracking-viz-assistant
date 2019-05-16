import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class SelectIndicator extends Component {
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
    this.getOptions(this.props.contentAreaId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contentAreaId !== this.props.contentAreaId) {
      this.setState({ value: '' });
      this.getOptions(nextProps.contentAreaId);
    }
  }

  async getOptions(contentAreaId) {
    if (contentAreaId) {
      try {
        const response = await axios(
          `https://ephtracking.cdc.gov/apigateway/api/v1/indicators/${contentAreaId}`
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
    this.props.handleSelect(event.target.value);
    this.setState({ value: event.target.value });
  }

  render() {
    const { value, options } = this.state;
    const disabled = this.props.contentAreaId === null;

    const optionsToRender = options.map((item, index) => (
      <option key={index} value={item.id}>
        {item.name}
      </option>
    ));
    optionsToRender.unshift(
      <option key="-1" value="" disabled>
        Select indicator
      </option>
    );

    return (
      <div className="field">
        <label className="label">Indicator</label>
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

SelectIndicator.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  contentAreaId: PropTypes.string
};

export default SelectIndicator;
