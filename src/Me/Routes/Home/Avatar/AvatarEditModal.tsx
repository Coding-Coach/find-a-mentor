import React, { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { Modal } from '../../../Modals/Modal';
import { toast } from 'react-toastify';
import { report } from '../../../../ga';
import messages from '../../../../messages';
import { getAvatarProviderInfo } from '../../../../helpers/authProvider';

type AvatarEditModalProps = {
  isOpen: boolean;
  currentAvatar?: string;
  auth0Id?: string;
  onClose: () => void;
  onSave: (avatarUrl: string) => Promise<void>;
  isSaving?: boolean;
};

const AvatarEditModal: FC<AvatarEditModalProps> = ({
  isOpen,
  currentAvatar = '',
  auth0Id,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const providerInfo = getAvatarProviderInfo(auth0Id);

  if (!isOpen) {
    return null;
  }

  const handleSave = async () => {
    report('Avatar', 'save custom avatar url');
    try {
      await onSave(avatarUrl);
    } catch (error) {
      toast.error(messages.GENERIC_ERROR);
    }
  };

  const handleClear = () => {
    setAvatarUrl('');
  };

  const handleClose = () => {
    setAvatarUrl(currentAvatar);
    onClose();
  };

  return (
    <Modal
      title="Change Avatar"
      onClose={handleClose}
      onSave={handleSave}
      submitLabel={isSaving ? 'Saving...' : 'Save'}
      isLoading={isSaving}
      center={true}
    >
      <ModalContent>
        <InputWrapper>
          <AvatarInput
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            autoFocus
          />
          {avatarUrl && (
            <ClearButton onClick={handleClear} type="button" disabled={isSaving}>
              ×
            </ClearButton>
          )}
        </InputWrapper>

        <HelpText>
          Enter any public image URL (Gravatar, Imgur, etc.) or leave empty to use your default profile picture
        </HelpText>

        <LinkSection>
          Change your avatar on{' '}
          <ProviderLink href={providerInfo.url} target="_blank" rel="noopener noreferrer">
            {providerInfo.label}
          </ProviderLink>
        </LinkSection>
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const AvatarInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #179a6f;
    box-shadow: 0 0 0 2px rgba(23, 154, 111, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: #666;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const LinkSection = styled.div`
  font-size: 13px;
  color: #666;
`;

const ProviderLink = styled.a`
  color: #179a6f;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export default AvatarEditModal;
