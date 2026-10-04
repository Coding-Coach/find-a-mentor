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
import { deleteUserAccount, searchUsers, type UserSuggestion } from '../../api/admin';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

const AdminDeleteUser = () => {
  const api = useApi();
  const { isAdmin } = useUser();
  const { isReady, query: routeQuery } = useRouter();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [selected, setSelected] = useState<UserSuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // deep link: /me/admin/delete-user?userId=<id>
  useEffect(() => {
    if (!isReady || typeof routeQuery.userId !== 'string') {
      return;
    }
    let cancelled = false;
    api.getUser(routeQuery.userId).then((user) => {
      if (!cancelled && user) {
        setSelected(user as UserSuggestion);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isReady, routeQuery.userId, api]);

  // debounced autocomplete by name or email
  useEffect(() => {
    const term = search.trim();
    if (selected || term.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchUsers(api, term);
      if (!cancelled) {
        setSuggestions(results);
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, selected, api]);

  if (!isAdmin) {
    return <Card>Not authorized</Card>;
  }

  const onSelect = (user: UserSuggestion) => {
    setSelected(user);
    setSuggestions([]);
    setSearch('');
  };

  const onDelete = async () => {
    if (!selected) {
      return;
    }
    if (
      !window.confirm(
        `Delete ${selected.name} (${selected.email})? This permanently deletes the account and cannot be undone.`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    const deleted = await deleteUserAccount(api, selected._id);
    setIsDeleting(false);
    if (deleted) {
      toast.success(`${selected.name} was deleted`);
      setSelected(null);
    }
  };

  return (
    <Card>
      <FormField label="Find user by name or email">
        <Input
          value={search}
          onChange={(e) => {
            setSelected(null);
            setSearch(e.target.value);
          }}
          placeholder="Start typing a name or email"
          autoComplete="off"
        />
      </FormField>
      {isSearching && <Loader />}
      {!selected && suggestions.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
          {suggestions.map((user) => (
            <li key={user._id}>
              <button
                type="button"
                onClick={() => onSelect(user)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <strong>{user.name}</strong> &middot; {user.email}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <>
          <div>
            <strong>{selected.name}</strong>
          </div>
          <div>{selected.email}</div>
          <Button onClick={onDelete} isLoading={isDeleting}>
            Delete user
          </Button>
        </>
      )}
    </Card>
  );
};

export default AdminDeleteUser;
