import { FC, useState } from 'react';
import styled from 'styled-components';

const Style = {
  List: styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
  `,
};

export const useExpendableRichItems = () => {
  const [expandId, setExpandId] = useState('');

  const onSelect = (id: string) => {
    setExpandId(expandId === id ? '' : id);
  };

  return { expandId, onSelect };
};

export const RichList: FC = ({ children }) => {
  return <Style.List>{children}</Style.List>;
};

export default RichList;
