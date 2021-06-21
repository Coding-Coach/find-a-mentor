import { useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

type RichListProps = {
  render: (props: { onSelect: (id: string) => void; expandId: string }) => ReactNode;
};

const Style = {
  List: styled.ul`
    padding: 0;
    margin: 0;
    list-style: none;
  `,
};

export const RichList = ({ render }: RichListProps) => {
  const [expandId, setExpandId] = useState('');

  const onSelect = (id: string) => {
    setExpandId(expandId === id ? '' : id);
  };

  return <Style.List>{render({ onSelect, expandId })}</Style.List>;
};

export default RichList;
