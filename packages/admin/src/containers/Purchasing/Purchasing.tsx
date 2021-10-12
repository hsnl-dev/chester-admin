import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import SearchCard  from '../../components/SearchCard/SearchCard';
import { ButtonBox,Text } from '../../components/SearchCard/SearchCard';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { DatePicker } from 'baseui/datepicker';
import { Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import NoResult from '../../components/NoResult/NoResult';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { SelectBox } from '../../components/Select/Select';
import { ADDPURCHASING, VIEWPURCHASING, REPURCHASING, EDITPURCHASING } from '../../settings/constants';
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

const SearchPurchasingBox = styled('div', () => ({
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
  const [displayTemp, setDisplayTemp] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [mergeData, setMergeData] = useState([]);
  const [css] = useStyletron();
  const history = useHistory();
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState(null);

  const mb30 = css({
    '@media only screen and (max-width: 990px)': {
      marginBottom: '16px',
    },
  });

  function amountChange({ value }) {
    setDisplayAmount(value);
    let amount = (value===[])? value[0].value: displayTemp.length;
    if (displayTemp.length > amount) {
      setDisplayInfo(displayTemp.slice(amount));
    }
    else {
      setDisplayInfo(displayTemp);
    }
  }

  
  const handleDate = ({ date }) => { 
    setSearchDate(date);
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
    let selectData = mergeData[e.target.id];
    console.log(vendors)
    let vendor;
    for (let i = 0; i < vendors.length; i++){
      if (vendors[i].id === selectData[0].vendor_id){
        vendor = vendors[i];
        break;
      }
    }
    history.push(EDITPURCHASING, [selectData, vendor, vendors]);
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

  const handleSearch =(e) => {
    let temp = [];
    let value = e.target.value;
    if (value !== "") {
      for (let i = 0; i < displayTemp.length; i++) {
        let info = displayTemp[i];
        if (String(info.vendor_id).indexOf(value) !== -1 || info.vendor_name.indexOf(value) !== -1 || info.create_at.indexOf(value) !== -1) {
          temp.push(info);
        }
      }
      setDisplayInfo(temp);
    }
    else {
      setDisplayInfo(displayTemp);
    }
  }

  const searchPurchase = () =>{
    let date = dayjs(searchDate).format("YYYY-MM-DD");
    if (searchDate !== null || searchName !== "") {
      let temp = []
      for (let i = 0; i < displayTemp.length; i++) {
        if (displayTemp[i].vendor_name.indexOf(searchName) !== -1) {
          if ((searchDate !== null && displayTemp[i].create_at === date) || searchDate === null) {
            temp.push(displayTemp[i]);
          }
        }
      }
      setDisplayInfo([...temp]);
    }
    else {
      setDisplayInfo(displayTemp);
    }
  }

  async function getCommodities() {
    try {
      const result = await request.get(`/commodity`);
      const vendors_arr = result.data.vendors;
      const commodities_arr = result.data.commodities;
      let merge_data = {};
      console.log(vendors_arr);
      console.log(commodities_arr);
      for (let i = 0; i < commodities_arr.length; i++) {
        if (commodities_arr[i]['amount'] !== 0) {
          let vendor;
          for (let j = 0; j < vendors_arr.length; j++){
            if(vendors_arr[j]['id'] === commodities_arr[i]['vendor_id']){
              vendor = vendors_arr[j];
              break;
            }
          }
          let keys = Object.keys(merge_data);
          if (keys.indexOf(vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')) === -1) {
            displayTemp.push({'index': Object.keys(merge_data).length, 'vendor_id': vendor['id'], 'vendor_name': vendor['name'], 'create_at': dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')});
            merge_data[vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')] = [commodities_arr[i]];
          }
          else {
            merge_data[vendor['id'] + '_' + dayjs(commodities_arr[i]['create_at']).format('YYYY-MM-DD')].push(commodities_arr[i]);
          }
        }
      }
      setDisplayInfo([...displayTemp]);
      setMergeData(Object.values(merge_data));
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
          <Wrapper>
            <Heading>進貨查詢</Heading>
            <SearchPurchasingBox>
              <ContentBox>
                  <Text>廠商名稱</Text>
                  <Input 
                      placeholder = '輸入名稱'
                      onChange = {(e) => {setSearchName(e.target.value)}}
                  />
              </ContentBox>
              <ContentBox>
                  <Text>進貨日期</Text>
                  <DatePicker 
                      placeholder = '進貨日期'
                      onChange = {handleDate}
                  />
              </ContentBox>
            </SearchPurchasingBox>
            <ButtonBox>
              <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} 
                      onClick={() => history.push({
                        pathname: ADDPURCHASING, 
                        state: {params: vendors}
                      })}>
                新增
              </Button>
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
                          <React.Fragment key={row[0]}>
                            <StyledTd>{row[1]}</StyledTd>
                            <StyledTd>{row[2]}</StyledTd>
                            <StyledTd>{row[3]}</StyledTd>
                            {row.length >= 5 && row[4] !== '' ? <StyledTd>{row[4]}</StyledTd>: null}
                            <StyledTd>
                              <StyledButtonBox>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={checkPurchase}>查看</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={editPurchase}>編輯</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={returnPurchase}>退貨</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#616D98' color={'#FFFFFF'} onClick={reimbursePurchase}>報銷</Button>
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
