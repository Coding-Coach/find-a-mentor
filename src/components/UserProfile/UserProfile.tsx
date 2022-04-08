import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components/macro';

import Card from '../Card/Card';
import Link from '../../components/Link/Link';
import { prefix } from '../../titleGenerator';
import { User } from '../../types/models';
import { mobile } from '../../Me/styles/shared/devices';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useMentors } from '../../context/mentorsContext/MentorsContext';
import { useRoutes } from '../../hooks/useRoutes';
import { getTitleTags } from '../../helpers/getTitleTags';
import { useApi } from '../../context/apiContext/ApiContext';

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

export const UserProfile = ({ user }: { user: User }) => {
  const title = `${prefix} | ${user?.name}`;
  const [, dispatch] = useFilters();
  const urls = useRoutes();
  const api = useApi();
  const { favorites, addFavorite } = useMentors();
  const [channels, setChannels] = useState<User["channels"]>([]);

  useEffect(() => {
    dispatch({ type: 'showFilters', payload: false });
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }
    // once #921 done, there is no need for that
    api.getUser(user?._id)
      .then(({channels}) => {
        setChannels(channels);
      });
  }, [api, user]);

  if (!user) {
    return (
      <p>
        User not found <Link href="/">back to home</Link>
      </p>
    );
  }

  return (
    <UserProfileContainer>
      <Head>{getTitleTags(title)}</Head>
      <Link href={urls.root.get()}>Back to mentors list</Link>
      <Card
        appearance="extended"
        mentor={{
          ...user,
          channels,
        }}
        onFavMentor={addFavorite}
        isFav={favorites.indexOf(user._id) > -1}
      />
    </UserProfileContainer>
  );
};
