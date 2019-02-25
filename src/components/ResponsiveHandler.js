import React, { Component } from 'react';
import { Responsive } from 'semantic-ui-react';

export class ResponsiveHandler extends Component {
  state = {
    width: 0,
  }

  handleOnUpdate = (e, { width }) => this.setState({ width })

  render() {
    const { width } = this.state;
    const isMobile = width <= Responsive.onlyMobile.maxWidth;

    return (
      <Responsive className={`device-${isMobile ? 'mobile' : 'desktop'}`} fireOnMount onUpdate={this.handleOnUpdate}>
        {this.props.children}
      </Responsive>
    );
  }
}