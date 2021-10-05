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
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'baseui/modal';
import TwCitySelector from 'tw-city-selector';


import { forEachLeadingCommentRange } from 'typescript';

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



const AddUser = () => {
    const [authority, setAuthority] = useState([]);
    const [userInfo, setUserInfo] = useState({"account": "", "authority":"", "name": "", "phone": "", "email": "", "storeName": "", "storePhone": "", "regNumber": "", "addressCity": "", "addressDistrict": "", "addressStreet": "", "remark": ""});
    const [currentRole, setCurrentRole] = useState();
    const history = useHistory();
    const location = useLocation();
    const [isEdit, setIsNew] = useState(location.state[2]);
    const [isOpenCheck, setIsOpenCheck] = useState(false);
    const [checkMessage, setCheckMessage] = useState("");
    const [machines, setMachines] = useState([]);
    const [existMachines, setExistMachines] = useState([]);
    const [selfRole, setSelfRole] = useState();
    const [addressSelector, setAddressSelector] = useState();

    const closeCheck = () => {
      setIsOpenCheck(false);
    }

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
      console.log(info)
      
      if (isEdit) {
        userInfo['storeName'] = info[1]['name'];
        userInfo['storePhone'] = info[1]['phone'];
        userInfo['regNumber'] = info[1]['food_industry_id'];
        userInfo['addressCity'] = info[1]['address_city'];
        userInfo['addressDistrict'] = info[1]['address_district'];
        userInfo['addressStreet'] = info[1]['address_street'];
        userInfo['user_id'] = info[0]['user_id'];
        userInfo['account'] = info[0]['username'];
        userInfo['name'] = info[0]['name'];
        userInfo['phone'] = info[0]['phone'];
        userInfo['email'] = info[0]['email'];
        userInfo['remark'] = info[1]['note'];
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
      }
     
      let tmpMachines = [];
      info[3].forEach(element => {
        tmpMachines.push({
          "name": element.machine_name,
          "number": element.machine_id
        });
      })
      setExistMachines(tmpMachines);
      console.log(userInfo);
    }

    const getRole = async () => {
      try {
        const result = await request.get(`/users/role`)
        let role = result.data.role;
        setCurrentRole(role);
        setSelfRole(role);
      } catch (err) {
        console.log(err);
      }
    }

    const handleSubmit = async () => {
      let role = 0;
      if (userInfo.authority === "店家管理者") {
        role = 1;
      }
      else if (userInfo.authority === "店家使用者") {
        role = 2;
      }
      console.log(role);
      let response;
      try {
        if (isEdit) {
          response = await request.post(`/users/${userInfo['user_id']}/edit`, {
            username: userInfo.account,
            role: role,
            name: userInfo.name,
            phone: userInfo.phone,
            email: userInfo.email,
            partner_name: userInfo.storeName,
            partner_phone:  userInfo.storePhone,
            food_industry_id: userInfo.regNumber,
            address_city: userInfo.addressCity,
            address_district: userInfo.addressDistrict,
            address_street: userInfo.addressStreet,
            note: userInfo.remark
          });
          if (response.status === 200) {
            const response2 = await request.post(`/users/add-machines`, {
              machines: machines
            });
          }
        }
        else {
          response = await request.post(`/users/create`, {
            username: userInfo.account,
            role: role,
            name: userInfo.name,
            phone: userInfo.phone,
            email: userInfo.email,
            partner_name: userInfo.storeName,
            partner_phone:  userInfo.storePhone,
            food_industry_id: userInfo.regNumber,
            address_city: userInfo.addressCity,
            address_district: userInfo.addressDistrict,
            address_street: userInfo.addressStreet,
            note: userInfo.remark
          });
          if (response.status === 200) {
            const response2 = await request.post(`/users/add-machines`, {
              machines: machines
            });
          }
        }
        history.push(SETTINGS);
      } catch (err) {
        console.log(err);
      }
    }

    const checkUserInfo = () => {
      if (userInfo.account === "") {
        setCheckMessage("請輸入帳號");
        setIsOpenCheck(true);
      } else if (userInfo.authority === "") {
        setCheckMessage("請選擇權限角色");
        setIsOpenCheck(true);
      } else if (userInfo.name === "") {
        setCheckMessage("請輸入姓名");
        setIsOpenCheck(true);
      } else if (userInfo.phone === "") {
        setCheckMessage("請輸入電話");
        setIsOpenCheck(true);
      } else if (userInfo.email === "") {
        setCheckMessage("請輸入E-amil");
        setIsOpenCheck(true);
      } else if (userInfo.storeName === "") {
        setCheckMessage("請輸入店家名稱");
        setIsOpenCheck(true);
      } else if (userInfo.storePhone === "") {
        setCheckMessage("請輸入店家電話");
        setIsOpenCheck(true);
      } else if (userInfo.regNumber === "") {
        setCheckMessage("請輸入食品業者登錄字號");
        setIsOpenCheck(true);
      } else if (userInfo.addressCity === "") {
        setCheckMessage("請選擇縣市");
        setIsOpenCheck(true);
      } else if (userInfo.addressDistrict === "") {
        setCheckMessage("請選擇區域");
        setIsOpenCheck(true);
      } else if (userInfo.addressStreet === "") {
        setCheckMessage("請輸入詳細地址");
        setIsOpenCheck(true);
      } else if (machines.length === 0 && userInfo.authority !== '店家使用者') {
        setCheckMessage("請新增機器");
        setIsOpenCheck(true);
      } else {
        handleSubmit();
      }
      
    }

    const addMachine = () => {
      machines.push({'name': '', 'number': ''});
      setMachines([...machines]);
    }

    const handleMachine = (e) => {
      let split = e.target.id.split('_');
      let key = split[0];
      let index = split[1];
      machines[index][key] = e.target.value;
      setMachines([...machines]);
      console.log(machines);
    }

    const machinesRow = () => {
      return (
        <Row>
          <Col md={12}>
            <Wrapper>
              <Heading>綁定智販機</Heading>
              {machines.length === 0? (null):(
                Object(machines).map((item, index) => {
                  return (
                  <RowBox onChange={handleMachine}>
                    <InputBox>
                      <Text>智販機名稱</Text>
                      <Input id={"name_" + index} placeholder="輸入智販機名稱" value={item.name}/>
                    </InputBox>
                    <InputBox>
                      <Text>智販機編號</Text>
                      <Input id={"number_" + index} placeholder="輸入智販機編號" value={item.number}/>
                    </InputBox>
                  </RowBox>
                )})
              )}
              <Button
                background_color={'#FF902B'}
                color={'#FFFFFF'}
                margin={'5px'}
                height={'60%'}
                width={'10%'}
                onClick={addMachine}
              >新增機器</Button>
            </Wrapper>
          </Col>
        </Row>
      )
    }

    useEffect(()=>{
      getRole();
      setCurrentUserInfo(location.state);
      setAddressSelector(new TwCitySelector({
        el: '.city-selector-set',
        elCounty: '.county',
        elDistrict: '.district',
      }));
      // console.log(location.state)
    }, [])
  

    return (
        <Grid fluid={true}>
          <Modal onClose={closeCheck} isOpen={isOpenCheck}>
            <ModalHeader>欄位未填</ModalHeader>
            <ModalBody>
              <Text>{checkMessage}</Text>
            </ModalBody>
            <ModalFooter>
              <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeCheck}>確認</Button>
            </ModalFooter>
          </Modal>
          <Row>
            <Col md={12}>
                <Title>{isEdit? '編輯': '新增'}</Title>
            </Col>
          </Row>
          {machinesRow()}
          <Row>
            <Col md={12}>
              <Wrapper onChange={handleInfoChange}>
                <Heading>{isEdit? '編輯使用者': '新增使用者'}</Heading>
                <RowBox>
                  <InputBox>
                    <Text>帳號</Text>
                    <Input id="account" placeholder="輸入帳號" value={userInfo['account']} disabled={isEdit && currentRole !== 0? true: false}/></InputBox>
                  <InputBox>
                    <Text>權限角色</Text>
                    {<Select id="role" placeholder="選擇" labelKey="label" valueKey="value" searchable={false} disabled={(isEdit && currentRole !== 0) || (isEdit && userInfo.authority === '系統維護')? true: false} options={authorityList.slice(1)} value={authority} onChange={handleAuthority}/>}
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>姓名</Text>
                    <Input id="name" placeholder="輸入姓名" value={userInfo['name']}/>
                  </InputBox>
                  <InputBox>
                    <Text>電話</Text>
                    <Input id="phone" placeholder="輸入電話" disabled={(currentRole!== 2)? false: true} value={userInfo['phone']}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>E-MAIL</Text>
                    <Input id="email" placeholder="輸入E-mail" disabled={(currentRole!== 2)? false: true} value={userInfo['email']}/>
                  </InputBox>
                  <InputBox>
                    <Text>店家名稱</Text>
                    <Input id="storeName" placeholder="輸入店家名稱" value={userInfo['storeName']}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>店家電話</Text>
                    <Input id="storePhone" placeholder="輸入店家電話" value={userInfo['storePhone']} />
                  </InputBox>
                  <InputBox>
                    <Text>食品業者登錄字號</Text>
                    <Input id="regNumber" placeholder="輸入食品業者登錄字號" value={userInfo['regNumber']}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>店家地址</Text>
                  <RowBox className="city-selector-set" >
                    <SelectAddress id="addressCity" data-value={userInfo['addressCity']} onChange={()=>userInfo.addressDistrict = ""} className="county"/>
                    <SelectAddress id="addressDistrict"  data-value={userInfo['addressDistrict']} className="district"/>
                    <Input id="addressStreet"  placeholder="輸入地址" value={userInfo['addressStreet']} />
                  </RowBox>
                  </InputBox>
                  
                </RowBox>
                
                <RowBox>
                  <InputBox>
                  <Text>備註</Text>
                  <Input id="remark" placeholder="" value={userInfo['remark']} disabled={isEdit && currentRole!==0? true: false} height="100px"/>
                </InputBox>
                </RowBox>
                
              </Wrapper>
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
                    onClick={checkUserInfo}
                  >確認送出</Button>
                </ButtonBox>
            </Col>
          </Row>
        </Grid>
    );
  };
  
  export default AddUser;