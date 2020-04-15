import {css} from 'styled-components/macro';

const desktop = `(min-width: 801px)`;
const mobile = `(max-width: 800px)`;

const desktopHidden = css`
  @media ${desktop} {
    display: none;
  }
`;

const mobileHidden = css`
  @media ${mobile} {
    display: none;
  }
`;

export { desktop, mobile, desktopHidden, mobileHidden };
