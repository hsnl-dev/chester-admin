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
  alignItems: 'center',
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
  { value: '店家管理者', label: '店家管理者' },
  { value: '店家使用者', label: '店家使用者' },
];



const AddUser = () => {
    const [authority, setAuthority] = useState([]);
    const [userInfo, setUserInfo] = useState({"account": "", "authority":"", "name": "", "phone": "", "email": "", "storeName": "", "storePhone": "", "regNumber": "", "addressCity": "", "addressDistrict": "", "addressStreet": "", "remark": "", 'partner_id': 0, "user_id": 0});
    const [currentRole, setCurrentRole] = useState();
    const history = useHistory();
    const location = useLocation();
    const [isEdit, setIsEdit] = useState(location.state[2]);
    const [isOpenCheck, setIsOpenCheck] = useState(false);
    const [isMachineOpenCheck, setIsMachineOpenCheck] = useState(false);
    const [checkMessage, setCheckMessage] = useState("");
    const [checkTitle, setCheckTitle] = useState("");
    const [machines, setMachines] = useState([]);
    const [newMachine, setNewMachine] = useState({'name': '', 'id': ''});
    const [existMachines, setExistMachines] = useState([]);
    const [addressSelector, setAddressSelector] = useState();

    const closeCheck = () => {
      setIsOpenCheck(false);
    }

    const closeMachineCheck = () => {
      setIsMachineOpenCheck(false);
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
        userInfo['user_id'] = info[0]['user_id'];
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
        userInfo['partner_id'] = info[0]['partner_id'];

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
      else {
        userInfo['storeName'] = info[1]['partner_name'];
        userInfo['storePhone'] = info[1]['partner_phone'];
        userInfo['regNumber'] = info[1]['partner_fid'];
        userInfo['addressCity'] = info[1]['partner_address_city'];
        userInfo['addressDistrict'] = info[1]['partner_address_district'];
        userInfo['addressStreet'] = info[1]['partner_address_street'];
        userInfo['remark'] = info[1]['partner_note'];
        userInfo['partner_id'] = info[1]['partner_id'];
      }

      if (info[0]['role'] !== 0 && isEdit) {
        getMachines(info[0]['partner_id']);
      }
      console.log(userInfo);
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
        setCurrentRole(result.data.role);
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
        }
        history.push(SETTINGS);
      } catch (err) {
        console.log(err);
      }
    }

    const checkUserInfo = () => {
      setCheckTitle("欄位未填");
      if (userInfo.account === "" && currentRole !== 2) {
        setCheckMessage("請輸入帳號");
        setIsOpenCheck(true);
      } else if (userInfo.authority === "") {
        setCheckMessage("請選擇權限角色");
        setIsOpenCheck(true);
      } else if (userInfo.name === "") {
        setCheckMessage("請輸入姓名");
        setIsOpenCheck(true);
      } else if (userInfo.phone === "" && currentRole !== 2) {
        setCheckMessage("請輸入電話");
        setIsOpenCheck(true);
      } else if (userInfo.email === "" && currentRole !== 2) {
        setCheckMessage("請輸入E-amil");
        setIsOpenCheck(true);
      } else if (userInfo.storeName === "" && currentRole === 0) {
        setCheckMessage("請輸入店家名稱");
        setIsOpenCheck(true);
      } else if (userInfo.storePhone === "" && currentRole === 0) {
        setCheckMessage("請輸入店家電話");
        setIsOpenCheck(true);
      } else if (userInfo.regNumber === "" && currentRole === 0) {
        setCheckMessage("請輸入食品業者登錄字號");
        setIsOpenCheck(true);
      } else if (userInfo.addressCity === "" && currentRole === 0) {
        setCheckMessage("請選擇縣市");
        setIsOpenCheck(true);
      } else if (userInfo.addressDistrict === "" && currentRole === 0) {
        setCheckMessage("請選擇區域");
        setIsOpenCheck(true);
      } else if (userInfo.addressStreet === "" && currentRole === 0) {
        setCheckMessage("請輸入詳細地址");
        setIsOpenCheck(true);
      } else if (machines.length === 0 && userInfo.authority === '店家管理者' && isEdit) {
        setCheckMessage("請新增機器");
        setIsOpenCheck(true);
      } else {
        handleSubmit();
      }
      
    }

    const addMachine = async () => {
      // machines.push({'name': '', 'number': ''});
      // setMachines([...machines]);
      if (newMachine.name === "") {
        setCheckMessage("請輸入智販機名稱");
        setIsOpenCheck(true);
      } else if (newMachine.id === "") {
        setCheckMessage("請輸入智販機編號");
        setIsOpenCheck(true);
      } else {
        try{
          const response = await request.post(`/users/${userInfo['partner_id']}/add-machines`, {
            machines: [newMachine]
          });
        } catch (err) {
          console.log(err);
        }
        machines.push({'machine_name': newMachine.name, 'machine_id': newMachine.id});
        setNewMachine({'name': '', 'id': ''});
        closeMachineCheck();
      }
    }

    const deleteMachine = async (e) => {
      let index = e.target.id;
      try{
        const response = await request.post(`/users/${userInfo['partner_id']}/delete-machine`, {
          machine_id: machines[index]['machine_id']
        });
      } catch (err) {
        console.log(err);
      }
      machines.splice(index, 1);
      setMachines([...machines]);
    }

    const handleMachine = (e) => {
      let split = e.target.id.split('_');
      let key = split[0];
      let index = split[1];
      machines[index][key] = e.target.value;
      setMachines([...machines]);
    }

    const machinesRow = () => {
      return (
        isEdit && userInfo['role'] === 1? (<Row>
          <Col md={12}>
            <Wrapper>
              <Heading>綁定智販機</Heading>
              {machines.length === 0? (null):(
                Object(machines).map((item, index) => {
                  return (
                  <RowBox onChange={handleMachine}>
                    <InputBox>
                      <Text>智販機名稱</Text>
                      <Input id={"name_" + index} placeholder="輸入智販機名稱" value={item.machine_name} disabled={currentRole !== 2? false: true}/>
                    </InputBox>
                    <InputBox>
                      <Text>智販機編號</Text>
                      <Input id={"id_" + index} placeholder="輸入智販機編號" value={item.machine_id} disabled={true}/>
                    </InputBox>
                    <ButtonBox>
                      <Button id={index} background_color='#F55252' color={'#FFFFFF'} margin={'5px'} height={'40px'} width={'80px'}  onClick={deleteMachine}>刪除</Button>
                    </ButtonBox>
                  </RowBox>
                )})
              )}
              {currentRole !== 2? (
                <Button
                  background_color={'#FF902B'}
                  color={'#FFFFFF'}
                  margin={'5px'}
                  height={'60%'}
                  width={'10%'}
                  onClick={() => setIsMachineOpenCheck(true)}
                >新增機器</Button>
              ):(null)}
              
            </Wrapper>
          </Col>
        </Row>) 
        :(null)
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
            <ModalHeader>{checkTitle}</ModalHeader>
            <ModalBody>
              <Text>{checkMessage}</Text>
            </ModalBody>
            <ModalFooter>
              <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeCheck}>確認</Button>
            </ModalFooter>
          </Modal>
          <Modal onClose={closeMachineCheck} isOpen={isMachineOpenCheck}>
            <ModalHeader>智販機資訊</ModalHeader>
            <ModalBody>
              <RowBox><InputBox><Text>智販機名稱</Text>
                <Input onChange={(e)=>{newMachine.name = e.target.value}}/>
              </InputBox></RowBox>
              <RowBox><InputBox><Text>智販機編號</Text>
                <Input onChange={(e)=>{newMachine.id = e.target.value}}/>
              </InputBox></RowBox>
              
            </ModalBody>
            <ModalFooter>
              <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeMachineCheck}>取消</Button>
              <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={addMachine}>確認</Button>
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
                    {<Select id="role" placeholder="選擇" labelKey="label" valueKey="value" searchable={false} disabled={(isEdit && currentRole !== 1) || (isEdit && userInfo.authority === '系統維護')? true: false} options={currentRole === 0? [authorityList[1]]: [authorityList[2]]} value={authority} onChange={handleAuthority}/>}
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
                    <Input id="storeName" placeholder="輸入店家名稱" disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} value={userInfo['storeName']}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>店家電話</Text>
                    <Input id="storePhone" placeholder="輸入店家電話" disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} value={userInfo['storePhone']} />
                  </InputBox>
                  <InputBox>
                    <Text>食品業者登錄字號</Text>
                    <Input id="regNumber" placeholder="輸入食品業者登錄字號" disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} value={userInfo['regNumber']}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>店家地址</Text>
                  <RowBox className="city-selector-set" >
                    <SelectAddress id="addressCity" data-value={userInfo['addressCity']} disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} onChange={()=>userInfo.addressDistrict = ""} className="county"/>
                    <SelectAddress id="addressDistrict"  data-value={userInfo['addressDistrict']} disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} className="district"/>
                    <Input id="addressStreet"  placeholder="輸入地址" disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} value={userInfo['addressStreet']} />
                  </RowBox>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>備註</Text>
                  <Input id="remark" placeholder="" value={userInfo['remark']} disabled={(currentRole === 0 && userInfo.authority !== '系統維護')? false: true} height="100px"/>
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