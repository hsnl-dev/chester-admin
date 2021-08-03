import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, SubHeadingLeft, SubHeadingRight, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { ADDPURCHASING } from '../../settings/constants';
import { useState } from 'react';
import { Datepicker } from 'baseui/datepicker';

const Col = withStyle(Column, () => ({
    '@media only screen and (max-width: 574px)': {
      marginBottom: '30px',
  
      ':last-child': {
        marginBottom: 0,
      },
    },
  }));

const Wrapper = styled('div', () => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    boxShadow: "-3px 3px 5px 1px #E0E0E0",
  }));

const VendorBox = styled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '40%'
}));

const RowBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '10px',
  padding: '0px'
}));

const InputBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginRight: '20px',
  marginLeft: '20px',
  marginTop: '10px',
}));

const vendorList = [
  { value: 'A', label: '廠商A' },
  { value: 'B', label: '廠商B' },
];

const unitList = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
];



const AddPurchasing = () => {
    
    const [vendor, setVendor] = useState([]);
    const [unit, setUnit] = useState([]);

    function handleVendor({ value }) {
      setVendor(value);
    }

    function handleUnit({ value }) {
      setUnit(value);
    }
  

    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>
                    新增
                </Title>
                <Wrapper>
                    <Heading>{'進貨資訊'}</Heading>
                    <Text>{'廠商名稱'}</Text>
                    <VendorBox>
                        <Select
                            options={vendorList}
                            placeholder={'選擇'}
                            searchable={false}
                            value={vendor}
                            labelKey="label"
                            valueKey="value"
                            onChange={handleVendor}
                        />
                        <Button
                            height={'48px'}
                            background_color={'#FFD2AB'}
                            color={'#FF902B'}
                        >+</Button>
                    </VendorBox>
                    <RowBox>
                      <div>
                        <Button
                            background_color={'#FF902B'}
                            color={'#FFFFFF'}
                            margin={'5px'}
                            height={'60%'}
                        >新增品項</Button>
                        <Button
                            background_color={'#40C057'}
                            color={'#FFFFFF'}
                            margin={'5px'}
                            height={'60%'}
                        >掃描進貨</Button>
                        <Button
                            background_color={'#2F8BE6'}
                            color={'#FFFFFF'}
                            margin={'5px'}
                            height={'60%'}
                        >匯入進貨</Button>
                      </div>
                      <div>
                        <Button
                            background_color={'#616D89'}
                            color={'#FFFFFF'}
                            margin={'5px'}
                            height={'60%'}
                        >取消</Button>
                        <Button
                            background_color={'#FF902B'}
                            color={'#FFFFFF'}
                            margin={'5px'}
                            height={'60%'}
                        >確認送出</Button>
                      </div>
                    </RowBox>
                </Wrapper>
            </Col>
          </Row>
        
          <Row>
            <Col md={12}>
                <Wrapper>
                    <Heading>新增品項</Heading>
                    <RowBox>
                      <InputBox><Text>進貨品名</Text><Input placeholder="輸入品名"/></InputBox>
                      <InputBox><Text>批號</Text><Input placeholder="輸入批號"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>原產地</Text><Input placeholder="輸入原產地"/></InputBox>
                      <InputBox><Text>品牌</Text><Input placeholder="輸入品牌"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>數量</Text><Input placeholder="輸入數量"/></InputBox>
                      <InputBox><Text>單位</Text><Select placeholder="g" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit} onChange={handleUnit}/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>製造日期</Text><Datepicker/></InputBox>
                      <InputBox><Text>有效日期</Text><Datepicker/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>單價</Text><Input placeholder="輸入單價"/></InputBox>
                      <InputBox><Text>總價</Text><Input placeholder="輸入總價"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>備註</Text><Input placeholder="" height="100px"/></InputBox>
                    </RowBox>
                </Wrapper>
            </Col>
          </Row>
        </Grid>
      );
  };
  
  export default AddPurchasing;