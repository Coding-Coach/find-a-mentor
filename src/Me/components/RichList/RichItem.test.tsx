import { render } from '@testing-library/react';
import RichItem, { RichItemProps } from './RichItem';

const defaults: RichItemProps = {
  id: 1,
  expand: true,
  avatar: '../../assets/me/mentors.svg',
  title: 'Mooli m',
  subtitle: 'web dev',
  tag: {
    value: 'pending',
    theme: 'secondary',
  },
  info: '3 days ago',
  onClick: jest.fn(),
};

const init = (
  overrides?: Partial<RichItemProps & { children: React.ReactNode }>
) => {
  const props: RichItemProps = {
    ...defaults,
    ...overrides,
  };

  const api = render(<RichItem {...props} />);

  return {
    props,
    ...api,
  };
};

describe('RichItem component', () => {
  it('Should render all props correctly', () => {
    const { getByText, getByAltText, props } = init();

    getByAltText('avatar');
    getByText(props.title);
    getByText(props.subtitle);
    getByText(props.tag.value);
    getByText(props.info);
  });
  it('renders primary tag when specified with theme prop', () => {
    const { container } = init({
      title: 'Accepted',
      tag: {
        value: 'Accepted',
        theme: 'primary',
      },
    });
    expect(container).toMatchSnapshot();
  });
  it('renders secondary tag when specified with theme prop', () => {
    const { container } = init({
      title: 'Pending',
      tag: {
        value: 'Pending',
        theme: 'secondary',
      },
    });
    expect(container).toMatchSnapshot();
  });

  it('renders danger tag when specified with theme prop', () => {
    const { container } = init({
      title: 'Declined',
      tag: {
        value: 'Declined',
        theme: 'danger',
      },
    });
    expect(container).toMatchSnapshot();
  });
});

describe('RichItem component with children', () => {
  it('should not show children content if "expand" is falsey', () => {
    const { getByTestId } = init({
      children: <div data-testid="content">Hi 😎</div>,
      expand: false,
    });

    expect(getByTestId('content')).not.toBeVisible();
  });

  it('should show children content if "expand" is truthy', async () => {
    const { getByTestId } = init({
      children: <div data-testid="content">Hi 😎</div>,
    });

    expect(getByTestId('content')).toBeVisible();

    // const myRender = (expand: boolean) => (
    //   <RichItem {...item} expand={expand}>
    //     <div data-testid="content">Hi 😎</div>
    //   </RichItem>
    // );
    // const { getByTestId, queryByTestId, rerender } = render(myRender());

    // await waitFor(() => {
    //   expect(queryByTestId('content')).not.toBeVisible();
    // });

    // rerender(myRender(true));

    // await waitFor(() => {
    //   expect(getByTestId('content')).toBeVisible();
    // });
  });
});
