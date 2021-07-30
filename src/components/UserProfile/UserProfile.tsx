import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Card from '../Card/Card';
import { Loader } from '../Loader';
import { getUser } from '../../api';
import { Mentor, User } from '../../types/models';

type UserProfileProps = {
  favorites: string[];
  onFavMentor(mentor: Mentor): void;
};

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const UserProfileLoader = styled(Loader)`
  font-size: 1.5rem;
`;

export const UserProfile = ({ favorites, onFavMentor }: UserProfileProps) => {
  const [user, setUser] = useState<User>();
  const location = useLocation<{ mentor: Mentor }>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchMentorIfNeed() {
      if (!location.state?.mentor) {
        const userFromAPI = await getUser(id);
        if (userFromAPI) {
          setUser(userFromAPI);
        }
      }
    }
    fetchMentorIfNeed();
  }, [id, location.state]);

  return (
    <UserProfileContainer>
      <Link to={`/`}>Back to mentors list</Link>
      {user ? (
        <Card
          mentor={user}
          onFavMentor={onFavMentor}
          isFav={favorites.indexOf(user._id) > -1}
        />
      ) : (
        <UserProfileLoader size={2} />
      )}
    </UserProfileContainer>
  );
};
