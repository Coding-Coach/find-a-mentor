import { useState } from 'react';
import styled from 'styled-components/macro';
import { useApi } from '../../../context/apiContext/ApiContext';
import { useUser } from '../../../context/userContext/UserContext';
import Button from '../../../Me/components/Button';
import { maskEmail } from '../../../utils/maskSansitiveString';

type VerificationModalProps = {
  onSuccess: () => void;
  email: string;
};

const ModalText = styled.p`
  text-align: center;
  font-size: 16px;
  line-height: 1.5;
`;

export const VerificationModal = ({ onSuccess }: VerificationModalProps) => {
  const [loading, setLoading] = useState(false);
  const { emailVerifiedInfo } = useUser();
  const api = useApi();

  if (emailVerifiedInfo.isVerified === true) {
    // eslint-disable-next-line no-console
    console.warn('email is verified');
    return;
  }

  const send = async () => {
    setLoading(true);
    try {
      const result = await api.resendVerificationEmail();
      if (result.success) {
        onSuccess();
      }
    } catch {}
    setLoading(false);
  };

  return (
    <>
      <ModalText>
        Psst, we believe that you are who you say you are.
        <br />
        Just to make sure, we need you to verify your email.
        <h3>Recognize {maskEmail(emailVerifiedInfo.email)}?</h3>
        {emailVerifiedInfo.isRegisteredRecently ? (
          <>
            This is the address we sent a verification email to.
            <br />
            Can't find it? Hit the button
          </>
        ) : (
          <>Hit the button to send a verification email right to your inbox</>
        )}
        <p>
          <Button isLoading={loading} onClick={send}>
            Resend verification email
          </Button>
        </p>
      </ModalText>
    </>
  );
};
