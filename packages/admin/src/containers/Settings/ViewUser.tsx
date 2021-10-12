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
import TwCitySelector from 'tw-city-selector';

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

const SelectAddress = styled('select', () => ({
  width: '50%',
  height: '100%',
  marginRight: '20px',
}));

const authorityList = [
  { value: '系統維護', label: '系統維護' },
  { value: '店家使用者', label: '店家使用者' },
  { value: '店家管理者', label: '店家管理者' },
];

const ViewUser = () => {
    const [authority, setAuthority] = useState([]);
    const [userInfo, setUserInfo] = useState({"account": "", "authority":"", "name": "", "phone": "", "email": "", "storeName": "", "storePhone": "", "regNumber": "", "city": "", "district": "", "street": "", "remark": "", "role": 0});
    const history = useHistory();
    const location = useLocation();
    const [isEdit, setIsNew] = useState(location.state[2]);
    const [selfRole, setSelfRole] = useState();
    const [machines, setMachines] = useState([]);
    const [addressSelector, setAddressSelector] = useState();

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
      /* 
       * info[0]: user
       * info[1]: partner
       * info[2]: machines 
      */
      userInfo['account'] = info[0]['username'];
      userInfo['name'] = info[0]['name'];
      userInfo['phone'] = info[0]['phone'];
      userInfo['email'] = info[0]['email'];
      userInfo['storeName'] = info[0]['partner_name'];
      userInfo['storePhone'] = info[0]['partner_phone'];
      userInfo['regNumber'] = info[0]['partner_fid'];
      userInfo['addressCity'] = info[0]['partner_address_city'];
      userInfo['addressDistrict'] = info[0]['partner_address_district'];
      userInfo['addressStreet'] = info[0]['partner_address_street'];
      userInfo['remark'] = info[0]['partner_note'];
      userInfo['role'] = info[0]['role'];
      
      if (info[0]['role'] === 1) {
        userInfo['authority'] = "店家管理者";
        setAuthority([{ value: '店家管理者', label: '店家管理者' }]);
      }
      else if (info[0]['role'] === 2){
        userInfo['authority'] = "店家使用者";
        setAuthority([{ value: '店家使用者', label: '店家使用者' }]);
      }
      else {
        userInfo['authority'] = "系統維護";
        setAuthority([{ value: '系統維護', label: '系統維護' }]);
      }

      console.log(info)
      if (info[0]['role'] !== 0) {
        getMachines(info[0]['partner_id']);
      }
      
    }

    const getMachines = async ( partner_id ) => {
      const resultRole = await request.get(`/users/role`);
      console.log(resultRole.data.role)
      if (resultRole.data.role === 0) {
        try {
          const result = await request.get(`/users/${partner_id}/machines`)
          setMachines(result.data);
          console.log(result.data)
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const result = await request.get(`/users/machines`)
          setMachines(result.data);
          console.log(result.data)
        } catch (err) {
          console.log(err);
        }
      }
    }

    const getRole = async () => {
      try {
        const result = await request.get(`/users/role`)
        let role = result.data;
        setSelfRole(role);
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(()=>{
      getRole();
      setCurrentUserInfo(location.state);
      setAddressSelector(new TwCitySelector({
        el: '.city-selector-set',
        elCounty: '.county',
        elDistrict: '.district',
      }));
    }, [])
  

    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>查看</Title>
            </Col>
          </Row>
          {userInfo.role !== 0? (
            <Row>
              <Col md={12}>
                <Wrapper>
                  <Heading>智販機</Heading>
                  {machines.length === 0? (null):(
                    Object(machines).map((item, index) => {
                      return (
                      <RowBox>
                        <InputBox>
                          <Text>智販機名稱</Text>
                          <Input id={"name_" + index} disabled={true} value={item.machine_name}/>
                        </InputBox>
                        <InputBox>
                          <Text>智販機編號</Text>
                          <Input id={"number_" + index} disabled={true} value={item.machine_id}/>
                        </InputBox>
                      </RowBox>
                    )})
                  )}
                </Wrapper>
              </Col>
            </Row>
          ):(null)}
          
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
                  <Text>店家地址</Text>
                  <RowBox className="city-selector-set" >
                    <SelectAddress id="addressCity" data-value={userInfo['addressCity']} className="county" disabled={true} />
                    <SelectAddress id="addressDistrict"  data-value={userInfo['addressDistrict']} className="district" disabled={true}/>
                    <Input id="addressStreet"  placeholder="輸入地址" value={userInfo['addressStreet']} disabled={true} />
                  </RowBox>
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