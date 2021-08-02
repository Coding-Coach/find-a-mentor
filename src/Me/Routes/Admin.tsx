// THIS FILE IS WRITTEN UGLLLLY!!! DO NOT LEARN HOW TO CODE FROM IT!!!
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  freezeMentor,
  getAllMentorshipRequests,
  getUserRecords,
  sendMentorNotActive,
  sendStaledRequestEmail,
} from '../../api/admin';
import Card from '../components/Card';
import type { MentorshipUser, MentorshipRequest, User } from '../../types/models';
import {
  daysAgo,
  formatRequestTime,
  STATUS,
  Status,
} from '../../helpers/mentorship';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import FormField from '../components/FormField';
import Switch from '../../components/Switch/Switch';
import Input from '../components/Input';
import { getUser } from '../../api';
import { Loader } from '../../components/Loader';

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

const pending = (status: Status) =>
  status === STATUS.new || status === STATUS.viewed;

const UserDetails = ({
  userId,
  mentorships,
}: {
  userId: string;
  mentorships: MentorshipRequest[];
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dontActiveSent, setDontActiveSent] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    Promise.all([
      getUserRecords(userId),
      getUser(userId)
    ]).then(([recordsRes, userRes]) => {
      setUser(userRes);
      if (recordsRes?.success) {
        setDontActiveSent(
          !!recordsRes.data.find(
            ({ type }) => type === 1
          )
        );
      }
    })
    .finally(() => setIsLoading(false));
  }, [userId]);

  const showCard =
    (!user || user.available) &&
    mentorships.some(({ reminderSentAt }) => !!reminderSentAt) &&
    !mentorships.some(({ status }) => status === STATUS.approved || status === STATUS.rejected);

  return showCard ? (
    isLoading ? (
      <Loader />
    ) : (
      <Card>
        <div>{user!.name}</div>
        {dontActiveSent ? (
          <Button
            onClick={async () => {
              if (
                window.confirm('Are you sure you want to freeze this mentor?')
              ) {
                setUser({
                  ...user!,
                  available: false,
                });
                await freezeMentor(user!._id);
                toast.success('Done');
              }
            }}
          >
            Freeze Mentor
          </Button>
        ) : (
          <Button onClick={async () => {
            await sendMentorNotActive(user!._id);
            setDontActiveSent(true);
            toast.success('Done');
          }}>
            Send Not Active mail
          </Button>
        )}
      </Card>
    )
  ) : (
    <></>
  );
};


const Admin = () => {
  const [sentOnly, setSentOnly] = useState(false);
  const [showDaysAgo, setShowDaysAgo] = useState<number>(7);
  const [name, setName] = useState('');
  const [user, setUser] = useState<MentorshipUser>();
  const [mentorshipLoading, setMentorshipLoading] = useState<string | null>();
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);

  const filteredMentorshipRequests = useMemo(() => {
    return mentorshipRequests
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
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [mentorshipRequests, name, sentOnly, showDaysAgo]);

  useEffect(() => {
    getAllMentorshipRequests().then(response => {
      if (response?.success) {
        setMentorshipRequests(
          response.data.filter(({ mentor, mentee }) => !!mentor && !!mentee)
        );
      }
    });
  }, []);

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

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
      filteredMentorshipRequests.map(
        ({ mentor, mentee, status, date, id, reminderSentAt }) => {
          return (
            <tr key={id}>
              <td>
                <span onClick={() => setUser(mentor)}>{mentor.name}</span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`/?name=${mentor.name}`}
                >
                  🔗
                </a>
              </td>
              <td>
                <Mentee onClick={() => setUser(mentee)}>
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
                {pending(status) && (
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
    [filteredMentorshipRequests, mentorshipLoading, sendEmail]
  );

  return (
    <>
      {user && (
        <UserDetails userId={user.id} mentorships={filteredMentorshipRequests} />
      )}
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
    </>
  );
};

export default Admin;
