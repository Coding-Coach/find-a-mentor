import { useEffect, useState } from 'react';
import {
  getAllMentorshipRequests,
  sendStaledRequestEmail,
} from '../../api/admin';
import Card from '../components/Card';
import { MentorshipRequest } from '../../types/models';
import { formatRequestTime } from '../../helpers/mentorship';
import Button from '../components/Button';
import { toast } from 'react-toastify';

const Admin = () => {
  const [mentorshipLoading, setMentorshipLoading] = useState<string | null>();
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);

  useEffect(() => {
    getAllMentorshipRequests().then(response => {
      if (response?.success) {
        setMentorshipRequests(
          response.data.filter(({ mentor, mentee }) => !!mentor && !!mentee)
        );
      }
    });
  }, []);

  const sendEmail = async (mentorshipId: string) => {
    setMentorshipLoading(mentorshipId);
    await sendStaledRequestEmail(mentorshipId);
    setMentorshipRequests(
      mentorshipRequests.map(mentorship => {
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
    toast.success('Email sent');
  };

  const columns = [
    'Mentor',
    'Mentee',
    'Status',
    'Created',
    'Sent',
  ].map(column => <td key={column}>{column}</td>);

  const rows = mentorshipRequests
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ mentor, mentee, status, date, id, reminderSentAt }) => {
      const pending = status === 'New' || status === 'Viewed';
      return (
        <tr key={id}>
          <td>{mentor.name}</td>
          <td>{mentee.name}</td>
          <td>{status}</td>
          <td>{pending ? formatRequestTime(new Date(date)) : 0}</td>
          <td>
            {reminderSentAt ? formatRequestTime(new Date(reminderSentAt)) : 0}
          </td>
          <td>
            {pending && (
              <Button
                disabled={!!reminderSentAt}
                title={reminderSentAt && `Sent at ${new Date(reminderSentAt)}`}
                isLoading={id === mentorshipLoading}
                onClick={() => sendEmail(id)}
              >
                Send Email
              </Button>
            )}
          </td>
        </tr>
      );
    });

  return (
    <Card>
      {mentorshipRequests.length ? (
        <table>
          <thead>
            <tr>{columns}</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        <>No requests</>
      )}
    </Card>
  );
};

export default Admin;
