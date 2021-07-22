import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAllMentorshipRequests,
  sendStaledRequestEmail,
} from '../../api/admin';
import Card from '../components/Card';
import { MentorshipRequest } from '../../types/models';
import { daysAgo, formatRequestTime } from '../../helpers/mentorship';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import FormField from '../components/FormField';
import Switch from '../../components/Switch/Switch';
import Input from '../components/Input';

const Mentee = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;

  img {
    border-radius: 50%;
  }
`;

const includeStr = (str1: string, str2: string) =>
  str1.toLocaleLowerCase().includes(str2.toLocaleLowerCase());

const Filters = styled.div`
  width: 150px;
`;

const Admin = () => {
  const [sentOnly, setSentOnly] = useState(false);
  const [showDaysAgo, setShowDaysAgo] = useState<number>(7);
  const [name, setName] = useState('');
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

  const sendEmail = useCallback(
    async (mentorshipId: string) => {
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
    },
    [mentorshipRequests]
  );

  const columns = useMemo(
    () =>
      ['Mentor', 'Mentee', 'Status', 'Created', 'Sent'].map(column => (
        <td key={column}>{column}</td>
      )),
    []
  );

  const rows = useMemo(
    () =>
      mentorshipRequests
        .filter(({ reminderSentAt, mentor, mentee, date }) => {
          return (
            (!sentOnly || !!reminderSentAt) &&
            (!showDaysAgo ||
              name ||
              Math.floor(daysAgo(new Date(date))) === showDaysAgo) &&
            (!name ||
              includeStr(mentor.name, name) ||
              includeStr(mentee.name, name))
          );
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(({ mentor, mentee, status, date, id, reminderSentAt }) => {
          const pending = status === 'New' || status === 'Viewed';
          return (
            <tr key={id}>
              <td>
                <span onClick={() => setName(mentor.name)}>{mentor.name}</span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`/?name=${mentor.name}`}
                >
                  🔗
                </a>
              </td>
              <td>
                <Mentee onClick={() => setName(mentee.name)}>
                  <img src={mentee.avatar} width="20" alt="" />
                  {mentee.name}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`mailto:${mentee.email}`}
                  >
                    🔗
                  </a>
                </Mentee>
              </td>
              <td>{status}</td>
              <td>{formatRequestTime(new Date(date))}</td>
              <td>
                {reminderSentAt
                  ? formatRequestTime(new Date(reminderSentAt))
                  : 0}
              </td>
              <td>
                {pending && (
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
        }),
    [
      mentorshipLoading,
      mentorshipRequests,
      name,
      sendEmail,
      sentOnly,
      showDaysAgo,
    ]
  );

  return (
    <Card>
      <Filters>
        <FormField>
          <Switch
            isChecked={sentOnly}
            label="Sent Only"
            onToggle={setSentOnly}
            size="small"
          />
        </FormField>
        <FormField>
          <Input
            type="number"
            value={showDaysAgo}
            onChange={e => setShowDaysAgo(e.target.valueAsNumber || 0)}
          />
        </FormField>
        <FormField label="User">
          <Input
            type="search"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </FormField>
      </Filters>
      {rows.length ? (
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
