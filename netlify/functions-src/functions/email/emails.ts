import type { User } from '../common/interfaces/user.interface';
import { send } from './client';

export const sendEmailVerification = async ({ name, email, link }: { name: string; email: string; link: string; }) => {
  return send({
    name: 'email-verification',
    to: email,
    subject: 'Verify your email address',
    data: {
      name,
      link,
    },
  });
}

export const sendMentorApplicationReceived = async ({ name, email }: { name: string; email: string; }) => {
  return send({
    name: 'mentor-application-received',
    to: email,
    subject: 'Mentor Application Received',
    data: {
      name,
    },
  });
}

export const sendApplicationApprovedEmail = async ({ name, email }: { name: string; email: string; }) => {
  return send({
    name: 'mentor-application-approved',
    to: email,
    subject: 'Mentor Application Approved 🥳',
    data: {
      name: name,
    },
  });
}

export const sendApplicationDeclinedEmail = async ({ name, email, reason }: { name: string; email: string; reason: string; }) => {
  return send({
    name: 'mentor-application-declined',
    to: email,
    subject: 'Mentor Application Declined 😢',
    data: {
      name,
      reason,
    },
  });
}

export const sendMentorshipRequest = async ({ menteeName, mentorName, email, background, expectation, menteeEmail, message }: { menteeName: string; mentorName: string; email: string; background: string; expectation: string; menteeEmail: string; message: string; }) => {
  return send({
    name: 'mentorship-requested',
    to: email,
    subject: 'Mentorship Request',
    data: {
      menteeName,
      mentorName,
      background,
      expectation,
      menteeEmail,
      message,
    },
  });
}

export const sendMentorshipAccepted = async ({ menteeName, mentorName, email, contactURL, openRequests }: { menteeName: string; mentorName: string; email: string; contactURL: string; openRequests: number; }) => {
  return send({
    name: 'mentorship-accepted',
    to: email,
    subject: 'Mentorship Accepted',
    data: {
      menteeName,
      mentorName,
      contactURL,
      openRequests,
    },
  });
}

export const sendMentorshipDeclined = async ({ menteeName, mentorName, email, bySystem, reason }: { menteeName: string; mentorName: string; email: string; bySystem: boolean; reason: string; }) => {
  return send({
    name: 'mentorship-declined',
    to: email,
    subject: 'Mentorship Declined',
    data: {
      menteeName,
      mentorName,
      bySystem,
      reason,
    },
  });
}

export const sendMentorshipRequestCancelled = async ({ menteeName, mentorName, email, reason }: { menteeName: string; mentorName: string; email: string; reason: string; }) => {
  return send({
    name: 'mentorship-cancelled',
    to: email,
    subject: 'Mentorship Request Cancelled',
    data: {
      menteeName,
      mentorName,
      reason,
    },
  });
}

export const sendMentorApplicationAdminNotification = async (user: User) => {
  console.log('Sending mentor application admin notification:', user);
  return send({
    name: 'mentor-application-admin-notification',
    to: 'noreply@codingcoach.io',
    subject: 'New Mentor Application Submitted',
    data: user,
  });
};
