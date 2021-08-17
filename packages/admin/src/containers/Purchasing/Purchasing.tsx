import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { Wrapper, Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import NoResult from '../../components/NoResult/NoResult';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { SelectBox } from '../../components/Select/Select';
import { ADDPURCHASING, VIEWPURCHASING, REPURCHASING } from '../../settings/constants';
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
  const [mergeData, setMergeData] = useState([]);
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

  const checkPurchase = (e) => {
    let selectData = mergeData[e.target.id];
    console.log(vendors)
    let vendor;
    for (let i = 0; i < vendors.length; i++){
      if (vendors[i].id === selectData[0].vendor_id){
        vendor = vendors[i];
        break;
      }
    }
    history.push(VIEWPURCHASING, [selectData, vendor]);
  }

  const editPurchase = (e) => {
    
  }

  const returnPurchase = async (e) => {
    let selectData = mergeData[e.target.id];
    console.log(vendors)
    let vendor;
    for (let i = 0; i < vendors.length; i++){
      if (vendors[i].id === selectData[0].vendor_id){
        vendor = vendors[i];
        break;
      }
    }
    history.push(REPURCHASING, [selectData, vendor, 'return'])
  }

  const reimbursePurchase = async (e) => {
    let selectData = mergeData[e.target.id];
    console.log(vendors)
    let vendor;
    for (let i = 0; i < vendors.length; i++){
      if (vendors[i].id === selectData[0].vendor_id){
        vendor = vendors[i];
        break;
      }
    }
    history.push(REPURCHASING, [selectData, vendor, 'reimburse'])
  }

  const handleSearch =() => {

  }

  async function getCommodities() {
    try {
      const result = await request.get(`/commodity`);
      const vendors_arr = result.data.vendors;
      const commodities_arr = result.data.commodities;
      let merge_data = {};
      console.log(vendors_arr)
      console.log(commodities_arr)
      for (let i = 0; i < commodities_arr.length; i++) {
        let vendor;
        for (let j = 0; j < vendors_arr.length; j++){
          if(vendors_arr[j]['id'] === commodities_arr[i]['vendor_id']){
            vendor = vendors_arr[j];
            break;
          }
        }
        let keys = Object.keys(merge_data);
        if (keys.indexOf(vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')) === -1) {
          displayInfo.push({'vendor_id': vendor['id'], 'vendor_name': vendor['name'], 'create_at': dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')});
          merge_data[vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')] = [commodities_arr[i]];
        }
        else {
          merge_data[vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')].push(commodities_arr[i]);
        }
      }
      setMergeData(Object.values(merge_data));
      setVendors(vendors_arr);
      setCommodities(commodities_arr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCommodities();
  });

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
            <div>
              {displayInfo.length !== 0 ? (
                <StyledTable>
                  <tr>
                      {column_names.map((column_name) => (
                          <StyledTh>{column_name}</StyledTh>
                      ))}
                  </tr>
                    {displayInfo.map((item) => Object.values(item))
                    .map((row: Array<string>, index) => (
                        <tr>
                          <React.Fragment key={index}>
                            <StyledTd>{row[0]}</StyledTd>
                            <StyledTd>{row[1]}</StyledTd>
                            <StyledTd>{row[2]}</StyledTd>
                            {row.length >= 4 && row[3] !== '' ? <StyledTd>{row[3]}</StyledTd>: null}
                            <StyledTd>
                              <StyledButtonBox>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={checkPurchase}>查看</Button>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={editPurchase}>編輯</Button>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={returnPurchase}>退貨</Button>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#616D98' color={'#FFFFFF'} onClick={reimbursePurchase}>報銷</Button>
                              </StyledButtonBox>
                            </StyledTd>
                          </React.Fragment>
                        </tr>
                      ))
                    }
                    <tr>
                      {column_names.map((column_name) => (
                          <StyledTh>{column_name}</StyledTh>
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
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};

export default Purchasing;
