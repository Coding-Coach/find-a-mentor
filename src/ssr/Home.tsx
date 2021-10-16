import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type HomeData = {
  id: number;
  title: string;
}[];

export const getData = async (fetchMethod: (url: string) => Promise<any>) => {
  const todos = ((await (
    await fetchMethod('https://jsonplaceholder.typicode.com/todos')
  ).json()) as HomeData).slice(0, 5);

  return todos;
};

export const Home = ({ ssrData }: { ssrData: HomeData }) => {
  const [items, setItems] = useState<HomeData>(ssrData);

  useEffect(() => {
    if (ssrData) {
      return;
    }
    getData(fetch).then(setItems);
  }, [ssrData]);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Items</h1>
      <ul>
        {items.map(({ id, title }) => (
          <li key={id}>
            <Link to={`/s/${id}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
