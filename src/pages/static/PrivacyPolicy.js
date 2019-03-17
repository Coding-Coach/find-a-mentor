import React from 'react';
import MarkdownReader from '../../components/MarkdownReader/MarkdownReader';
import privacyPolicy from './PrivacyPolicy.md';

function PrivacyPolicy() {
  return <MarkdownReader content={privacyPolicy} />;
}

export default PrivacyPolicy;
