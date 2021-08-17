import React from 'react';
import { styled, withStyle } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { SETTINGS } from '../../settings/constants';
import { useState } from 'react';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { request } from "../../utils/request";

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

const authorityList = [
  { value: '店家使用者', label: '店家使用者' },
  { value: '店家管理者', label: '店家管理者' },
];

const ViewUser = () => {
    const [authority, setAuthority] = useState([]);
    const [userInfo, setUserInfo] = useState({"account": "", "authority":"", "name": "", "phone": "", "email": "", "storeName": "", "storePhone": "", "regNumber": "", "address": "", "remark": ""});
    const [currentRole, setCurentRole] = useState();
    const history = useHistory();
    const location = useLocation();
    const [isEdit, setIsNew] = useState(location.state[2]);
    const [selfRole, setSelfRole] = useState();

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

    const setCurrentUserInfo = ( info ) => {
      userInfo['account'] = info[0]['username'];
      userInfo['name'] = info[0]['name'];
      userInfo['phone'] = info[0]['phone'];
      userInfo['email'] = info[0]['email'];
      userInfo['storeName'] = info[1]['name'];
      userInfo['storePhone'] = info[1]['phone'];
      userInfo['regNumber'] = info[1]['food_industry_id'];
      userInfo['address'] = info[1]['address'];
      userInfo['remark'] = info[1]['note'];
      
      setCurentRole(info[0]['role']);
      if (info[0]['role'] === 1) {
        userInfo['authority'] = "店家管理者";
        setAuthority([{ value: '店家管理者', label: '店家管理者' }]);
      }
      else {
        userInfo['authority'] = "店家使用者";
        setAuthority([{ value: '店家使用者', label: '店家使用者' }]);
      }
      
    }

    const getRole = async () => {
      try {
        const result = await request.get(`/users/roles`)
        let role = result.data;
        setSelfRole(role);
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(()=>{
      getRole();
      setCurrentUserInfo(location.state);
    }, [])
  

    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>查看</Title>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Wrapper>
                <Heading>查看使用者</Heading>
                <RowBox>
                  <InputBox>
                    <Text>帳號</Text>
                    <Input id={"account"} placeholder="輸入帳號" value={userInfo['account']} disabled={true}/></InputBox>
                  <InputBox>
                    <Text>權限角色</Text>
                    {<Select id={"role"} placeholder="選擇" labelKey="label" valueKey="value" searchable={false} disabled={true} options={authorityList} value={authority}
                    onChange={handleAuthority}/>}
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>姓名</Text>
                    <Input id={"name"} placeholder="輸入姓名" value={userInfo['name']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>電話</Text>
                    <Input id={"phone"} placeholder="輸入電話" value={userInfo['phone']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>E-MAIL</Text>
                    <Input id={"email"} placeholder="輸入E-mail" value={userInfo['email']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>店家名稱</Text>
                    <Input id={"storeName"} placeholder="輸入店家名稱" value={userInfo['storeName']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>店家電話</Text>
                    <Input id={"storePhone"} placeholder="輸入店家電話" value={userInfo['storePhone']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>食品業者登錄字號</Text>
                    <Input id={"regNumber"} placeholder="輸入食品業者登錄字號" value={userInfo['regNumber']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>地址</Text>
                    <Input id={"address"} placeholder="輸入地址" value={userInfo['address']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>備註</Text>
                  <Input id={"remark"} placeholder="" value={userInfo['remark']} disabled={true} height="100px"/>
                </InputBox>
                </RowBox>
                <ButtonBox>
                  <Button
                    background_color={'#FF902B'}
                    color={'#FFFFFF'}
                    margin={'5px'}
                    height={'60%'}
                    onClick={()=> history.push(SETTINGS)}
                  >完成查看</Button>
                </ButtonBox>
              </Wrapper>
            </Col>
          </Row>
        </Grid>
    );
  };
  
  export default ViewUser;