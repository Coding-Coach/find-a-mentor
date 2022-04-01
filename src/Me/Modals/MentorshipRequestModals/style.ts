import styled from 'styled-components/macro';
import { desktop } from '../../styles/shared/devices';
import { StyledTextarea } from '../../components/Textarea/Textarea';

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

  #menteeEmailLink {
    text-align: left;
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

  ${StyledTextarea} {
    width: 100%;
  }

  svg {
    align-self: center;
  }
`;
