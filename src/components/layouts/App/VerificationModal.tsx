import { useState } from 'react';
import { useApi } from '../../../context/apiContext/ApiContext';
import { useUser } from '../../../context/userContext/UserContext';
import Button from '../../../Me/components/Button';
import { maskEmail } from '../../../utils/maskSansitiveString';

type VerificationModalProps = {
  onSuccess: () => void;
  email: string;
};

export const VerificationModal = ({ onSuccess }: VerificationModalProps) => {
  const [loading, setLoading] = useState(false);
  const { emailVerifedInfo } = useUser();
  const api = useApi();

  if (emailVerifedInfo.isVerified === true) {
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
      <p>
        Please verify your email address ({maskEmail(emailVerifedInfo.email)})
        to continue using the platform.
      </p>
      <p>
        <Button isLoading={loading} onClick={send}>
          Resend verification email
        </Button>
      </p>
    </>
  );
};
