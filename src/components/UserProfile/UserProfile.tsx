import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import { useLocation, useParams } from 'react-router-dom';
import Link from 'next/link';

import Card from '../Card/Card';
import { Loader } from '../Loader';
import { prefix } from '../../titleGenerator';
import { Mentor, User } from '../../types/models';
import { mobile } from '../../Me/styles/shared/devices';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useApi } from '../../context/apiContext/ApiContext';

type UserProfileProps = {
  favorites: string[];
  onFavMentor(mentor: Mentor): void;
};

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  padding: 0 18px;

  @media ${mobile} {
    width: 100%;
  }
`;

const UserProfileLoader = styled(Loader)`
  font-size: 1.5rem;
  margin-top: 15px;
`;

export const UserProfile = ({ favorites, onFavMentor }: UserProfileProps) => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation<{ mentor: Mentor }>();
  const { id } = useParams<{ id: string }>();
  const [, dispatch] = useFilters();
  const api = useApi()

  useEffect(() => {
    dispatch({ type: 'showFilters', payload: false });
  }, [dispatch]);

  useEffect(() => {
    async function fetchMentorIfNeed() {
      if (!location.state?.mentor) {
        const userFromAPI = await api.getUser(id);
        if (userFromAPI) {
          setUser(userFromAPI);
        }
        setIsLoading(false);
      }
    }
    fetchMentorIfNeed();
  }, [id, location.state, api]);

  if (isLoading) {
    return <UserProfileLoader size={2} />;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <UserProfileContainer>
      <Helmet>
        <title>{`${prefix} | ${user?.name}`}</title>
      </Helmet>
      <Link href="/">Back to mentors list</Link>
      <Card
        appearance="extended"
        mentor={user}
        onFavMentor={onFavMentor}
        isFav={favorites.indexOf(user._id) > -1}
      />
    </UserProfileContainer>
  );
};
