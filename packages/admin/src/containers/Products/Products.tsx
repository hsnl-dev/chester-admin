import React, { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { SelectBox } from '../../components/Select/Select';
import { Heading, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import { useHistory } from 'react-router-dom';
import { ADDPRODUCT } from '../../settings/constants';
import { request } from '../../utils/request';

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
}));

const SearchProductBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingRight: '10px'
}));

const ContentBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '90%',
  marginRight: '10px',
}));

const Wrapper = styled('div', () => ({
  width: '100%',
  fontFamily: "Montserrat",
  display: "flex",
  flexDirection: "column",
  padding: "30px",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  boxShadow: "-3px 3px 5px 1px #E0E0E0",
  marginBottom: '20px',
}));

const Products = () => {
  const column_names = ['商品編號', '商品名稱', '單價', '規格', '操作'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const [products, setProducts] = useState([]);
  const data = [{'商品編號': '123456789','商品名稱': 'ABC', '單價': '100', '規格': '規格A'}]
  const history = useHistory();

  function amountChange({ value }) {
    setDisplayAmount(value);
    console.log(displayAmount)
  }

  const searchPurchase = () =>{

  }

  const checkPurchase = () => {

  }

  const editPurchase = () => {

  }

  const deactivatePurchase = async ({ product_id }) => {   // 需要 product_id
    try {
      const result = await request.post(`/product/${product_id}/deactivate`);
      console.log(result);
      getProducts();
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearch =() => {

  }

  const handleChange = () => {
    
  }

  async function getProducts() {
    try {
      const result = await request.get(`/product`);
      const product_arr = result.data;
      console.log(product_arr);
      setProducts(product_arr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Title>
            商品管理
          </Title>
          <Wrapper>
            <Heading>商品查詢</Heading>
            <SearchProductBox>
              <ContentBox>
                  <Text>商品編號</Text>
                  <Input 
                      placeholder = '輸入商品編號'
                      onChange = {handleChange}
                  />
              </ContentBox>
              <ContentBox>
                  <Text>商品名稱</Text>
                  <Input 
                      placeholder = '輸入商品名稱'
                      onChange = {handleChange}
                  />
              </ContentBox>
            </SearchProductBox>
            <ButtonBox>
                <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={() => history.push(ADDPRODUCT)}>新增</Button>
                <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={searchPurchase}>查詢</Button>
            </ButtonBox>
          </Wrapper>
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
              columnData = {products}
              Button1_function = {checkPurchase}
              Button1_text = '查看'
              Button2_function = {editPurchase}
              Button2_text = '編輯'
              Button3_function = {deactivatePurchase}
              Button3_text = '停用'
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  )
}


export default Products;
