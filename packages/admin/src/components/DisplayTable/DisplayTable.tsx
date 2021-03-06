import React from 'react';
import { styled, withStyle } from 'baseui';
import NoResult from '../NoResult/NoResult';
import Button from '../Button/Button';
import Select from '../Select/Select';
import {
  StyledTable as BaseStyledTable,
  StyledHeadCell as BaseStyledHeadCell,
  StyledBodyCell as BaseStyledCell,
} from 'baseui/table-grid';

export const Wrapper = styled('div', () => ({
  width: '100%',
  height: '100%',
  display: "flex",
  flexDirection: "column",
  padding: "30px",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  boxShadow: "-3px 3px 5px 1px #E0E0E0",
  fontFamily: "Montserrat",
  marginTop: '15px',
}));

export const StyledTable = styled('table', () => ({
  width: '100%',
  color: '#342E49',
  border: '1px solid #E0E0E0',
  borderSpacing: '0px'
}));

export const StyledTh = styled('th', () => ({
  verticalAlign: 'top',
  border: '1px solid #E0E0E0',
  fontWeight: 700,
  fontSize: '15px'
  
}))

export const StyledTd = styled('td', () => ({
  verticalAlign: 'center',
  border: '1px solid #E0E0E0',
  padding: '10px',
  fontWeight: 400,
}))

export const StyledButtonBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'column',
}))

export const Heading = styled('span', ({ $theme }) => ({
    ...$theme.typography.fontBold24,
    color: $theme.colors.textDark,
    marginBottom: '10px',
    width: "100%",
    display: "flex",
    flexDirection: 'row',
}));

export const SubHeadingRight = styled('div', ({ $theme }) => ({
    color: '#342E49',
    marginBottom: '10px',
    width: "100%",
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: 400,
}));

export const SubHeadingLeft = styled('div', ({ $theme }) => ({
    color: '#342E49',
    marginBottom: '10px',
    width: "100%",
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: 400,
}));

export const Title = styled('div', ({ $theme }) => ({
    fontSize: '28px',
    color: $theme.colors.textDark,
    marginBottom: '10px',
    fontWeight: 'bold'
}));

export const Text = styled('div', ({ $theme }) => ({
    ...$theme.typography.fontBold15,
    color: $theme.colors.textDark,
}));

type Props = {
    columnNames: any,
    columnData: any,
    Button1_function,
    Button1_text,
    Button2_function,
    Button2_text,
    Button3_function,
    Button3_text,
};

export default function DisplayTable({
    columnNames,
    columnData,
    Button1_function,
    Button1_text,
    Button2_function,
    Button2_text,
    Button3_function,
    Button3_text,
  }: Props) {
    return (
      <div>
        {columnData.length !== 0 ? (
          <StyledTable>
            <tr>
                {columnNames.map((columnName: Array<string>) => (
                    <StyledTh>{columnName}</StyledTh>
                ))}
            </tr>
              {columnData.map((item) => Object.values(item))
              .map((row: Array<string>, index) => (
                  <tr>
                    <React.Fragment key={row[0]}>
                      <StyledTd>{row[1]}</StyledTd>
                      <StyledTd>{row[2]}</StyledTd>
                      <StyledTd>{row[3]}</StyledTd>
                      {row.length >= 5 && row[4] !== '' ? <StyledTd>{row[4]}</StyledTd>: null}
                      <StyledTd>
                        <StyledButtonBox>
                          {Button1_text.length !== 0 ? (
                            <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={Button1_function}>{Button1_text}</Button>
                          ):(null)}
                          <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={Button2_function}>{Button2_text}</Button>
                          {Button3_text.length !== 0 ? (
                            <Button id={row[0]} margin='5px' width='80px' height='45px' background_color={row.length >= 5? (parseInt(row[5]) === 1? '#F55252': '#FF902B'):'#F55252'} color={'#FFFFFF'} onClick={Button3_function}>{row.length >= 6? (parseInt(row[5]) === 1? "??????": "??????"):Button3_text}</Button>
                          ):(null)}
                        </StyledButtonBox>
                      </StyledTd>
                    </React.Fragment>
                  </tr>
                ))
              }
              <tr>
                {columnNames.map((columnName: Array<string>) => (
                    <StyledTh>{columnName}</StyledTh>
                ))}
              </tr>
          </StyledTable>
          ) : (
            <NoResult
              hideButton={false}
                style={{
                  gridColumnStart: '1',
                  gridColumnEnd: 'one',
                }}
            />
          )}
      </div>
    );
  }
