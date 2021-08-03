import React, { useCallback } from 'react';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { SelectBox } from '../../components/Select/Select';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { Wrapper, Heading, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import { useState } from 'react';
import { styled, withStyle } from 'baseui';
import {
  SiteSettings,
  Members,
  OrderIcon,
  CouponIcon,
  SidebarCategoryIcon,
  ProductIcon,
} from '../../components/AllSvgIcon';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';
import { ADDUSER } from '../../settings/constants';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const SearchBox = styled('div', () => ({
  width: '50%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const ButtonBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
}))

const Text = styled('span', ({ $theme }) => ({
  ...$theme.typography.fontBold24,
  color: $theme.colors.textDark,
  marginBottom: '20px',
  width: "100%",
  display: "flex",
}));

export default function Settings() {
  const column_names = ['帳號', '姓名', '權限角色', '操作'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const data = [{'account': '123456789','name': 'ABC', 'authority': '店家管理者'}]
  const history = useHistory();

  function amountChange({ value }) {
    setDisplayAmount(value);
    console.log(displayAmount)
  }

  const editUser = () => {

  }

  const deleteUser = () => {

  }

  const handleSearch =() => {

  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Title>
            系統管理
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Wrapper>
            <Text>帳號管理</Text>
            <ButtonBox>
              <Button 
                background_color={'#FF902B'}
                color={'#FFFFFF'}
                margin={'5px'}
                height={'70%'}
                width={'15%'}
                onClick={()=>{history.push(ADDUSER)}}
              >新增使用者</Button>
            </ButtonBox>
            <Heading>
              <SubHeadingLeft>Show
                <SelectBox width="15%">
                  <Select
                    options = {amountSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder={10}
                    value={displayAmount}
                    searchable={false}
                    onChange={amountChange}
                  />
                </SelectBox>
                entries
              </SubHeadingLeft>
              <SubHeadingRight><SearchBox>Search:<Input onChange={handleSearch}/></SearchBox></SubHeadingRight>
              
            </Heading>
            <DisplayTable
              columnNames = {column_names}
              columnData = {data}
              Button1_function = {null}
              Button1_text = ''
              Button2_function = {editUser}
              Button2_text = '編輯'
              Button3_function = {deleteUser}
              Button3_text = '刪除'
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
