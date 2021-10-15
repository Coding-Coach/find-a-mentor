import { useState, useEffect } from 'react';

// TODO, I don't know how to fetch in server

type AppProps = {
  ssrItems?: {
    id: number;
    title: string;
  }[];
};

const useSSREffect = () => {};

export const App = ({ ssrItems }: AppProps) => {
  const [items, setItems] = useState<AppProps['ssrItems']>(ssrItems);
  const [title, setTitle] = useState('Hello World');

  useEffect(() => {
    if (items) {
      return;
    }
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => setItems(json));
  }, []);

  if (!items) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{title}</h3>
          <p>{item.title}</p>
        </div>
      ))}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {title}
    </div>
  );
};
