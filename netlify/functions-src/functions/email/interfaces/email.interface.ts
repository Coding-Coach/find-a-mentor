import type { MailData } from '@sendgrid/helpers/classes/mail';
import type { User } from '../../common/interfaces/user.interface';

interface WelcomePayload {
  name: 'welcome';
  data: {
    name: string;
  };
}

interface MentorshipAccepted {
  name: 'mentorship-accepted';
  data: {
    menteeName: string;
    mentorName: string;
    contactURL: string;
    openRequests: number;
  };
}

interface MentorshipCancelled {
  name: 'mentorship-cancelled';
  data: {
    mentorName: string;
    menteeName: string;
    reason: string;
  };
}

interface MentorshipDeclined {
  name: 'mentorship-declined';
  data: {
    menteeName: string;
    mentorName: string;
    reason: string;
    bySystem: boolean;
  };
}

interface MentorshipRequested {
  name: 'mentorship-requested';
  data: {
    menteeName: string;
    menteeEmail: string;
    mentorName: string;
    message: string;
    background: string;
    expectation: string;
  };
}

interface MentorshipReminder {
  name: 'mentorship-reminder';
  data: {
    menteeName: string;
    mentorName: string;
    message: string;
  };
}

interface MentorApplicationReceived {
  name: 'mentor-application-received';
  data: {
    name: string;
  };
}

interface MentorApplicationDeclined {
  name: 'mentor-application-declined';
  data: {
    name: string;
    reason: string;
  };
}

interface MentorApplicationApproved {
  name: 'mentor-application-approved';
  data: {
    name: string;
  };
}

interface MentorNotActive {
  name: 'mentor-not-active';
  data: {
    mentorName: string;
    numOfMentorshipRequests: number;
  };
}

interface MentorFreeze {
  name: 'mentor-freeze';
  data: {
    mentorName: string;
  };
}

interface EmailVerification {
  name: 'email-verification';
  data: {
    name: string;
    link: string;
  };
}

export type EmailParams = Required<Pick<MailData, 'to' | 'subject'>> &
  (
    | WelcomePayload
    | MentorshipAccepted
    | MentorshipCancelled
    | MentorshipDeclined
    | MentorshipRequested
    | MentorshipReminder
    | MentorApplicationReceived
    | MentorApplicationDeclined
    | MentorApplicationApproved
    | MentorNotActive
  | EmailVerification
    | MentorFreeze
  );

/**
 * Data for SendGrid templates, when an admin rejects a mentor from the platform.
 */
export interface SendDataRejectParams {
  reason: string;
}

/**
 * Data for SendGrid templates, when a user request a mentorship.
 */
export interface SendDataMentorshipParams {
  name: string;
  message: string;
}

export interface SendDataMentorshipApprovalParams {
  menteeName: string;
  mentorName: string;
  contactURL: string;
  channels: User['channels'];
}

export interface SendDataMentorshipRejectionParams {
  menteeName: string;
  mentorName: string;
  reason: string;
}

export interface SendData {
  to: string;
  subject: string;
  html: string;
}