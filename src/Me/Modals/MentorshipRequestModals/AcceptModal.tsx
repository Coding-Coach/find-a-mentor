import Body from './style';
import { Modal } from '../Modal';
import { ReactComponent as MentorshipSvg } from '../../../assets/me/mentorship.svg';

type AcceptModalProps = {
  username: string;
  onClose(): void;
};

const AcceptModal = ({ username, onClose }: AcceptModalProps) => {
  return (
    <Modal center title="Mentorship Started" onClose={onClose}>
      <Body>
        <MentorshipSvg />
        <p>
          Awesome! You are now Mentoring <b>{username}!</b> Please make sure to
          follow our{' '}
          <a
            href="https://docs.google.com/document/d/1zKCxmIh0Sd4aWLiQncICOGm6uf38S0kJ0xb0qErNFVA/edit"
            target="_blank"
            rel="noreferrer"
          >
            Guidelines
          </a>{' '}
          and our{' '}
          <a
            href="https://github.com/Coding-Coach/find-a-mentor/blob/master/CODE_OF_CONDUCT.md#our-standards"
            target="_blank"
            rel="noreferrer"
          >
            Code of Conduct
          </a>
          .
        </p>
        <h3>What's next?</h3>
        <div>
          We just sent an email to <b>{username}</b> to inform them the happy
          news. In this email we also included one of your contact channels. At
          this point they also have access to your channels so they probably
          will contact you soon.
        </div>
      </Body>
    </Modal>
  );
};

export default AcceptModal;
