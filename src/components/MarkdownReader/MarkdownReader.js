import React from 'react';
import { string } from 'prop-types';
import remark from 'remark';
import remark2react from 'remark-react';

class MarkdownReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '# Loading...',
    };
  }

  componentDidMount() {
    fetch(this.props.content)
      .then((res) => res.text())
      .then((text) => this.setState({ text }));
  }

  render() {
    return (
      <div>
        {
          remark()
            .use(remark2react)
            .processSync(this.state.text).contents
        }
      </div>
    );
  }
}

MarkdownReader.propTypes = {
  content: string, // a URL to a .md file
};

export default MarkdownReader;
