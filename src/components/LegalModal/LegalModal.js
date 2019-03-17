import React from 'react';
import { func, oneOf } from 'prop-types';
import ModalNew from '../Modals/ModalNew';
import { Panel, PanelContent } from '../Panels/Panel';
import PrivacyPolicy from '../../pages/static/PrivacyPolicy';
import CookiesPolicy from '../../pages/static/CookiesPolicy';
import TermsAndConditions from '../../pages/static/TermsAndConditions';

const titles = {
  terms: 'Terms & Conditions',
  cookies: 'Cookies',
  privacy: 'Privacy Policy',
};

function LegalModal({ onClose, page, t, showModal }) {
  let Content = CookiesPolicy;

  if (page === 'terms') {
    Content = TermsAndConditions;
  }

  if (page === 'privacy') {
    Content = PrivacyPolicy;
  }

  return (
    <ModalNew
      onClose={onClose}
      open={showModal}
      titles={titles}
      page={page}>
      <Panel>
        <PanelContent>
          <Content />
        </PanelContent>
      </Panel>
    </ModalNew>
  );
}

LegalModal.propTypes = {
  onClose: func,
  page: oneOf(['cookies', 'terms', 'privacy']).isRequired,
};

export default LegalModal;