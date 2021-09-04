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
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import { useHistory, useLocation } from 'react-router-dom';
import { ADDPRODUCT } from '../../settings/constants';
import { request } from '../../utils/request';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

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
  const [displayProducts, setDisplayProducts] = useState([]);
  const [displayTemp, setDisplayTemp] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [productUnit, setProductUnit] = useState([]);
  const [weightUnit, setWeightUnit] = useState([]);
  const [storage, setStorage] = useState([]);
  const [selectId, setSelectId] = useState();
  const [selectActivate, setSelectActivate] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const data = [{'商品編號': '123456789','商品名稱': 'ABC', '單價': '100', '規格': '規格A'}]
  const history = useHistory();

  const close = () => {
    setIsOpen(false);
  }

  function amountChange({ value }) {
    setDisplayAmount(value);
    let amount = (value===[])? value[0].value: displayTemp.length;
    if (displayTemp.length > amount) {
      setDisplayAmount(displayTemp.slice(amount));
    }
    else {
      setDisplayAmount(displayTemp);
    }
  }

  const checkPurchase = (e) => {
    let chooseInfo = products[e.target.id];
    history.push({
      pathname: ADDPRODUCT,
      state: {
        product_unit: productUnit,
        weight_unit: weightUnit,
        storage: storage,
        info: chooseInfo,
        type: 'view'
      }});
  }

  const editPurchase = (e) => {
    let chooseInfo = products[e.target.id];
    history.push({
      pathname: ADDPRODUCT,
      state: {
        product_unit: productUnit,
        weight_unit: weightUnit,
        storage: storage,
        info: chooseInfo,
        type: 'edit'
      }});
  }

  const handleactivate = async () => {   // 需要 product_id
    if (selectActivate === 1) {
      try {
        const result = await request.post(`/product/${selectId}/deactivate`);
        console.log(result);
        getProducts();
      } catch (err) {
        console.log(err);
      }
    }
    else {
      try {
        const result = await request.post(`/product/${selectId}/activate`);
        console.log(result);
        getProducts();
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleactivateTemp = (e) => {
    console.log(products)
    let product_id = products[e.target.id]['id'];
    let activate = products[e.target.id]['activate'];
    setSelectActivate(activate);
    setSelectId(product_id);
    setIsOpen(true);
  }

  const handleSearch =(e) => {
    let temp = [];
    let value = e.target.value;
    if (value !== "") {
      for (let i = 0; i < displayTemp.length; i++) {
        let info = displayTemp[i];
        if (info.product_no.indexOf(value) !== -1 || info.name.indexOf(value) !== -1 || String(info.price).indexOf(value) !== -1 || info.spec.indexOf(value) !== -1) {
          temp.push(info);
        }
      }
      setDisplayProducts(temp);
    }
    else {
      setDisplayProducts(displayTemp);
    }
  }

  const handleChange = () => {
    
  }

  const searchProduct = () =>{
    console.log(searchName)
    console.log(searchNumber)
    if (searchNumber !== "" || searchName !== "") {
      let temp = []
      for (let i = 0; i < displayTemp.length; i++) {
        console.log(displayTemp[i].product_no.indexOf(searchNumber))
        if (displayTemp[i].product_no.indexOf(searchNumber) !== -1) {
          if (displayTemp[i].name.indexOf(searchName) !== -1){
            temp.push(displayTemp[i]);
          }
        }
      }
      setDisplayProducts(temp);
    }
    else {
      setDisplayProducts(displayTemp);
    }
  }

  async function getProducts() {
    try {
      const result = await request.get(`/product`);
      const product_arr = result.data.products;
      console.log(product_arr);
      const product_unit_arr = result.data.options.product_unit;
      const weight_unit_arr = result.data.options.weight_unit;
      const storage_arr = result.data.options.storage;
      for (let i = 0; i < product_arr.length; i++) {
        displayTemp.push({'index': i, 'product_no': product_arr[i]['product_no'], 'name': product_arr[i]['name'], 'price': product_arr[i]['price'], 'spec': product_arr[i]['spec'], "activate": product_arr[i]['activate']});
      }
      setDisplayProducts(displayTemp);
      setProducts(product_arr);
      setProductUnit(product_unit_arr);
      setWeightUnit(weight_unit_arr);
      setStorage(storage_arr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Grid fluid={true}>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>{selectActivate === 1? '停用商品': '啟用商品'}</ModalHeader>
        <ModalBody>
          {selectActivate === 1? '是否確定停用?': '是否確定啟用?'}
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {close(); handleactivate();}}>確定</Button>
        </ModalFooter>
      </Modal>
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
                      onChange = {(e) => {setSearchNumber(e.target.value)}}
                  />
              </ContentBox>
              <ContentBox>
                  <Text>商品名稱</Text>
                  <Input 
                      placeholder = '輸入商品名稱'
                      onChange = {(e) => {setSearchName(e.target.value)}}
                  />
              </ContentBox>
            </SearchProductBox>
            <ButtonBox>
              <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} 
                      onClick={() => history.push({
                        pathname: ADDPRODUCT,
                        state: {
                          product_unit: productUnit,
                          weight_unit: weightUnit,
                          storage: storage,
                          type: "add",
                        }
                      })}>
                新增
              </Button>
              <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={searchProduct}>查詢</Button>
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
              columnData = {displayProducts}
              Button1_function = {checkPurchase}
              Button1_text = '查看'
              Button2_function = {editPurchase}
              Button2_text = '編輯'
              Button3_function = {handleactivateTemp}
              Button3_text = '停用'
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  )
}


export default Products;
