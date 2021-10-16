import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type UserData = {
  id: number;
  title: string;
};

export const getData = async (
  fetchMethod: (url: string) => Promise<any>,
  id: string
) => {
  const todo = (await (
    await fetchMethod(`https://jsonplaceholder.typicode.com/todos/${id}`)
  ).json()) as UserData;

  return todo;
};

export const User = ({ ssrData }: { ssrData: UserData }) => {
  const [item, setItem] = useState(ssrData);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (ssrData) {
      return;
    }
    getData(fetch, id).then(setItem);
  }, [ssrData, id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link to="/">Home</Link>
      <h1>{item.title}</h1>
      <p>{item.id}</p>
    </>
  );
};
