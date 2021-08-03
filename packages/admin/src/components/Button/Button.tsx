import React from 'react';
import { Button as BaseButton, SIZE, SHAPE, KIND } from 'baseui/button';
import { getPaddingStyles, getBorderRadiiStyles } from './Button.style';

const Button = ({ children, overrides, background_color, ...props }: any) => {
  return (
    <BaseButton
      {...props}
      overrides={{
        BaseButton: {
          style: ({ $theme, $size, $shape }) => {
            return {
              ...getPaddingStyles({ $theme, $size }),
              ...getBorderRadiiStyles({ $theme, $size, $shape }),
              backgroundColor: background_color,
              color: props.color,
              margin: props.margin,
              width: props.width,
              height: props.height,
              fontSize: '15px'
            };
          },
        },
        ...overrides,
      }}
    >
      {children}
    </BaseButton>
  );
};

export { SIZE, SHAPE, KIND };
export default Button;
