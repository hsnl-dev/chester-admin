import React from 'react';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { SelectBox } from '../../components/Select/Select';
import { Wrapper, Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import NoResult from '../../components/NoResult/NoResult';
import { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { useHistory } from 'react-router-dom';
import { ADDUSER, VIEWUSER } from '../../settings/constants';
import { request } from '../../utils/request';

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

const RowBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: '10px',
  padding: '0px'
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
  const [amountTemp, setAmountTemp] = useState(10);
  const [members, setMembers] = useState([]);
  const [partner, setPartner] = useState({});
  const [selectUserId, setSelectUserId] = useState();
  const [displayMembers, setDisplayMembers] = useState([]);
  const [displayTemp, setDisplayTemp] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userActivate, setUserActivate] = useState();
  const [role, setRole] = useState([-1]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(2);
  const [nextClick, setNextClick] = useState(true);
  const [pastClick, setPastClick] = useState(false);
  const history = useHistory();

  const close = () => {
    setIsOpen(false);
  }

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
      setDisplayMembers(displayTemp.slice(0, amount));
      setNextClick(true);
    }
    else {
      setDisplayMembers(displayTemp);
      setNextClick(false);
    }
  }

  const editUser = (e) => {  // 跳到有form的頁面
    let chooseInfo = members[e.target.id];
    history.push(ADDUSER, [chooseInfo, partner, true]);
    
  }

  const addUser = () => {
    history.push(ADDUSER, [{}, partner, false]);
  }

  const viewUser = (e) => {
    let chooseInfo = members[e.target.id];
    history.push(VIEWUSER, [chooseInfo]);
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

  const handleSearch = (e) => {  // 資料全部都在members裡面，前端根據條件filter就可以
    let temp = [];
    let value = e.target.value;
    if (value !== "") {
      for (let i = 0; i < displayTemp.length; i++) {
        let info = displayTemp[i];
        if (info.username.indexOf(value) !== -1 || info.name.indexOf(value) !== -1 || info.role.indexOf(value) !== -1) {
          temp.push(info);
        }
      }
      setDisplayMembers(temp);
    }
    else {
      setDisplayMembers(displayTemp);
    }
  }

  const getRole = async () => {
    try {
      const result = await request.get(`/users/role`)
      const memberRole = result.data.role;
      role[0] = memberRole;
      setRole([memberRole]);
    } catch (err) {
      console.log(err);
    }
  }

  async function getMembers() {
    try {
      const result = await request.get(`/users`);
      console.log(result);
      const member_arr = result.data;
      const current_user = localStorage.getItem('name');
      for (let i = 0; i < member_arr.length; i++) {
        let role_ = '系統維護';
        if (member_arr[i]['role'] === 1)
          role_ = '店家管理者';
        else if (member_arr[i]['role'] === 2)
          role_ = '店家使用者';
        if ((role[0] === 0) || (role[0] === 1 && role_ !== "系統維護") || (role[0] === 2 && current_user === member_arr[i]['username'])) 
          displayTemp.push({'index': i, 'username': member_arr[i]['username'], 'name': member_arr[i]['name'], 'role': role_, 'activate': member_arr[i]['activate']})
      }
      setDisplayMembers(displayTemp.slice(0, amountTemp));
      setMaxPage(Math.ceil(displayTemp.length/amountTemp));
      setNextClick(page === Math.ceil(displayTemp.length/amountTemp)? false: true)
      setMembers(member_arr);
      setPartner(member_arr[0]);
    } catch (err) {
      console.log(err);
    }
  }

  const pagePast = () => {
    if (page !== 1) {
      let newPage = page - 1;
      let amount = displayAmount.length !== 0? displayAmount[0].value: amountTemp;
      setPage(newPage);
      setDisplayMembers(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
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
      setDisplayMembers(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
      setPastClick(true);
      if (newPage === maxPage)
        setNextClick(false);
      else
        setNextClick(true);
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
            {role[0] !== 2? (
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
                            <StyledTd>{row[1]}</StyledTd> 
                            <StyledTd>{row[2]}</StyledTd>
                            <StyledTd>{row[3]}</StyledTd>
                            <StyledTd>
                              <StyledButtonBox> 
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={viewUser}>查看</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={editUser}>編輯</Button>
                                <Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} disabled={role[0] === 2? true: false} onClick={activateUserTemp}>{(parseInt(row[4]) === 1? "停用": "啟用")}</Button>
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
                <Button margin='5px' width='95px' height='30px' disabled={!pastClick} background_color={pastClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pagePast}>上一頁</Button>
                {page}
                <Button margin='5px' width='95px' height='30px' disabled={!nextClick} background_color={nextClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pageNext}>下一頁</Button>
              </div>
            </RowBox>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
