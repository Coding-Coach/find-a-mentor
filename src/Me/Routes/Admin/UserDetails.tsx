import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMentorshipRequests, getUser } from '../../../api';
import {
  freezeMentor,
  getUserRecords,
  sendMentorNotActive,
} from '../../../api/admin';
import { getChannelInfo } from '../../../channelProvider';
import { Loader } from '../../../components/Loader';
import { MentorshipRequest, User, UserRecord } from '../../../types/models';
import Button from '../../components/Button';
import { RequestsTable } from './components/RequestsTable';

export const UserDetails = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const { id: userId } = useParams<{ id: string }>();
  const [dontActiveSent, setDontActiveSent] = useState<UserRecord>();
  const [reminderSent, setReminderSent] = useState(false);
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);

  const ActionButton = () => {
    const [loading, setLoading] = useState(false);

    if (!user || !user.available) {
      return null;
    }
    if (dontActiveSent) {
      return (
        <Button
          disabled={loading}
          onClick={async () => {
            if (
              window.confirm('Are you sure you want to freeze this mentor?')
            ) {
              setUser({
                ...user!,
                available: false,
              });
              setLoading(true);
              await freezeMentor(user!._id);
              toast.success('Done');
            }
          }}
        >
          Freeze Mentor
        </Button>
      );
    }
    if (reminderSent) {
      return (
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const record = await sendMentorNotActive(user!._id);
            setDontActiveSent(record);
            setMentorshipRequests(requests => {
              return requests.map(request => {
                return {
                  ...request,
                  mentor: {
                    ...request.mentor,
                    available: false,
                  }
                }
              });
            })
            toast.success('Done');
          }}
        >
          Send Not Active mail
        </Button>
      );
    }

    return null;
  };

  const Channels = () => {
    return (
      <>
        {user?.channels.map((channel) => {
          const { url, icon } = getChannelInfo(channel);
          return (
            <div key={channel.id}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <i className={`fa fa-${icon}`} />
                {channel.id}
              </a>
            </div>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    Promise.all([
      getUserRecords(userId),
      getUser(userId),
      getMentorshipRequests<MentorshipRequest[]>(userId),
    ])
      .then(([recordsRes, userRes, mentorships]) => {
        setUser(userRes);
        setMentorshipRequests(mentorships.reverse() /* new to old */);
        setReminderSent(mentorships.some(({ reminderSentAt }) => !!reminderSentAt));

        if (recordsRes?.success) {
          setDontActiveSent(recordsRes.data.find(({ type }) => type === 1));
        }
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to={`/`}>Back</Link>
          <h3>{user!.name}</h3>
          <ActionButton />
        </div>
        <div>
          <Channels />
        </div>
      </div>
      <hr />
      <RequestsTable requests={mentorshipRequests} onSendReminder={() => setReminderSent(true)} />
    </>
  );
};
