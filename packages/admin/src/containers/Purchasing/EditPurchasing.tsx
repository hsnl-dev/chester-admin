import React from 'react';
import { styled, withStyle } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { Heading, Title, Text } from '../../components/DisplayTable/DisplayTable';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell, StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';
import {Modal, ModalHeader, ModalBody, ModalFooter, ModalButton} from 'baseui/modal';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { PURCHASING, IMPORTPURCHASING } from '../../settings/constants';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { Datepicker } from 'baseui/datepicker';
import { request } from "../../utils/request";
import moment from 'moment';

import tw from 'date-fns/locale/zh-TW';
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

const VendorBox = styled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
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

const unitList = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
];

interface LocationState {
    params: string[]
  };

const EditPurchasing = () => {
    const itemsInfoTemp = {"id": "", "name": "", "traceNumber": "", "batchNumber":"", "origin": "", "brand": "", "amount": "", "unit": "g", "PD": "", "Exp": "", "unitPrice": "", "totalPrice": "", "remark": "", "period": null, "periodDisable": true};
    const [vendor, setVendor] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenError, setIsOpenError] = useState(false);
    const [isOpenCheck, setIsOpenCheck] = useState(false);
    const [checkMessage, setCheckMessage] = useState("");
    const [newVendor, setNewVendor] = useState({"vendor_name": "", "note": ""});
    const [vendorList, setVendorList] = useState([]);
    const [itemsInfo, setItemsInfo] = useState([]);
    const [unit, setUnit] = useState([]);
    const [purchasingDate, setPurchasingDate] = useState(new Date());
    const location = useLocation<LocationState>();
    const history = useHistory();

    const close = () => {
        setIsOpen(false);
    }

    const closeError = () => {
        setIsOpenError(false);
    }

    const closeCheck = () => {
      setIsOpenCheck(false);
    }

    const handleDate = ({date}) => {
      setPurchasingDate(date);
    }

    const getInfo = async (info) => {
        console.log(info);
        let commodities = info[0];
        let keys = Object.keys(info[1]);
        vendor['value'] = info[1].id;
        vendor['label'] = info[1].name;
        for (let i = 0; i < info[2].length; i++) {
          vendorList.push({value: info[2][i].id, label: info[2][i].name});
        }
        commodities.forEach(element => {
          let temp = {};
          temp['id'] = element.id;
          temp['name'] = element.name;
          temp['traceNumber'] = element.trace_no;
          temp['origin'] = element.origin;
          temp['batchNumber'] = element.batch_no;
          temp['brand'] = element.brand;
          temp['amount'] = element.amount;
          temp['unit'] = element.unit;
          temp['PD'] = element.MFG;
          temp['Exp'] = element.EXP;
          temp['unitPrice'] = element.unit_price;
          temp['totalPrice'] = element.gross_price;
          temp['remark'] = element.note;
          temp['period'] = element.produce_period;
          if (temp['brand'] === "三光米")
            temp['periodDisable'] = false;
          else
            temp['periodDisable'] = true;
          itemsInfo.push(temp);
        });
        
        console.log(itemsInfo)
        setItemsInfo([...itemsInfo]);
        setVendor({...vendor});
        console.log(vendor)
        setVendorList([...vendorList]);
        
    }

    const addOneItems = () => {
        setItemsInfo([...itemsInfo, itemsInfoTemp]);
    }
    
    const handleInfoChange = (e) => {
      console.log(e.target.id);
      let temp = e.target.id.split("_");
      let type = temp[0];
      let index = temp[1];
      itemsInfo[index][type] = e.target.value;
      if (itemsInfo[index].amount !== "" && itemsInfo[index].unitPrice !== "") {
        let amount = parseInt(itemsInfo[index]['amount']);
        let unitPrice = itemsInfo[index]['unitPrice'];
        let totalPrice = amount* unitPrice;
        itemsInfo[index].totalPrice = String(totalPrice);
      }
      if (type === "brand") {
        if (e.target.value === "三光米")
          itemsInfo[index].periodDisable = false;
        else
          itemsInfo[index].periodDisable = true;
      }
      setItemsInfo([...itemsInfo]);
    }

    const createVendor = async () => {
        console.log(newVendor);
        try {
          const response = await request.post(`/commodity/create-vendor`, {
            vendor_name: newVendor["vendor_name"],
            note: newVendor["note"],
          });
          const data = response.data;
          if (data.status === 1) {
            vendorList.push({value: vendorList.length, label: newVendor["vendor_name"]});
            setVendorList(vendorList);
          } else if (data.status === 0) {
            console.log(data.message);
          } else {
            console.log(data.message);
          }
        } catch (err) {
          console.log(err);
        }
        close();
    }

    const handleVendor = ({ value }) => {
      console.log(value);
      setVendor(value);
    }
    
    const handleImport = () => {
      console.log(vendor);
      if (Object.keys(vendor).length !== 0) {
        console.log(vendor);
        history.push({
          pathname: IMPORTPURCHASING,
          state: {vendor_id: vendor['value']}
        });
      } else {
        setIsOpenError(true);
      }
    }

    const handleSubmit = async () => {
      itemsInfo.forEach(async function (element) {
        try {
          console.log("vendor: ", vendor['value']);
          console.log("element: ", element);
          const response = await request.post(`/commodity/${element.id}/edit`, {
            name: element.name,
            trace_no: element.traceNumber,
            batch_no: element.batchNumber,
            origin: element.origin,
            brand: element.brand,
            amount: element.amount,
            unit:  element.unit,
            MFG: moment(element.PD).format("YYYY-MM-DD"),
            EXP: moment(element.Exp).format("YYYY-MM-DD"),
            unit_price: element.unitPrice,
            gross_price: element.totalPrice,
            note: element.remark,
            produce_period: element.period
          });
          
          if (response) {
            console.log("Add commodity successful");
          } else {
            console.log("Add commodity failed");
          }
        } catch (err) {
          console.log(err);
        }
      });
      history.push(PURCHASING);
    }

    const checkItemInfo = () => {
      let check = true;
      if (itemsInfo.length >= 0) {
        for (let i = 0; i < itemsInfo.length; i++) {
          let element = itemsInfo[i];
          if (element.name === "") {
            setCheckMessage("請填寫品名");
            setIsOpenCheck(true);
            check = false;
            break;
          } else if (element.origin === "") {
            setCheckMessage("請填寫原產地");
            setIsOpenCheck(true);
            check = false;
            break;
          } else if (element.Exp === null ) {
            setCheckMessage("請選擇有效日期");
            setIsOpenCheck(true);
            check = false;
            break;
          } else if (element.PD === null ) {
            setCheckMessage("請選擇製造日期");
            setIsOpenCheck(true); 
            check = false;
            break;
          } else if (element.amount === "") {
            setCheckMessage("請填寫數量");
            setIsOpenCheck(true);
            check = false;
            break;
          }
        }
        if (check) {
          handleSubmit();
        }
        console.log(itemsInfo);
      } else {
        setCheckMessage("請新增品項");
        setIsOpenCheck(true);
      }
    }
    useEffect(() => {
        getInfo(location.state);
    }, [])

    return (
        <Grid fluid={true}>
          <Modal onClose={close} isOpen={isOpen}>
            <ModalHeader>新增廠商</ModalHeader>
            <ModalBody>
              <RowBox><InputBox><Text>廠商名稱</Text><Input  placeholder="輸入名稱" onChange={(e)=>{newVendor["vendor_name"]=e.target.value; setNewVendor({...newVendor})}}/></InputBox></RowBox>
              <RowBox><InputBox><Text>備註</Text><Input height="100px" placeholder="備註" onChange={(e)=>{newVendor["note"]=e.target.value; setNewVendor({...newVendor})}}/></InputBox></RowBox>
            </ModalBody>
            <ModalFooter>
              <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
              <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={createVendor}>新增</Button>
            </ModalFooter>
          </Modal>
          <Modal onClose={closeError} isOpen={isOpenError}>
            <ModalHeader>匯入進貨</ModalHeader>
            <ModalBody>
              <Text>請先選擇進貨廠商</Text>
            </ModalBody>
            <ModalFooter>
              <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeError}>確認</Button>
            </ModalFooter>
          </Modal>
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
                <Title>
                    編輯
                </Title>
                <Wrapper>
                    <Heading>{'進貨資訊'}</Heading>
                    <RowBox>
                      <InputBox>
                        <Text>{'廠商名稱'}</Text>
                        <VendorBox>
                            <Select
                                options={vendorList}
                                placeholder={''}
                                searchable={false}
                                value={vendor}
                                labelKey="label"
                                valueKey="value"
                                disabled={true}
                                onChange={handleVendor}
                            />
                            <Button
                                height={'48px'}
                                background_color={'#FFD2AB'}
                                color={'#FF902B'}
                                disabled={true}
                                onClick={()=>{setIsOpen(true);}}
                            >+</Button>
                        </VendorBox>
                      </InputBox>
                      <InputBox>
                        <Text>進貨日期</Text>
                        <Datepicker locale={tw} value={purchasingDate} disabled={true} onChange={handleDate} />
                      </InputBox>
                    </RowBox>
                    <RowBox>
                    </RowBox>
                </Wrapper>
            </Col>
          </Row>
    
          {itemsInfo.length != 0? Object(itemsInfo).map((item, index) =>{
            return (
              <Row>
                <Col md={12}>
                    <Wrapper onChange={handleInfoChange}>
                        <Heading>新增品項</Heading>
                        <RowBox>
                          <InputBox><Text>進貨品名</Text><Input id={"name_" + index} value={item.name} placeholder="輸入品名"/></InputBox>
                          <InputBox><Text>溯源履歷號碼</Text><Input id={"traceNumber_" + index} value={item.traceNumber} placeholder="輸入溯源履歷號碼"/></InputBox>
                        </RowBox>
                        <RowBox>
                          <InputBox><Text>原產地</Text><Input id={"origin_" + index} value={item.origin} placeholder="輸入原產地"/></InputBox>
                          <InputBox><Text>品牌</Text><Input id={"brand_" + index} value={item.brand} placeholder="輸入品牌"/></InputBox>
                        </RowBox>
                        <RowBox>
                            <InputBox><Text>批號</Text><Input id={"batchNumber_" + index} value={item.batchNumber} placeholder="輸入批號"/></InputBox>
                            <InputBox><Text>幾年幾期</Text><Input id={"period_" + index} placeholder="輸入三光米幾年幾期" value={item.period} disabled={item.periodDisable}/></InputBox>
                            
                        </RowBox>
                        <RowBox>
                            <InputBox><Text>數量</Text><Input type="Number" id={"amount_" + index} value={item.amount} placeholder="輸入數量"/></InputBox>
                            <InputBox><Text>單位</Text><Select placeholder="" value={{value: item.unit, label: item.unit}} labelKey="label" valueKey="value" searchable={false} options={unitList}
                                onChange={({ value }) => {setUnit(value); itemsInfo[index]["unit"]=value[0]['value']; setItemsInfo([...itemsInfo])}}/></InputBox>
                        </RowBox>
                        <RowBox>
                          <InputBox><Text>製造日期</Text><Datepicker value={new Date(item.PD)}  locale={tw} onChange={({date})=>{itemsInfo[index]["PD"]=date; setItemsInfo([...itemsInfo])}}/></InputBox>
                          <InputBox><Text>有效日期</Text><Datepicker value={new Date(item.Exp)}  locale={tw} onChange={({date})=>{itemsInfo[index]["Exp"]=date; setItemsInfo([...itemsInfo])}} /></InputBox>
                        </RowBox>
                        <RowBox>
                          <InputBox><Text>單價</Text><Input type="text" value={item.unitPrice} id={"unitPrice_" + index} placeholder="輸入單價"/></InputBox>
                          <InputBox><Text>總價</Text><Input type="Number" value={item.totalPrice} id={"totalPrice_" + index} placeholder="輸入總價"/></InputBox>
                        </RowBox>
                        <RowBox>
                          <InputBox><Text>備註</Text><Input value={item.remark} id={"remark_" + index} placeholder="" height="100px"/></InputBox>
                        </RowBox>
                    </Wrapper>
                </Col>
              </Row>
            )}) : (
            null
          )}
          {itemsInfo.length != 0? (
            <Row>
              <Col md={12}>
                <BottomWrapper>
                  <RowBox>
                    {/* <div>
                      <Button
                        background_color={'#FF902B'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={addOneItems}
                      >新增品項</Button>
                    </div> */}
                    <div>
                      <Button
                        background_color={'#616D89'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={()=> history.push(PURCHASING)}
                      >取消</Button>
                      <Button
                        background_color={'#FF902B'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={checkItemInfo}
                      >確認送出</Button>
                    </div>
                  </RowBox>      
                </BottomWrapper>
              </Col>
            </Row>):(
            null
          )}
        </Grid>
      );
}
export default EditPurchasing;