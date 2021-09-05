import styled from 'styled-components';
import { mobile } from '../../Me/styles/shared/devices';
import type { CardProps } from './Card.types';

type StyledCardProps = Pick<CardProps, 'appearance'>;

const isExtended = ({ appearance }: StyledCardProps) => appearance === 'extended';

export default styled.div<StyledCardProps>`
  --avatar-offset: 54px;
  --avatar-dim: 108px;

  ${(props) => isExtended(props) ? `
    --text-align: left;
    --width: 500px;
  ` : `
    --text-align: center;
    --width: 280px;
  `}

  @media ${mobile} {
    --width: 100%;
  }

  display: flex;
  flex-direction: column;
  width: var(--width);
  text-align: var(--text-align);
  padding: 0 20px;
  border-radius: 8px;
  position: relative;
  margin-top: calc(var(--avatar-offset) + 20px);
  margin-right: 5px;
  margin-left: 5px;
  box-shadow: 0 0 4px 0 rgba(17, 22, 26, 0.16),
    0 2px 4px 0 rgba(17, 22, 26, 0.08), 0 4px 8px 0 rgba(17, 22, 26, 0.08);
  display: grid;
  grid-auto-rows: 80px minmax(140px, auto) minmax(60px, auto) 80px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
  }

  .location {
    i {
      margin-right: 5px;
    }

    p {
      margin: 0;
      margin-top: 2px;
    }
  }

  .country {
    background: transparent;
    border: none;
    cursor: pointer;
    color: hsl(0, 0%, 29%);
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      color: var(--tag-color);
    }
  }

  .avatar {
    width: var(--avatar-dim);
    height: 118px;
    margin: calc(var(--avatar-offset) * -1) auto 0;
    background: transparent;
    padding: 0;

    &:hover {
      cursor: pointer;
    }

    i {
      position: absolute;
      font-size: var(--avatar-dim);
      width: var(--avatar-dim);
      height: var(--avatar-dim);
      background: hsl(0, 0%, 100%);
      color: var(--generic-avatar-color);
      border-radius: 50%;
      display: block;
    }

    img {
      display: block;
      position: relative;
      border-radius: 50%;
      object-fit: cover;
      width: var(--avatar-dim);
      height: var(--avatar-dim);

      &.broken {
        visibility: hidden;
      }
    }
  }

  .name {
    color: hsl(0, 0%, 29%);
    font-size: 20px;
    margin: 0 0 5px;
    word-break: break-word;
  }

  .title {
    word-break: break-word;
    color: hsl(0, 0%, 29%);
    margin: 0 0 5px;
    font-weight: 400;
  }

  .languages {
    display: inline-block;
  }

  .description {
    --margin-block: 5px;

    font-style: italic;
    word-break: break-word;
    color: #16385c;
    font-weight: 600;
    margin: var(--margin-block) 2.5px;
    border-radius: 10px;

    ${(props) => isExtended(props) ? `
      --margin-block: 15px;
      line-height: 1.3;
      font-size: larger;
    ` : `
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;

      &:before, &:after {
        content: "";
      }
    `}
  }

  .tags {
    z-index: 2;
  }

  .tag {
    border: 0;
    border-radius: 20px;
    display: inline-block;
    padding: 5px 10px;
    margin: 0 2.5px 5px;
    line-height: 1;
    user-select: none;
    text-transform: lowercase;
    font-family: monospace;

    &:is(div) {
      color: var(--button-dark-bg);
    }

    &:is(button) {
      color: hsl(0, 0%, 100%);
      background: var(--button-dark-bg);

      &:hover {
        cursor: pointer;
      }
    }

  }

  .channels {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-end;

    a,
    button {
      color: #16385c;
      text-decoration: none;

      .icon {
        transition: transform 0.3s ease;
        transform-origin: 50%;
      }
    }

    button {
      background: none;
      border: none;
      cursor: pointer;

      &:hover button {
        transform: rotate(-90deg);
      }

      &:active .icon {
        transform: rotate(-110deg);
      }
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;

      &:hover .icon {
        transform: rotate(45deg);
      }
      .type::first-letter {
        text-transform: uppercase;
      }
    }

    .channel-inner {
      display: flex;
      justify-content: space-around;
      background-color: #d0f8ef;
      align-items: center;
      padding: 20px 10px 5px 10px;
      margin-right: -20px;
      margin-left: -20px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;

      &.mentor-unavailable {
        height: 70px;
      }
    }

    .type {
      margin: 5px 0;
    }
  }

  .wave {
    position: absolute;
    bottom: 60px;
    left: 0;
    background-color: hsl(0, 0%, 100%);
    height: 30px;
    width: 100%;
    border-radius: 0% 0% 50% 50%;
  }

  .channel-label {
    text-decoration: none;
  }

  .like-button {
    background: none;
    border: none;
    cursor: pointer;
  }

  .liked,
  .like-button:hover i {
    color: hsl(0, 71%, 51%);
  }

  @media ${mobile} {
    margin-left: auto;
    margin-right: auto;
  }
`;
