import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

const style = <style>{`
  .item-content-enter {
    opacity: 0;
  }
  .item-content-exit,
  .item-content-exit-active,
  .item-content-exit-done {
    opacity: 0;
    height: 0;
    overflow:hidden;
  }
  .item-content-enter,
  .item-content-exit,
  .item-content-enter-active {
    transition: height 350ms ease, opacity 260ms;
  }
  .item-content-enter-active,
  .item-content-enter-done {
    opacity: 1;
    padding: 0 1px;
    overflow:hidden;
  }
`}</style>

  const PADDING_BOTTOM  =30;

const RichItem = ({
  id,
  avatar,
  title,
  subtitle,
  tag,
  info,
  expand,
  onClick,
  children,
}) => {
  const contentElHeight = useRef(0);

  return (
    <Root highlight={!!children && !expand} expanded={expand}>
      {style}
      <Main onClick={() => onClick(id)}>
        <ItemRow>
          <ItemAvatar>{avatar && <img src={avatar} alt="avatar" />}</ItemAvatar>
          <Titles>
            <ItemRow>
              <Title>{title}</Title>
              <Tag theme={tag.theme}>{tag.value}</Tag>
            </ItemRow>
            <Subtitle>{subtitle}</Subtitle>
          </Titles>
          <Info>{info}</Info>
        </ItemRow>
      </Main>
      <CSSTransition
        in={expand}
        timeout={350}
        classNames="item-content"
        unmountOnExit
        onEnter={(node) => {
          contentElHeight.current = node.offsetHeight;
          node.style.height = 0;
        }}
        onEntering={({style}) =>
          (style.height = contentElHeight.current + PADDING_BOTTOM + 'px')
        }
        onEntered={({style}) =>
          (style.height = contentElHeight.current + PADDING_BOTTOM + 'px')
        }
        onExit={({style}) => (style.height = 0)}
      >
        <div >{children}</div>
      </CSSTransition>
    </Root>
  );
};

RichItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avatar: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  info: PropTypes.string,
  tag: PropTypes.shape({
    value: PropTypes.string.isRequired,
    theme: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  }),
  onClick: PropTypes.func,
  expand: PropTypes.bool,
};

const themeColours = {
  primary: '#69D5B1',
  secondary: '#F3CA3E',
  danger: '#FF5F58',
  checked: '#69d579',
  disabled: 'e0e0e0'
};

// Styled Components

const ItemRow = styled.div`
  display: flex;
`;

const ItemCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Main = styled(ItemRow)`
  height: 80px;
  padding: 0 1px;
  align-items: center;
  > div {
    flex: 1;
  }
`;

const Titles = styled(ItemCol)`
  flex: 1;
  padding: 6px 0;

  ${ItemRow} {
    align-items: center;
  }
`;

const ItemAvatar = styled.div`
  margin-right: 20px;
  user-select: none;

  img {
    height: 45px;
    border-radius: 50%;
  }
`;

const Title = styled.h5`
  margin: 0 10px 0 0;
  font-size: 14px;
  font-weight: normal;
`;

const Subtitle = styled(Title)`
  color: #828282;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
`;

const Tag = styled.div`
  color: #fff;
  border-radius: 3px;
  padding: 1px 6px;
  user-select: none;
  font-size: 8px;
  line-height: 12px;
  text-align: center;
  background-color: ${({ theme }) => themeColours[theme]};
`;

const Root = styled.div`
  position: relative;
  padding: 0 1rem;
  font-family: Lato, system-ui;
  font-style: normal;
  &:hover {
    background-color: ${({ highlight }) => (highlight ? '#f2f2f2' : '')};
    ${Main} {
      cursor: ${({ highlight, expanded }) =>
        expanded || highlight ? 'pointer' : 'default'};
    }
  }
  & + &::before {
    content: ' ';
    border-top: 1px solid #f2f2f2;
    display: block;
    position: absolute;
    width: 100%;
    top: -1px;
  }
`;

export default RichItem;
