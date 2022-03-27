import Body from './style';
import { Modal } from '../Modal';
import MentorshipSvg from '../../../assets/me/mentorship.svg';
import { links } from '../../../config/constants';
import { report } from '../../../ga';

type AcceptModalProps = {
  username: string;
  menteeEmail: string;
  onClose(): void;
};

const AcceptModal = ({ username, menteeEmail, onClose }: AcceptModalProps) => {
  return (
    <Modal center title="Mentorship Started" onClose={onClose}>
      <Body>
        <MentorshipSvg />
        <p>
          Awesome! You are now Mentoring <b>{username}!</b> Please make sure to
          follow our{' '}
          <a
            href={links.MENTORSHIP_GUIDELINES}
            // eslint-disable-next-line react/jsx-no-target-blank
            target="_blank"
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
        <p id="menteeEmailLink">
            Have a question? Send an email to{' '}
          <a
            onClick={() => report('Member Area', 'Send Email', 'Mentorship')}
            href={`mailto:${menteeEmail}`}
          >
           {menteeEmail}
          </a>
        </p>
      </Body>
    </Modal>
  );
};

export default AcceptModal;
