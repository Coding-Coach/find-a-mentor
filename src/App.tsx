import { useState } from 'react';

export const App = () => {
  const [title, setTitle] = useState('Hello World');
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {title}
    </div>
  );
};
