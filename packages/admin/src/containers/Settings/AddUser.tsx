import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, SubHeadingLeft, SubHeadingRight, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { PURCHASING, SETTINGS } from '../../settings/constants';
import { useState } from 'react';
import { Datepicker } from 'baseui/datepicker';
import { useEffect } from 'react';
import tw from 'date-fns/locale/zh-TW';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

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

const BottomWrapper = styled('div', () => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingRight: "30px",
    paddingLeft: "30px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    boxShadow: "-3px 3px 5px 1px #E0E0E0",
}));

const ButtonBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginRight: '20px',
  marginLeft: '20px',
  marginTop: '10px',
}));

const RowBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '10px',
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

const authorityList = [
  { value: '系統維護', label: '系統維護' },
  { value: '店家管理者', label: '店家管理者' },
  { value: '店家使用者', label: '店家使用者' },
];



const AddUser = () => {
    
    const [vendor, setVendor] = useState([]);
    const [authority, setAuthority] = useState([]);
    const [userInfo, setUserInfo] = useState({"account": "", "authority":"", "name": "", "phone": "", "email": "", "storeName": "", "storePhone": "", "regNumber": "", "address": "", "remark": ""});
    const [date, setDate] = useState([]);
    const history = useHistory();

    

    const handleInfoChange = (e) => {
      console.log(e.target.id);
      let type = e.target.id;
      userInfo[type] = e.target.value;
      setUserInfo({...userInfo});
    }

    const handleAuthority = ({ value }) => {
      setAuthority(value);
      userInfo["authority"]=value[0]['value'];
      setUserInfo({...userInfo});
      console.log(value);
    }

    const handleSubmit = () => {

    }

    useEffect(()=>{
      console.log(userInfo)
    }, [userInfo])
  

    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>
                    新增
                </Title>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
                <Wrapper onChange={handleInfoChange}>
                    <Heading>新增使用者</Heading>
                    <RowBox>
                      <InputBox><Text>帳號</Text><Input id={"account"} placeholder="輸入帳號"/></InputBox>
                      <InputBox><Text>權限角色</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={authorityList} value={authority}
                            onChange={handleAuthority}/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>姓名</Text><Input id={"name"} placeholder="輸入姓名"/></InputBox>
                      <InputBox><Text>電話</Text><Input id={"phone"} placeholder="輸入電話"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>E-MAIL</Text><Input id={"email"} placeholder="輸入E-mail"/></InputBox>
                      <InputBox><Text>店家名稱</Text><Input id={"storeName"} placeholder="輸入店家名稱"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>店家電話</Text><Input id={"storePhone"} placeholder="輸入店家電話"/></InputBox>
                      <InputBox><Text>食品業者登錄字號</Text><Input id={"regNumber"} placeholder="輸入食品業者登錄字號"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>地址</Text><Input id={"address"} placeholder="輸入地址"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>備註</Text><Input id={"remark"} placeholder="" height="100px"/></InputBox>
                    </RowBox>
                    <ButtonBox>
                      <Button
                        background_color={'#616D89'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={()=> history.push(SETTINGS)}
                      >取消</Button>
                      <Button
                        background_color={'#FF902B'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={handleSubmit}
                      >確認送出</Button>
                    </ButtonBox>
                </Wrapper>
            </Col>
          </Row>
        </Grid>
      );
  };
  
  export default AddUser;