import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components/macro';
import { useRouter } from 'next/router';

import Card from '../Card/Card';
import Link from '../../components/Link/Link';
import { Loader } from '../Loader';
import { prefix } from '../../titleGenerator';
import { User } from '../../types/models';
import { mobile } from '../../Me/styles/shared/devices';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useApi } from '../../context/apiContext/ApiContext';
import { useMentors } from '../../context/mentorsContext/MentorsContext';
import {urls} from '../../utils/routes'


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

export const UserProfile = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const { query } = useRouter();
  const { id } = query;
  const [, dispatch] = useFilters();
  const api = useApi();
  const { favorites, addFavorite } = useMentors();

  useEffect(() => {
    dispatch({ type: 'showFilters', payload: false });
  }, [dispatch]);

  useEffect(() => {
    async function fetchMentor() {
      const userFromAPI = await api.getUser(id);
      if (userFromAPI) {
        setUser(userFromAPI);
      }
      setIsLoading(false);
    }
    if (id) {
      fetchMentor();
    }
  }, [id, api]);

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
      <Link href={urls.root.get()}>Back to mentors list</Link>
      <Card
        appearance="extended"
        mentor={user}
        onFavMentor={addFavorite}
        isFav={favorites.indexOf(user._id) > -1}
      />
    </UserProfileContainer>
  );
};
