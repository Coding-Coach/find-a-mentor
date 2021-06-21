import { render } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  test('Header renders', () => {
    const { getByText } = render(<Header  title ='Home' />);
    expect(getByText('Home')).toBeTruthy();
  });
});
