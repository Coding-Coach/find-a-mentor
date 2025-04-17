import { send } from './client';

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

export const sendApplocationDeclinedEmail = async ({ name, email, reason }: { name: string; email: string; reason: string; }) => {
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