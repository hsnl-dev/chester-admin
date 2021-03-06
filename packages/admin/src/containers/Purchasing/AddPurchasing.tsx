import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { styled, withStyle, useStyletron } from 'baseui';
import {Modal, ModalHeader, ModalBody, ModalFooter, ModalButton} from 'baseui/modal';
import { Datepicker } from 'baseui/datepicker';
import tw from 'date-fns/locale/zh-TW';
import moment from 'moment';

import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, SubHeadingLeft, SubHeadingRight, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { PURCHASING, IMPORTPURCHASING } from '../../settings/constants';
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

const AddPurchasing = () => {
  const itemsInfoTemp = {"name": "", "batchNumber":"", "origin": "", "brand": "", "amount": "", "unit": "g", "PD": null, "Exp": null, "unitPrice": "", "totalPrice": "", "remark": "", "period": null, "periodDisable": true};
  const [vendor, setVendor] = useState([]);
  const [newVendor, setNewVendor] = useState({"vendor_name": "", "note": ""});
  const [vendorList, setVendorList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [itemsInfo, setItemsInfo] = useState([]);
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [purchasingDate, setPurchasingDate] = useState(new Date());
  const location = useLocation<LocationState>();

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
  
  const handleVendor = ({ value }) => {
    console.log(value);
    setVendor(value);
  }

  const handleImport = () => {
    console.log(vendor);
    if (vendor.length !== 0) {
      console.log(vendor);
      history.push({
        pathname: IMPORTPURCHASING,
        state: {vendor_id: vendor[0].value}
      });
    } else {
      setIsOpenError(true);
    }
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

  const handleSubmit = async () => {
    itemsInfo.forEach(async function (element) {
      try {
        console.log("vendor: ", vendor[0].value);
        console.log("element: ", element);
        const response = await request.post(`/commodity/create`, {
          vendor_id: vendor[0].value,
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
    if (vendor.length === 0) {
      setCheckMessage("請選擇廠商");
      setIsOpenCheck(true);
    } else {
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
        vendorList.push({value: data.vendor_id, label: newVendor["vendor_name"]});
        console.log(vendorList);
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

  const getVendors = async () => {
    const vendors = location.state.params;
    console.log("vendor in addpurchasing", vendors);
    const vendor_list = vendors.map(element => {
      return {
        value: element["id"],
        label: element["name"]
      }
    });
    console.log(vendor_list);
    setVendorList(vendor_list);
  }

  useEffect(() => {
    getVendors();
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
                新增
            </Title>
            <Wrapper>
                <Heading>{'進貨資訊'}</Heading>
                <RowBox>
                  <InputBox>
                    <Text>{'廠商名稱'}</Text>
                    <VendorBox>
                        <Select
                            options={vendorList}
                            placeholder={'選擇'}
                            searchable={false}
                            value={vendor}
                            labelKey="label"
                            valueKey="value"
                            onChange={handleVendor}
                        />
                        <Button
                            height={'48px'}
                            background_color={'#FFD2AB'}
                            color={'#FF902B'}
                            onClick={()=>{setIsOpen(true);}}
                        >+</Button>
                    </VendorBox>
                  </InputBox>
                  <InputBox>
                    <Text>進貨日期</Text>
                    <Datepicker locale={tw} value={purchasingDate} onChange={handleDate} />
                  </InputBox>
                </RowBox>
                <RowBox>
                  <div>
                    {itemsInfo.length == 0 ? (
                      <Button
                        background_color={'#FF902B'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={addOneItems}
                      >新增品項</Button>
                    ):(null)}
                    <Button
                        background_color={'#40C057'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                    >掃描進貨</Button>
                    <Button
                        background_color={'#2F8BE6'}
                        color={'#FFFFFF'}
                        margin={'5px'}
                        height={'60%'}
                        onClick={handleImport}
                    >匯入進貨</Button>
                  </div>
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
                      <InputBox><Text>進貨品名</Text><Input id={"name_" + index} placeholder="輸入品名"/></InputBox>
                      <InputBox><Text>溯源履歷號碼</Text><Input id={"traceNumber_" + index}   placeholder="輸入溯源履歷號碼"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>原產地</Text><Input id={"origin_" + index} placeholder="輸入原產地"/></InputBox>
                      <InputBox><Text>品牌</Text><Input id={"brand_" + index} placeholder="輸入品牌"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>批號</Text><Input id={"batchNumber_" + index} placeholder="輸入批號"/></InputBox>
                      <InputBox><Text>幾年幾期</Text><Input id={"period_" + index} placeholder="輸入三光米幾年幾期" disabled={itemsInfo[index]["periodDisable"]}/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>數量</Text><Input type="Number" id={"amount_" + index} placeholder="輸入數量"/></InputBox>
                      <InputBox><Text>單位</Text><Select placeholder="g" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit}
                        onChange={({ value }) => {setUnit(value); itemsInfo[index]["unit"]=value[0]['value']; setItemsInfo([...itemsInfo])}}/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>製造日期</Text><Datepicker locale={tw}  onChange={({date})=>{itemsInfo[index]["PD"]=date; setItemsInfo([...itemsInfo])}}/></InputBox>
                      <InputBox><Text>有效日期</Text><Datepicker locale={tw} onChange={({date})=>{itemsInfo[index]["Exp"]=date; setItemsInfo([...itemsInfo])}} /></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>單價</Text><Input type="text" id={"unitPrice_" + index} placeholder="輸入單價"/></InputBox>
                      <InputBox><Text>總價</Text><Input type="Number" value={itemsInfo[index]["totalPrice"]} id={"totalPrice_" + index} placeholder="輸入總價"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>備註</Text><Input id={"remark_" + index} placeholder="" height="100px"/></InputBox>
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
                <div>
                  <Button
                    background_color={'#FF902B'}
                    color={'#FFFFFF'}
                    margin={'5px'}
                    height={'60%'}
                    onClick={addOneItems}
                  >新增品項</Button>
                </div>
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
};
  
  export default AddPurchasing;