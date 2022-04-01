import { GetServerSideProps } from 'next';
import ApiService from '../../src/api';
import App from '../../src/components/layouts/App';
import { UserProfile } from '../../src/components/UserProfile/UserProfile';
import { User } from '../../src/types/models';

type UserPageProps = {
  user: User;
};

function UserPage({ user }: UserPageProps) {
  return (
    <App>
      <UserProfile user={user} />
    </App>
  );
}

export default UserPage;

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  const { id } = context.query;
  // TODO - should mock ApiService on SSR more generally
  const api = new ApiService({
    getIdToken: () => '',
  });
  const user = await api.getUser(Array.isArray(id) ? id[0] : id);

  return {
    props: {
      user,
    },
  };
};
