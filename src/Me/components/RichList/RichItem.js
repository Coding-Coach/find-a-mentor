import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

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
  return (
    <Root highlight={!!children && !expand} expanded={expand}>
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
      {children && expand && <Content>{children}</Content>}
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
  padding: 1px 6px 0;
  user-select: none;
  font-size: 8px;
  line-height: 12px;
  text-align: center;
  background-color: ${({ theme }) => themeColours[theme]};
`;

const Content = styled(ItemRow)`
  padding-bottom: 30px;
`;

const Root = styled.div`
  position: relative;
  padding: 0 1rem;
  font-family: Lato;
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
