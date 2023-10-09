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
import type {
  MentorshipUser,
  MentorshipRequest,
  User,
  UserRecord,
} from '../../types/models';
import { STATUS, Status } from '../../helpers/mentorship';
import { daysAgo, formatTimeAgo } from '../../helpers/time';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import FormField from '../components/FormField';
import Switch from '../../components/Switch/Switch';
import Input from '../components/Input';
import { Loader } from '../../components/Loader';
import { getChannelInfo } from '../../channelProvider';
import { useApi } from '../../context/apiContext/ApiContext';

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
  const [dontActiveSent, setDontActiveSent] = useState<UserRecord>();
  const [user, setUser] = useState<User>();
  const api = useApi()

  useEffect(() => {
    Promise.all([getUserRecords(api, userId), api.getUser(userId)])
      .then(([recordsRes, userRes]) => {
        setUser(userRes);
        if (recordsRes?.success) {
          setDontActiveSent(recordsRes.data.find(({ type }: {type: any}) => type === 1));
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId, api]);

  const showCard =
    (!user || user.available) &&
    mentorships.some(({ reminderSentAt }) => !!reminderSentAt) &&
    !mentorships.some(
      ({ status }) => status === STATUS.approved || status === STATUS.rejected
    );

  return isLoading ? (
    <Loader />
  ) : showCard ? (
    <Card>
      <div>{user!.name}</div>
      {dontActiveSent ? (
        <>
          <div>Sent {formatTimeAgo(dontActiveSent.createdAt)}</div>
          <Button
            onClick={async () => {
              if (
                window.confirm('Are you sure you want to freeze this mentor?')
              ) {
                setUser({
                  ...user!,
                  available: false,
                });
                await freezeMentor(api, user!._id);
                toast.success('Done');
              }
            }}
          >
            Freeze Mentor
          </Button>
        </>
      ) : (
        <Button
          onClick={async () => {
            const record = await sendMentorNotActive(api, user!._id);
            setDontActiveSent(record);
            toast.success('Done');
          }}
        >
          Send Not Active mail
        </Button>
      )}
      {user?.channels.map((channel) => {
        const { url, icon } = getChannelInfo(channel);
        return (
          <div>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <i className={`fa fa-${icon}`} />
              {channel.id}
            </a>
          </div>
        );
      })}
    </Card>
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
  const api = useApi()

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
    getAllMentorshipRequests(api, 3).then((response: any) => {
      if (response?.success) {
        setMentorshipRequests(
          response.data.filter(({ mentor, mentee }: { mentor: any, mentee: any }) => !!mentor && !!mentee)
        );
      }
    });
  }, [showDaysAgo, api]);

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const sendEmail = useCallback(
    async (mentorshipId: string) => {
      setMentorshipLoading(mentorshipId);
      await sendStaledRequestEmail(api, mentorshipId);
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
      toast.success('Email sent');
    },
    [mentorshipRequests, api]
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
      filteredMentorshipRequests.map(
        ({ mentor, mentee, status, date, id, reminderSentAt }) => {
          return (
            <tr style={{ opacity: mentor.available ? 1 : 0.5 }} key={id}>
              <td>
                <span onClick={() => setUser(mentor)}>{mentor.name}</span>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`/u/${mentor.id}`}
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
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/u/${mentee.id}`}
                  >
                    @
                  </a>
                </Mentee>
              </td>
              <td>{status}</td>
              <td>{formatTimeAgo(new Date(date))}</td>
              <td>
                {reminderSentAt ? formatTimeAgo(new Date(reminderSentAt)) : 0}
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
        <UserDetails
          userId={user.id}
          mentorships={filteredMentorshipRequests}
        />
      )}
      <Card className='wide'>
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
              onChange={(e) => setShowDaysAgo(e.target.valueAsNumber || 0)}
            />
          </FormField>
          <FormField label="User">
            <Input
              type="search"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
