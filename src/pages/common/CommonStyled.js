import styled from 'styled-components';

export const TitleWrapper = styled.div`
  padding: 1em;
  background-color: #e6f7ff;
  border-top: 1px solid #b3ddff;
  border-left: 1px solid #b3ddff;
  border-right: 2px solid #1890ff;
  border-bottom: 1px solid #b3ddff;
  color: #000;
`;

export const IconWrapper = styled.div`
  display: block;
  cursor: pointer;

  svg {
    font-size: 24px;
  }
`;

export const ControlWrapper = styled.div`
  display: flex;
  margin-top: 20px;

  label {
    width: 200px;
  }

  div.ant-select {
    width: 100%;
  }
`;

export const ModalContainer = styled.div`
  display: grid;
  padding: 20px 0 20px 0;
`;
