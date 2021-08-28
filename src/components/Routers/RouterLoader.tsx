import styled from 'styled-components';

const RouterLoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background: #fff;
`;

export const RouterLoader = () => (
  <RouterLoaderContainer>
    <i className="fa fa-2x fa-spin fa-spinner" />
  </RouterLoaderContainer>
);
