import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    &.has-modal {
      overflow: hidden;
    }
  }`;
