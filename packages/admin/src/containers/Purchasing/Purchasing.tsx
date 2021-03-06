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

const RowBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '10px',
  padding: '0px'
}));

const Purchasing = () => {
  const column_names = ['????????????', '????????????', '????????????', '??????'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const [amountTemp, setAmountTemp] = useState(10);
  const [commodities, setCommodities] = useState([]);
  const [displayInfo, setDisplayInfo] = useState([]);
  const [displayTemp, setDisplayTemp] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [mergeData, setMergeData] = useState([]);
  const [css] = useStyletron();
  const history = useHistory();
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(2);
  const [nextClick, setNextClick] = useState(true);
  const [pastClick, setPastClick] = useState(false);
  const mb30 = css({
    '@media only screen and (max-width: 990px)': {
      marginBottom: '16px',
    },
  });

  function amountChange({ value }) {
    let amount = 0;

    if (value.length !== 0)
      amount = value[0].value;
    else
      amount = 10;
    
    setAmountTemp(amount);
    setDisplayAmount([{ value: amount, label: amount.toString() }]);
    setMaxPage(Math.ceil(displayTemp.length/amount));
    setPage(1);
    setPastClick(false);
    if (displayTemp.length > amount) {
      setDisplayInfo(displayTemp.slice(0, amount));
      setNextClick(true);
    }
    else {
      setDisplayInfo(displayTemp);
      setNextClick(false);
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
      setDisplayInfo(displayTemp.slice(0, amountTemp));
      setMaxPage(Math.ceil(displayTemp.length/amountTemp));
      setNextClick(page === Math.ceil(displayTemp.length/amountTemp)? false: true)
      setMergeData(Object.values(merge_data));
      setVendors(vendors_arr);
      setCommodities(commodities_arr);
    } catch (err) {
      console.log(err);
    }
  }

  const pagePast = () => {
    if (page !== 1) {
      let newPage = page - 1;
      let amount = displayAmount.length !== 0? displayAmount[0].value: amountTemp;
      setPage(newPage);
      setDisplayInfo(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
      setNextClick(true);
      if (newPage === 1)
        setPastClick(false);
      else
        setPastClick(true);
    }
  }

  const pageNext = () => {
    if (page !== maxPage){
      let newPage = page + 1;
      let amount = displayAmount.length !== 0? displayAmount[0].value: amountTemp;
      setPage(newPage);
      setDisplayInfo(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
      setPastClick(true);
      if (newPage === maxPage)
        setNextClick(false);
      else
        setNextClick(true);
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
            ????????????
          </Title>
          <Wrapper>
            <Heading>????????????</Heading>
            <SearchPurchasingBox>
              <ContentBox>
                  <Text>????????????</Text>
                  <Input 
                      placeholder = '????????????'
                      onChange = {(e) => {setSearchName(e.target.value)}}
                  />
              </ContentBox>
              <ContentBox>
                  <Text>????????????</Text>
                  <DatePicker 
                      placeholder = '????????????'
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
                ??????
              </Button>
              <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={searchPurchase}>??????</Button>
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
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={checkPurchase}>??????</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={editPurchase}>??????</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={returnPurchase}>??????</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#616D98' color={'#FFFFFF'} onClick={reimbursePurchase}>??????</Button>
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
            <RowBox>
              <div>
                Showing {(page - 1)*amountTemp + 1} to {page !== maxPage? page*amountTemp: displayTemp.length}
                      of {page !== maxPage? amountTemp: displayTemp.length - ((page - 1)*amountTemp + 1) + 1} entries
              </div>
              <div>
                <Button margin='5px' width='95px' height='30px' disabled={!pastClick} background_color={pastClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pagePast}>?????????</Button>
                {page}
                <Button margin='5px' width='95px' height='30px' disabled={!nextClick} background_color={nextClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pageNext}>?????????</Button>
              </div>
           </RowBox>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};

export default Purchasing;
