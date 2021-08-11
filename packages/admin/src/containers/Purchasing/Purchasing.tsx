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
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
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

const Purchasing = () => {
  const column_names = ['廠商編號', '廠商名稱', '進貨日期', '操作'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [vendors, setVendors] = useState([]);
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

  const deletePurchase = async ({ commodity_id }) => {   // 需要 commodity_id
    try {
      const result = await request.post(`/commodity/${commodity_id}/delete`);
      console.log(result);
      getCommodities();
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearch =() => {

  }

  async function getCommodities() {
    try {
      const result = await request.get(`/commodity`);
      const vendors_arr = result.data.vendors;
      const commodities_arr = result.data.commodities;
      for (let i = 0; i < commodities_arr.length; i++) {
        let vendor;
        for (let j = 0; j < vendors_arr.length; j++){
          if(vendors_arr[j]['id'] === commodities_arr[i]['vendor_id']){
            vendor = vendors_arr[i];
            break;
          }
        }
        displayInfo.push({'vendor_id': vendor['id'], 'vendor_name': vendor['name'], 'create_at': dayjs(vendor['create_at']).format('YYYY-MM-DD')})       
      }
      setVendors(vendors_arr);
      setCommodities(commodities_arr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCommodities();
  }, []);

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
            Button1_function = {() => history.push({
              pathname: ADDPURCHASING, 
              state: {params: vendors}
            })}
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
              columnData = {displayInfo}
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
