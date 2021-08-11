import React, { useCallback } from 'react';
import  SearchCard  from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { SelectBox } from '../../components/Select/Select';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import { Wrapper, Heading, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import {Modal, ModalHeader, ModalBody, ModalFooter,ModalButton} from 'baseui/modal';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';
import { ADDUSER } from '../../settings/constants';
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
  const [partner, setPartner] = useState();
  const [selectUserId, setSelectUserId] = useState();
  const [displayMembers, setDisplayMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState();
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
    if (role === 1)
      history.push(ADDUSER, [{}, partner, false])
  }

  const deleteUserTemp = (e) => {
    let user_id = members[e.target.id]['user_id'];
    setSelectUserId(user_id);
    setIsOpen(true);
  }

  const deleteUser = async () => {   // 需要 user_id
    let user_id = selectUserId;
    try {
      const result = await request.post(`/users/${user_id}/delete`);
      console.log(result);
      getMembers();
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearch = () => {  // 資料全部都在members裡面，前端根據條件filter就可以
    
  }

  const getRole = async () => {
    try {
      const result = await request.get(`/users/roles`)
      const memberRole = result.data;
      // console.log(memberRole);
      setRole(memberRole);
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
        let role = '系統維護';
        if (member_arr[i]['role'] === 1)
          role = '店家管理者';
        else if (member_arr[i]['role'] === 2)
          role = '店家使用者';
        displayTemp.push({'username': member_arr[i]['username'], 'name': member_arr[i]['name'], 'role': role})
      }
      setDisplayMembers([...displayTemp]);
      setMembers(member_arr);
      setPartner(result.data['partner']);
      const partner_data = result.data.partner;
      console.log(member_arr);
      console.log(partner_data);
      setMembers(member_arr);
      setPartnerData(partner_data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getRole();
    getMembers();
    console.log("123456789");
    console.log(displayMembers);
  }, []);

  return (
    <Grid fluid={true}>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>刪除帳號</ModalHeader>
        <ModalBody>
          確定刪除帳號?
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {close(); deleteUser();}}>確定</Button>
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
            {role != 2? (
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
            <DisplayTable
              columnNames = {column_names}
              columnData = {displayMembers}
              Button1_function = {null}
              Button1_text = ''
              Button2_function = {editUser}
              Button2_text = '編輯'
              Button3_function = {deleteUserTemp}
              Button3_text = '刪除'
            />
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
