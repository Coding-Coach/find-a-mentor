import { useEffect, useState } from 'react';
import { getAllMentorshipRequests } from '../../api/admin';
import Card from '../components/Card';
import { MentorshipRequest } from '../../types/models';
import { formatRequestTime } from '../../helpers/mentorship';

const Admin = () => {
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipRequest[]
  >([]);
  useEffect(() => {
    getAllMentorshipRequests().then(response => {
      if (response?.success) {
        setMentorshipRequests(response.data);
      }
    });
  }, []);

  const columns = ['Mentor', 'Mentee', 'Status', 'Opened'].map(column => (
    <td>{column}</td>
  ));

  const rows = mentorshipRequests
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map(({ mentor, mentee, status, createdAt }) => (
      <tr>
        <td>{mentor.name}</td>
        <td>{mentee.name}</td>
        <td>{status}</td>
        <td>
          {status === 'New' || status === 'Viewed'
            ? formatRequestTime(new Date(createdAt))
            : 0}
        </td>
      </tr>
    ));

  return (
    <Card>
      {mentorshipRequests.length ? (
        <table>
          <thead>
            <tr>{columns}</tr>
          </thead>
          {rows}
        </table>
      ) : (
        <>No requests</>
      )}
    </Card>
  );
};

export default Admin;
