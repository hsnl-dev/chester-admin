import React, { useCallback } from 'react';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { SelectBox } from '../../components/Select/Select';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { Wrapper, Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import NoResult from '../../components/NoResult/NoResult';
import { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import {Modal, ModalHeader, ModalBody, ModalFooter,ModalButton} from 'baseui/modal';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';
import { ADDUSER, VIEWUSER } from '../../settings/constants';
import { request } from '../../utils/request';
import { userInfo } from 'os';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

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

const ButtonBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
}))

const Text = styled('span', ({ $theme }) => ({
  ...$theme.typography.fontBold24,
  color: $theme.colors.textDark,
  marginBottom: '20px',
  width: "100%",
  display: "flex",
}));

export default function Settings() {
  const column_names = ['帳號', '姓名', '權限角色', '操作'];
  const amountSelectOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];
  const [displayAmount, setDisplayAmount] = useState([]);
  const [members, setMembers] = useState([]);
  const [partner, setPartner] = useState({});
  const [selectUserId, setSelectUserId] = useState();
  const [displayMembers, setDisplayMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userActivate, setUserActivate] = useState();
  const [role, setRole] = useState(-1);
  const [partnerData, setPartnerData] = useState([]);
  const data = [{'account': '123456789','name': 'ABC', 'authority': '店家管理者'}]
  const history = useHistory();

  const close = () => {
    setIsOpen(false);
  }

  function amountChange({ value }) {
    setDisplayAmount(value);
    console.log(displayAmount)
  }

  const editUser = (e) => {  // 跳到有form的頁面
    console.log(e.target.id);
    console.log(members[e.target.id]);
    let chooseInfo = members[e.target.id];
    history.push(ADDUSER, [chooseInfo, partner, true]);
    
  }

  const addUser = () => {
    history.push(ADDUSER, [{}, partner, false])
  }

  const activateUserTemp = (e) => {
    let user_id = members[e.target.id]['user_id'];
    let activate = members[e.target.id]['activate'];
    setUserActivate(activate);
    setSelectUserId(user_id);
    setIsOpen(true);
  }

  const de_activateUser = async () => {   // 需要 user_id
    let user_id = selectUserId;
    try {
      if (userActivate === 1) {
        const result = await request.post(`/users/${user_id}/deactivate`);
        console.log(result);
      }
      else {
        const result = await request.post(`/users/${user_id}/activate`);
        console.log(result);
      }
      getMembers();
    } catch (err) {
      console.log(err);
    }
  }

  const viewUser = (e) => {
    let chooseInfo = members[e.target.id];
    history.push(VIEWUSER, [chooseInfo, partner]);
  }

  const handleSearch = () => {  // 資料全部都在members裡面，前端根據條件filter就可以
    
  }

  const getRole = async () => {
    try {
      const result = await request.get(`/users/role`)
      const memberRole = result.data.role;
      // console.log(memberRole);
      setRole(memberRole);
      console.log(role)
    } catch (err) {
      console.log(err);
    }
  }

  async function getMembers() {
    try {
      const result = await request.get(`/users`);
      const member_arr = result.data['members'];
      console.log(member_arr);
      let displayTemp = [];
      for (let i = 0; i < member_arr.length; i++) {
        let role_ = '系統維護';
        if (member_arr[i]['role'] === 1)
          role_ = '店家管理者';
        else if (member_arr[i]['role'] === 2)
          role_ = '店家使用者';
        displayTemp.push({'username': member_arr[i]['username'], 'name': member_arr[i]['name'], 'role': role_, 'activate': member_arr[i]['activate']})
      }
      console.log(displayTemp);
      setDisplayMembers([...displayTemp]);
      setMembers(member_arr);
      setPartner(result.data['partner']);
      const partner_data = result.data.partner;
      setPartnerData(partner_data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getRole();
    getMembers();
  }, []);

  return (
    <Grid fluid={true}>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>{userActivate === 1? '停用帳號': '啟用帳號'}</ModalHeader>
        <ModalBody>
          {userActivate === 1? '是否確定停用?': '是否確定啟用?'}
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {close(); de_activateUser();}}>確定</Button>
        </ModalFooter>
      </Modal>
      <Row>
        <Col md={12}>
          <Title>
            系統管理
          </Title>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Wrapper>
            <Text>帳號管理</Text>
            {role !== 2? (
              <ButtonBox>
                <Button 
                  background_color={'#FF902B'}
                  color={'#FFFFFF'}
                  margin={'5px'}
                  height={'70%'}
                  width={'15%'}
                  onClick={addUser}
                >新增使用者</Button>
              </ButtonBox>
            ):(null)}
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
              <SubHeadingRight>
                <SearchBox>
                  Search:
                  <Input onChange={handleSearch}/>
                </SearchBox>
              </SubHeadingRight>
            </Heading>
            <div>
              {displayMembers.length !== 0 ? (
                <StyledTable>
                  <tr>
                      {column_names.map((column_name) => (
                          <StyledTh>{column_name}</StyledTh>
                      ))}
                  </tr>
                    {displayMembers.map((item) => Object.values(item))
                    .map((row: Array<string>, index) => (
                        <tr>
                          <React.Fragment key={index}>
                            <StyledTd>{row[0]}</StyledTd> 
                            <StyledTd>{row[1]}</StyledTd>
                            <StyledTd>{row[2]}</StyledTd>
                            <StyledTd>
                              <StyledButtonBox> 
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={viewUser}>查看</Button>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={editUser}>編輯</Button>
                                <Button id={index} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} disabled={role === 2? true: false} onClick={activateUserTemp}>{(parseInt(row[3]) === 1? "停用": "啟用")}</Button>
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
}
