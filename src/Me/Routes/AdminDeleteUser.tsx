import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Input from '../components/Input';
import { Loader } from '../../components/Loader';
import { useApi } from '../../context/apiContext/ApiContext';
import { useUser } from '../../context/userContext/UserContext';
import { deleteUserAccount } from '../../api/admin';
import type { User } from '../../types/models';

const AdminDeleteUser = () => {
  const api = useApi();
  const { isAdmin } = useUser();
  const { isReady, query } = useRouter();
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // deep link: /me/admin/delete-user?userId=<id>
  useEffect(() => {
    if (isReady && typeof query.userId === 'string') {
      setUserId(query.userId);
    }
  }, [isReady, query.userId]);

  useEffect(() => {
    setUser(null);
    if (!userId.trim()) {
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    api
      .getUser(userId.trim())
      .then((result) => !cancelled && setUser(result))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId, api]);

  if (!isAdmin) {
    return <Card>Not authorized</Card>;
  }

  const onDelete = async () => {
    if (!user) {
      return;
    }
    if (
      !window.confirm(
        `Delete ${user.name} (${user._id})? This permanently deletes the account and cannot be undone.`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    const deleted = await deleteUserAccount(api, user._id);
    setIsDeleting(false);
    if (deleted) {
      toast.success(`${user.name} was deleted`);
      setUser(null);
      setUserId('');
    }
  };

  return (
    <Card>
      <FormField label="User ID">
        <Input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
      </FormField>
      {isLoading && <Loader />}
      {!isLoading && userId.trim() && !user && <div>User not found</div>}
      {user && (
        <>
          <div>
            <strong>{user.name}</strong>
          </div>
          <div>{user.email}</div>
          <Button onClick={onDelete} isLoading={isDeleting}>
            Delete user
          </Button>
        </>
      )}
    </Card>
  );
};

export default AdminDeleteUser;
