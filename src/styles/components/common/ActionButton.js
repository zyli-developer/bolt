import { createStyles } from 'antd-style';

/**
 * 通用按钮样式
 */
const useStyles = createStyles(({ css, token }) => {
  return {
    actionButton: css`
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 12px;
      height: 32px;
      font-size: 12px;
    `,
    primaryButton: css`
      background-color: ${token.colorPrimary};
      color: white;
      font-weight: 500;
      
      &:hover, &:focus {
        background-color: ${token.colorPrimaryHover} !important;
        border-color: ${token.colorPrimaryHover} !important;
      }
    `,
    flex1: css`
      flex: 1;
    `,
    flex2: css`
      flex: 2;
    `,
    disabledButton: css`
      &[disabled] {
        background-color: ${token.colorBgContainerDisabled};
        color: ${token.colorTextDisabled};
        cursor: not-allowed;
        
        &:hover, &:focus {
          background-color: ${token.colorBgContainerDisabled} !important;
          color: ${token.colorTextDisabled} !important;
        }
      }
    `,
    iconOnly: css`
      padding: 0 8px;
    `,
    danger: css`
      background-color: ${token.colorError};
      color: white;
      font-weight: 500;
      
      &:hover, &:focus {
        background-color: ${token.colorErrorHover} !important;
        border-color: ${token.colorErrorHover} !important;
      }
    `,
    success: css`
      background-color: ${token.colorSuccess};
      color: white;
      font-weight: 500;
      
      &:hover, &:focus {
        background-color: ${token.colorSuccessHover} !important;
        border-color: ${token.colorSuccessHover} !important;
      }
    `,
  };
});

export default useStyles; 