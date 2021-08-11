import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, SubHeadingLeft, SubHeadingRight, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { PURCHASING, ADDPURCHASING } from '../../settings/constants';
import { useState, useEffect } from 'react';
import { Datepicker } from 'baseui/datepicker';
import tw from 'date-fns/locale/zh-TW';
import moment from 'moment';
import dayjs from 'dayjs';
import { useHistory, useLocation } from 'react-router-dom';
import { request } from "../../utils/request";
import {Modal, ModalHeader, ModalBody, ModalFooter,ModalButton} from 'baseui/modal';

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
    width: '40%'
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
  const itemsInfoTemp = {"name": "", "batchNumber":"", "origin": "", "brand": "", "amount": "", "unit": "g", "PD": "", "Exp": "", "unitPrice": "", "totalPrice": "", "remark": ""}
  const [vendor, setVendor] = useState([]);
  const [newVendor, setNewVendor] = useState({"vendor_name": "", "note": ""});
  const [vendorList, setVendorList] = useState([]);
  const [unit, setUnit] = useState([]);
  const [itemsInfo, setItemsInfo] = useState([]);
  const [date, setDate] = useState([]);
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation<LocationState>();

  const close = () => {
    setIsOpen(false);
  }

  const handleVendor = ({ value }) => {
    console.log(vendor);
    setVendor(value);
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
          batch_no: element.batchNumber,
          origin: element.origin,
          brand: element.brand,
          amount: element.amount,
          unit:  element.unit,
          MFG: moment(element.PD).format("YYYY-MM-DD"),
          EXP: moment(element.Exp).format("YYYY-MM-DD"),
          unit_price: element.unitPrice,
          gross_price: element.totalPrice,
          note: element.remark
        });
        history.push(PURCHASING);
        if (response) {
          console.log("Add commodity successful");
        } else {
          console.log("Add commodity failed");
        }
      } catch (err) {
        console.log(err);
      }
    });
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
      <Row>
        <Col md={12}>
            <Title>
                新增
            </Title>
            <Wrapper>
                <Heading>{'進貨資訊'}</Heading>
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
                        onClick={handleSubmit}
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
                      <InputBox><Text>批號</Text><Input id={"batchNumber_" + index} placeholder="輸入批號"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>原產地</Text><Input id={"origin_" + index} placeholder="輸入原產地"/></InputBox>
                      <InputBox><Text>品牌</Text><Input id={"brand_" + index} placeholder="輸入品牌"/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>數量</Text><Input id={"amount_" + index} placeholder="輸入數量"/></InputBox>
                      <InputBox><Text>單位</Text><Select placeholder="g" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit}
                        onChange={({ value }) => {setUnit(value); itemsInfo[index]["unit"]=value[0]['value']; setItemsInfo([...itemsInfo])}}/></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>製造日期</Text><Datepicker locale={tw}  onChange={({date})=>{itemsInfo[index]["PD"]=date; setItemsInfo([...itemsInfo])}}/></InputBox>
                      <InputBox><Text>有效日期</Text><Datepicker locale={tw} onChange={({date})=>{itemsInfo[index]["Exp"]=date; setItemsInfo([...itemsInfo])}} /></InputBox>
                    </RowBox>
                    <RowBox>
                      <InputBox><Text>單價</Text><Input id={"unitPrice_" + index} placeholder="輸入單價"/></InputBox>
                      <InputBox><Text>總價</Text><Input id={"totalPrice_" + index} placeholder="輸入總價"/></InputBox>
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
                    onClick={handleSubmit}
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