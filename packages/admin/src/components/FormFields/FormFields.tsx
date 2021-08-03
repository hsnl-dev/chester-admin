import React from "react";
import { Block } from "baseui/block";
import { StyledLink } from 'baseui/link';
import { styled } from "baseui";

const Title = styled("h2", ({ $theme }) => ({
  ...$theme.typography.fontBold32,
  marginTop: "0",
  marginBottom: "0",
  color: $theme.colors.textDark,
  textAlign: "center"
}));

const Label = styled("label", ({ $theme }) => ({
  ...$theme.typography.fontBold18,
  marginBottom: "10px",
  color: $theme.colors.textDark
}));

const Msg = styled("span", ({ $theme }) => ({
  ...$theme.typography.fontBold16,
  color: $theme.colors.red400,
  marginTop: "5px",
  marginLeft: "auto"
}));

const Ahref = styled(StyledLink, ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  marginBottom: "30px",
  color: $theme.colors.textDark,
  textDecoration: "underline",
}));

export const FormFields = ({ children }) => {
  return (
    <Block
      overrides={{
        Block: {
          style: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            margin: "20px 0",

            ":first-child": {
              marginTop: 0
            },

            ":last-child": {
              marginBottom: 0
            },

            ":only-child": {
              margin: 0
            }
          }
        }
      }}
    >
      {children}
    </Block>
  );
};

export const FormLabel = ({ children }) => {
  return <Label>{children}</Label>;
};

export const FormTitle = ({ children }) => {
  return <Title>{children}</Title>;
};

export const FormLink = ({  children }) => {
  return (
    <Block overrides={{
      Block: {
        style: {
          width: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "right"
        }
      }
    }}>
      <Ahref href={children.link}>{children.text}</Ahref>
    </Block>
  )
};

export const Error = ({ children }) => {
  return <Msg>{children}</Msg>;
};
