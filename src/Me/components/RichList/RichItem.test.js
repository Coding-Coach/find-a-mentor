import { render, waitFor } from '@testing-library/react';
import React from 'react';
import RichItem from './RichItem';

const item = {
  avatar: '../../assets/me/mentors.svg',
  title: 'Mooli m',
  subtitle: 'web dev',
  tag: {
    value: 'pending',
    theme: 'secondary',
  },
  info: '3 days ago',
};

describe('RichItem component', () => {
  it('Should render all props correctly', () => {
    const { getByText, getByAltText } = render(<RichItem {...item} />);

    getByAltText('avatar');
    getByText(item.title);
    getByText(item.subtitle);
    getByText(item.tag.value);
    getByText(item.info);
  });
  it('renders primary tag when specified with theme prop', () => {
    const { container } = render(
      <RichItem
        title="Accepted"
        tag={{
          value: 'Accepted',
          theme: 'primary',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it('renders secondary tag when specified with theme prop', () => {
    const { container } = render(
      <RichItem
        title="Pending"
        tag={{
          value: 'Pending',
          theme: 'secondary',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders danger tag when specified with theme prop', () => {
    const { container } = render(
      <RichItem
        title="Declined"
        tag={{
          value: 'Declined',
          theme: 'danger',
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

describe('RichItem component with children', () => {
  it('Should show children content if "expand" is truthy', async () => {
    const myRender = expand => (
      <RichItem {...item} expand={expand}>
        <div data-testid="content">Hi 😎</div>
      </RichItem>
    );
    const { getByTestId, queryByTestId, rerender } = render(myRender());

    await waitFor(() => {
      expect(queryByTestId('content')).not.toBeVisible();
    });

    rerender(myRender(true));

    await waitFor(() => {
      expect(getByTestId('content')).toBeVisible();
    });
  });
});
