import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { Wrapper, Heading, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { SelectBox } from '../../components/Select/Select';
import { ADDPURCHASING } from '../../settings/constants';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 574px)': {
    marginBottom: '30px',

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
}))

const Purchasing = () => {
  const column_names = ['廠商編號', '廠商名稱', '進貨日期', '操作'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const data = [{'廠商編號': '123456789','廠商名稱': 'ABC', '進貨日期': '2020/12/02'}]
  const [css] = useStyletron();
  const history = useHistory();
  const mb30 = css({
    '@media only screen and (max-width: 990px)': {
      marginBottom: '16px',
    },
  });

  function amountChange({ value }) {
    setDisplayAmount(value);
    console.log(displayAmount)
  }

  
  const handleDate = () => { 
    console.log("change date")
  }

  const searchPurchase = () =>{

  }

  const checkPurchase = () => {

  }

  const editPurchase = () => {

  }

  const deletePurchase = () => {

  }

  const handleSearch =() => {

  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Title>
            進貨管理
          </Title>
          <SearchCard
            title = '進貨查詢'
            handleChange = {handleDate}
            Button1_function = {()=> history.push(ADDPURCHASING)}
            Button2_function = {searchPurchase}
            Button1_text = '新增'
            Button2_text = '查詢'
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Wrapper>
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
              Button1_function = {checkPurchase}
              Button1_text = '查看'
              Button2_function = {editPurchase}
              Button2_text = '編輯'
              Button3_function = {deletePurchase}
              Button3_text = '退貨'
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};

export default Purchasing;
