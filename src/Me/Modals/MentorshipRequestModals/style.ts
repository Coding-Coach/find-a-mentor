import styled from 'styled-components';
import { desktop } from '../../styles/shared/devices';

export default styled.div`
  min-height: 415px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  color: #4f4f4f;
  margin: 0 auto;
  overflow-y: auto;

  @media ${desktop} {
    max-width: 500px;
  }

  p {
    text-align: center;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;

    li {
      display: grid;
      grid-template-columns: 0 1fr;
      grid-gap: 1.75em;
      align-items: baseline;

      &:before {
        content: '👉';
      }
    }
  }
`;
