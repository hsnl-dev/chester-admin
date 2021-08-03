import React from 'react';
import { styled } from 'baseui';
import { Datepicker } from 'baseui/datepicker';
import Button from '../../components/Button/Button';

const Wrapper = styled('div', () => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    boxShadow: "-3px 3px 5px 1px #E0E0E0",
    
}));

const IconBox = styled('div', ({ $theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100px',
  color: $theme.colors.primary,
  marginRight: '10px',
}));

const ContentBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '30%',
}));

const Heading = styled('span', ({ $theme }) => ({
  ...$theme.typography.fontBold24,
  color: $theme.colors.textDark,
  marginBottom: '50px',
  width: "100%",
  display: "flex",
}));

const SubHeading = styled('span', ({ $theme }) => ({
  ...$theme.typography.font14,
  color: $theme.colors.textDark,
  margin: '0',
}));

const Text = styled('div', ({ $theme }) => ({
    ...$theme.typography.fontBold15,
    color: $theme.colors.textDark,
}));

const ButtonBox = styled('div', ({}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
}));

type Props = {
  title: any;
  handleChange: any;
  Button1_function: any;
  Button2_function: any;
  Button1_text: any;
  Button2_text: any;
};
export default function SearchCard({
  title,
  handleChange,
  Button1_function,
  Button2_function,
  Button1_text,
  Button2_text,
}: Props) {
  return (
    <Wrapper>
        <Heading>{title}</Heading>
        <ContentBox>
            <Text>生產日期</Text>
            <Datepicker 
                onChange = {handleChange}
            />
        </ContentBox>
        <ButtonBox>
            <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={Button1_function}>{Button1_text}</Button>
            <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={Button2_function}>{Button2_text}</Button>
        </ButtonBox>

    </Wrapper>
  );
}
