import React from 'react';
import { styled, withStyle } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { Heading, Title, Text } from '../../components/DisplayTable/DisplayTable';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell, StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { PURCHASING } from '../../settings/constants';
import {Modal, ModalHeader, ModalBody, ModalFooter,ModalButton} from 'baseui/modal';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { request } from '../../utils/request';
import dayjs from 'dayjs';

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

const ButtonBox = styled('div', ({}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
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

const RePurchasing = () => {
  const location = useLocation();
  const history = useHistory();
  const [commodities, setCommodities] = useState([]);
  const [vendor, setVendor] = useState({});
  const [type, setType] = useState(location.state[2]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAll, setIsOpenAll] = useState(false);
  const [selectUnit, setSelectUnit] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [reasonAll, setReasonAll] = useState("");
  const [selectIndex, setSelectIndex] = useState(-1);
  const column_names = ['進貨品名', '溯源履歷號碼', '原產地', '批號', '品牌', '幾年幾期', '數量', '單位', '製造日期', '有效日期', '單價', '總價', '備註'];

  const close = () => {
    setIsOpen(false);
  }

  const closeAll = () => {
    setIsOpenAll(false);
  }

  const getInfo = async (info) => {
    // console.log(info);
    commodities.push(...info[0]);
    // console.log(type);
    let keys = Object.keys(info[1]);
    for (let i = 0; i < keys.length; i++) {
        vendor[keys[i]] = info[1][keys[i]];
    }
    setCommodities([...commodities]);
    setVendor({...vendor});
  }

  const returnPurchase = async () => { 
    const amount_ = parseInt(amount);
    const unit = commodities[selectIndex]['unit']; 
    const reason_ = reason;
    const commodity_id = commodities[selectIndex]['id'];
    try {
      const result = await request.post(`/commodity/${commodity_id}/return`, {
        amount: amount_,
        unit: unit,
        reason: reason_
      });
      console.log(result);
      if (result) {
        const update_amount = result.data.update_amount;
        return update_amount;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const returnAll = async () => {
    console.log("return all");
    try {
      let commodities_arr = [];
      commodities.forEach(e => {
        commodities_arr.push({
          commodity_id: e['id'],
          amount: e['amount'],
          unit: e['unit']
        });
      });
      const result = await request.post(`/commodity/return-multiple`, {
        commodity_arr: commodities_arr,
        reason: reasonAll
      });
      console.log(result);
      if (result) {
        const update_arr = result.data.update_arr;
        return update_arr;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }
    
  const reimbursePurchase = async () => {
    const amount_ = parseInt(amount);
    const unit = commodities[selectIndex]['unit'];  // 直接綁定原進貨資料的單位，不能隨意填
    const reason_ = reason;
    const commodity_id = commodities[selectIndex]['id'];
    try {
      const result = await request.post(`/commodity/${commodity_id}/discard`, {
        amount: amount_,
        unit: unit,
        reason: reason_
      });
      console.log(result);
      if (result) {
        const update_amount = result.data.update_amount;
        return update_amount;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const reimburseAll = async () => {
    console.log("reimburse all");
    try {
      let commodities_arr = [];
      commodities.forEach(e => {
        commodities_arr.push({
          commodity_id: e['id'],
          amount: e['amount'],
          unit: e['unit']
        });
      });
      const result = await request.post(`/commodity/discard-multiple`, {
        commodity_arr: commodities_arr,
        reason: reasonAll
      });
      if (result) {
        const update_arr = result.data.update_arr;
        return update_arr;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const handleOpenAll = async (e) => {
    setIsOpenAll(true);
  }

  const handleOpen = (e) => {
    let index = e.target.id;
    setSelectIndex(index);
    setIsOpen(true);
    setSelectUnit(commodities[e.target.id].unit);
  }

  const handleClose = async () => {
    let update_amount = 0;
    if (type === 'return') {
      const result = await returnPurchase();
      if (result) {
        update_amount = result;
      }
    } else {
      const result = await reimbursePurchase();
      if (result) {
        update_amount = result;
      }
    }
    commodities[selectIndex]['amount'] = Number(update_amount);
    if (commodities[selectIndex]['amount'] === 0) {
      commodities.splice(selectIndex, 1);
    }
    setCommodities([...commodities]);
    close();
  } 

  const handleCloseAll = async () => {
    let update_arr = [];
    if (type === 'return') {
      const result = await returnAll();
      if (result) {
        update_arr = result;
      } 
    } else {
      const result = await reimburseAll();
      if (result) {
        update_arr = result;
      }
    }
    console.log(update_arr);
    for (let i = 0; i < update_arr.length; i++) {
      commodities[i]['amount'] = update_arr[i].update_amount;
    }
    console.log(commodities);
    setCommodities([...commodities]);
    closeAll();
  }

  useEffect(() => {
    getInfo(location.state);
  }, [])

  return (
    <Grid fluid={true}>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>{type === 'return'? '退貨': '報銷'}</ModalHeader>
        <ModalBody>
          <RowBox><InputBox><Text>{type === 'return'? '退貨': '報銷'}數量</Text>
              <Input id='amount' onChange={(e)=>{setAmount(e.target.value)}}/>
          </InputBox></RowBox>
          <RowBox><InputBox><Text>{type === 'return'? '退貨': '報銷'}單位</Text>
              <Input placeholder={selectUnit} disabled={true}/>
          </InputBox></RowBox>
          <RowBox><InputBox><Text>原因</Text>
              <Input id='reason' height='100px' onChange={(e)=>{setReason(e.target.value)}}/>
          </InputBox></RowBox>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={type === 'return'?'#F55252': '#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {handleClose();}}>{type === 'return'? '退貨': '報銷'}</Button>
        </ModalFooter>
      </Modal>
      <Modal onClose={closeAll} isOpen={isOpenAll}>
          <ModalHeader>{type === 'return'? '退貨': '報銷'}</ModalHeader>
          <ModalBody>
            <RowBox>
              <InputBox>
                <Text>原因</Text>
                <Input id='reasonAll' height='100px' onChange={(e)=>{setReasonAll(e.target.value)}}/>
              </InputBox>
            </RowBox>
          </ModalBody>
          <ModalFooter>
            <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeAll}>取消</Button>
            <Button background_color={type === 'return'?'#F55252': '#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {handleCloseAll();}}>{type === 'return'? '退貨': '報銷'}</Button>
          </ModalFooter>
      </Modal>
      <Row>
          <Col md={12}>
              <Title>查看</Title>
          </Col>
      </Row>
      <Row>
        <Col md={12}>
        <Wrapper>
          <Heading>進貨資訊</Heading>
          <ButtonBox>
            <Button margin='5px' width='120px' height='45px' background_color={type === 'return'?'#F55252': '#616D89'} color={'#FFFFFF'} onClick={handleOpenAll}>{type === 'return'? '全部退貨': '全部報銷'}</Button>
          </ButtonBox>
          <StyledRoot>
            <StyledTable>
              <StyledTableHeadRow>
                {column_names.map((column_name) => (
                    <StyledTableHeadCell>{column_name}</StyledTableHeadCell>
                ))}
                <StyledTableHeadCell>{type === 'return'? '退貨': '報銷'}</StyledTableHeadCell>
              </StyledTableHeadRow>
              {commodities.map((item) => Object.values(item))
                .map((row: Array<string>, index) => (
                  commodities[index].amount !== 0? (
                    <StyledTableBodyRow>
                    <StyledTableBodyCell>{commodities[index].name}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].trace_no}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].origin}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].batch_no}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].brand}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].produce_period}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].amount}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].unit}</StyledTableBodyCell>
                    <StyledTableBodyCell>{dayjs(commodities[index].MFG).format('YYYY-MM-DD')}</StyledTableBodyCell>
                    <StyledTableBodyCell>{dayjs(commodities[index].EXP).format('YYYY-MM-DD')}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].unit_price}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].amount * commodities[index].unit_price}</StyledTableBodyCell>
                    <StyledTableBodyCell>{commodities[index].note}</StyledTableBodyCell>
                    <StyledTableBodyCell>{type === 'return'? (
                        <Button id={index} margin='5px' width='80px' height='40px' background_color='#F55252' color={'#FFFFFF'} onClick={handleOpen}>退貨</Button>
                      ):(
                        <Button id={index} margin='5px' width='80px' height='40px' background_color='#616D89' color={'#FFFFFF'} onClick={handleOpen}>報銷</Button>
                      )}
                    </StyledTableBodyCell>
                  </StyledTableBodyRow>
                  ):(null)
                ))
              }
            </StyledTable>
          </StyledRoot>
          <ButtonBox>
            <Button margin='5px' width='80px' height='40px' background_color={type === 'return'?'#616D89': '#EAF0F9'} color={type === 'return'?'#FFFFFF': '#616D89'} onClick={()=>{history.push(PURCHASING)}}>取消</Button>
            {type === 'return'? (
              <Button margin='5px' width='120px' height='40px' background_color='#F55252' color={'#FFFFFF'} onClick={() => history.push(PURCHASING)}>完成退貨</Button>
            ):(
              <Button margin='5px' width='120px' height='40px' background_color='#616D89' color={'#FFFFFF'} onClick={() => history.push(PURCHASING)}>完成報銷</Button>
            )}
          </ButtonBox>
         
        </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};
export default RePurchasing;