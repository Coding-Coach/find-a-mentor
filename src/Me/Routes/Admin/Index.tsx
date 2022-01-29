// THIS FILE IS WRITTEN UGLLLLY!!! DO NOT LEARN HOW TO CODE FROM IT!!!
import { useEffect, useMemo, useState } from 'react';
import { getAllMentorshipRequests } from '../../../api/admin';
import Card from '../../components/Card';
import type { MentorshipRequest } from '../../../types/models';
import { daysAgo } from '../../../helpers/time';
import styled from 'styled-components';
import FormField from '../../components/FormField';
import Switch from '../../../components/Switch/Switch';
import Input from '../../components/Input';
import { UserDetails } from './UserDetails';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { RequestsTable } from './components/RequestsTable';

const includeStr = (str1: string, str2: string) =>
  str1.toLocaleLowerCase().includes(str2.toLocaleLowerCase());

const Filters = styled.div`
  width: 150px;
`;

const Admin = () => {
  const [sentOnly, setSentOnly] = useState(false);
  const [showDaysAgo, setShowDaysAgo] = useState<number>(0);
  const [name, setName] = useState('');
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
    getAllMentorshipRequests().then((response) => {
      if (response?.success) {
        setMentorshipRequests(
          response.data.filter(({ mentor, mentee }) => !!mentor && !!mentee)
        );
      }
    });
  }, []);

  return (
    <>
      <Card>
        <Router basename="/me/admin">
          <Route path="/user/:id">
            <UserDetails />
          </Route>
          <Route exact path="/">
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
            <RequestsTable requests={filteredMentorshipRequests} />
          </Route>
        </Router>
      </Card>
    </>
  );
};

export default Admin;
