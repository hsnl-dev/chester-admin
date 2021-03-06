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
  { value: '????????????', label: '????????????' },
  { value: '???????????????', label: '???????????????' },
  { value: '???????????????', label: '???????????????' },
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
        userInfo['authority'] = "???????????????";
        setAuthority([{ value: '???????????????', label: '???????????????' }]);
      }
      else if (info[0]['role'] === 2){
        userInfo['authority'] = "???????????????";
        setAuthority([{ value: '???????????????', label: '???????????????' }]);
      }
      else {
        userInfo['authority'] = "????????????";
        setAuthority([{ value: '????????????', label: '????????????' }]);
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
                <Title>??????</Title>
            </Col>
          </Row>
          {userInfo.role !== 0? (
            <Row>
              <Col md={12}>
                <Wrapper>
                  <Heading>?????????</Heading>
                  {machines.length === 0? (null):(
                    Object(machines).map((item, index) => {
                      return (
                      <RowBox>
                        <InputBox>
                          <Text>???????????????</Text>
                          <Input id={"name_" + index} disabled={true} value={item.machine_name}/>
                        </InputBox>
                        <InputBox>
                          <Text>???????????????</Text>
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
                <Heading>???????????????</Heading>
                <RowBox>
                  <InputBox>
                    <Text>??????</Text>
                    <Input id={"account"} placeholder="????????????" value={userInfo['account']} disabled={true}/></InputBox>
                  <InputBox>
                    <Text>????????????</Text>
                    {<Select id={"role"} placeholder="??????" labelKey="label" valueKey="value" searchable={false} disabled={true} options={authorityList} value={authority}
                    onChange={handleAuthority}/>}
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>??????</Text>
                    <Input id={"name"} placeholder="????????????" value={userInfo['name']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>??????</Text>
                    <Input id={"phone"} placeholder="????????????" value={userInfo['phone']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>E-MAIL</Text>
                    <Input id={"email"} placeholder="??????E-mail" value={userInfo['email']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>????????????</Text>
                    <Input id={"storeName"} placeholder="??????????????????" value={userInfo['storeName']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                    <Text>????????????</Text>
                    <Input id={"storePhone"} placeholder="??????????????????" value={userInfo['storePhone']} disabled={true}/>
                  </InputBox>
                  <InputBox>
                    <Text>????????????????????????</Text>
                    <Input id={"regNumber"} placeholder="??????????????????????????????" value={userInfo['regNumber']} disabled={true}/>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>????????????</Text>
                  <RowBox className="city-selector-set" >
                    <SelectAddress id="addressCity" data-value={userInfo['addressCity']} className="county" disabled={true} />
                    <SelectAddress id="addressDistrict"  data-value={userInfo['addressDistrict']} className="district" disabled={true}/>
                    <Input id="addressStreet"  placeholder="????????????" value={userInfo['addressStreet']} disabled={true} />
                  </RowBox>
                  </InputBox>
                </RowBox>
                <RowBox>
                  <InputBox>
                  <Text>??????</Text>
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
                  >????????????</Button>
                </ButtonBox>
              </Wrapper>
            </Col>
          </Row>
        </Grid>
    );
  };
  
  export default ViewUser;