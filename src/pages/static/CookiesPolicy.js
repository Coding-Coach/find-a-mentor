import React from 'react';
import MarkdownReader from '../../components/MarkdownReader/MarkdownReader';
import cookiesPolicy from './CookiesPolicy.md';

function CookiesPolicy() {
  return <MarkdownReader content={cookiesPolicy} />;
}

export default CookiesPolicy;