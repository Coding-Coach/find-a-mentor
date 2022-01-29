import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components/macro';
import { sendStaledRequestEmail } from '../../../../api/admin';
import { STATUS, Status } from '../../../../helpers/mentorship';
import { formatTimeAgo } from '../../../../helpers/time';
import { MentorshipRequest, MentorshipUser } from '../../../../types/models';
import Button from '../../../components/Button';

type RequestsTableParams = {
  requests: MentorshipRequest[];
  onSendReminder?: () => void;
};

const Mentee = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;

  img {
    border-radius: 50%;
  }
`;

const isPending = (status: Status) => {
  return status === STATUS.new || status === STATUS.viewed;
};

export const RequestsTable = ({ requests, onSendReminder }: RequestsTableParams) => {
  const history = useHistory();
  const [mentorshipLoading, setMentorshipLoading] = useState<string | null>();
  const [mentorshipRequests, setMentorshipRequests] = useState(requests);

  useEffect(() => {
    setMentorshipRequests(requests);
  }, [requests]);

  const navigateToUser = useCallback(
    (mentor: MentorshipUser) => {
      history.push(`/user/${mentor.id}`);
    },
    [history]
  );

  const sendEmail = useCallback(
    async (mentorshipId: string) => {
      setMentorshipLoading(mentorshipId);
      await sendStaledRequestEmail(mentorshipId);
      setMentorshipRequests(
        mentorshipRequests.map((mentorship) => {
          if (mentorship.id === mentorshipId) {
            return {
              ...mentorship,
              reminderSentAt: new Date().toString(),
            };
          }
          return mentorship;
        })
      );
      setMentorshipLoading(null);
      onSendReminder?.();
      toast.success('Email sent');
    },
    [mentorshipRequests, onSendReminder]
  );

  const columns = useMemo(
    () =>
      ['Mentor', 'Mentee', 'Status', 'Created', 'Sent'].map((column) => (
        <td key={column}>{column}</td>
      )),
    []
  );

  const rows = useMemo(
    () =>
      mentorshipRequests.map(
        ({ mentor, mentee, status, date, id, reminderSentAt }) => {
          return (
            <tr style={{ opacity: mentor.available ? 1 : 0.5 }} key={id}>
              <td>
                {mentor ? (
                  <>
                    <span onClick={() => navigateToUser(mentor)}>
                      {mentor.name}
                    </span>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`/u/${mentor.id}`}
                    >
                      🔗
                    </a>
                  </>
                ) : 'User deleted'}
              </td>
              <td>
                {mentee ? (
                  <Mentee onClick={() => navigateToUser(mentee)}>
                    <img src={mentee.avatar} width="20" alt="" />
                    {mentee.name}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`mailto:${mentee.email}`}
                    >
                      🔗
                    </a>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`/u/${mentee.id}`}
                    >
                      @
                    </a>
                  </Mentee>
                ) : 'User deleted'}
              </td>
              <td>{status}</td>
              <td>{formatTimeAgo(new Date(date))}</td>
              <td>
                {reminderSentAt ? formatTimeAgo(new Date(reminderSentAt)) : 0}
              </td>
              <td>
                {isPending(status) && (
                  <Button
                    disabled={!!reminderSentAt}
                    title={
                      reminderSentAt && `Sent at ${new Date(reminderSentAt)}`
                    }
                    isLoading={id === mentorshipLoading}
                    onClick={() => sendEmail(id)}
                  >
                    Send Email
                  </Button>
                )}
              </td>
            </tr>
          );
        }
      ),
    [mentorshipLoading, mentorshipRequests, navigateToUser, sendEmail]
  );

  if (!rows.length) {
    return <>No requests</>;
  }

  return (
    <table id="request-table">
      <thead>
        <tr>{columns}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
