import React from 'react';
import { Input as BaseInput, SIZE } from 'baseui/input';

const getInputFontStyle = ({ $theme }) => {
  return {
    color: $theme.colors.textDark,
    ...$theme.typography.fontBold14,
  };
};

const Input = ({ ...props }) => {
  return (
    <BaseInput
      overrides={{
        Input: {
          style: ({ $theme }) => {
            return {
              ...getInputFontStyle({ $theme }),
              display: 'block',
              width: '100%',
              height: props.height? props.height: 'calc(1.5em + 0.75rem + 3px)',
              fontSize: '1rem',
              fontWeight: '400',
              lineHeight: '1.5',
              color: '#75787d',
              backgroundColor: '#FFFFFF',
              
              
            };
          },
        },
      }}
      {...props}
    />
  );
};

export { SIZE };
export default Input;
