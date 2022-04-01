import React, { Component } from 'react';
import cookiesPolicy from '../../contents/cookiesPolicy';
import termsAndConditions from '../../contents/termsAndConditions';
import privacyPolicy from '../../contents/privacyPolicy';
import codeOfConduct from '../../contents/codeOfConduct.js';

const Contents = {
  'cookies-policy': cookiesPolicy,
  'terms-conditions': termsAndConditions,
  'privacy-policy': privacyPolicy,
  'code-conduct': codeOfConduct,
};

export default class Content extends Component {
  render() {
    const { topic } = this.props;
    const html = Contents[topic] || `<p>Cannot find the content!</p>`;

    return (
      <div className="page-content">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
}
