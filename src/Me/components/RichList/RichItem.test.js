import { render } from '@testing-library/react';
import React from 'react';
import RichItem from './RichItem';

const item = {
  avatar: '../../assets/me/mentors.svg',
  title: 'Mooli m',
  subtitle: 'web dev',
  tag: {
    value: 'pending',
    theme: 'secondary'
  },
  info: '3 days ago'
};

describe('RichItem component', () => {
  it('Should render all props correctly', () => {
    const {getByText} = render(<RichItem {...item} />) 

    getByText(item.title)
    getByText(item.subtitle)
    getByText(item.tag.value)
    getByText(item.info)
  })
  it('renders primary tag when specified with theme prop', () => {
    const { container } = render(
      <RichItem tag={{
        value: 'Accepted',
        theme: 'primary'
      }} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders secondary tag when specified with theme prop", () => {
    const { container } = render(
      <RichItem tag={{
        value: 'Pending',
        theme: 'secondary'
      }} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders danger tag when specified with theme prop', () => {
    const { container } = render(
      <RichItem tag={{
        value: 'Declined',
        theme: 'danger'
      }} />
    );
    expect(container).toMatchSnapshot();
  });
})