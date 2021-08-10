import React from 'react';
import { styled, withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import DisplayTable from '../../components/DisplayTable/DisplayTable';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { Heading, SubHeadingLeft, SubHeadingRight, Title, Text } from '../../components/DisplayTable/DisplayTable';
import Select from '../../components/Select/Select';
import { PRODUCTS } from '../../settings/constants';
import { useState } from 'react';
import { Datepicker } from 'baseui/datepicker';
import { useEffect } from 'react';
import tw from 'date-fns/locale/zh-TW';
import dayjs from 'dayjs';
import { useHistory, useLocation } from 'react-router-dom';
import { request } from "../../utils/request";
import { getUnpackedSettings } from 'http2';
import { getHeapSpaceStatistics } from 'v8';

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

const ContentBox = styled('div', () => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  
  
}));

const preservationList = [
  { value: '常溫', label: '常溫' },
  { value: '冷藏', label: '冷藏' },
  { value: '冷凍', label: '冷凍' },
];


const PDUnitList = [
  { value: '天', label: '天' },
  { value: '月', label: '月' },
  { value: '年', label: '年' },
  { value: '小時', label: '小時' },
];

const unitList = [
  { value: '碗', label: '碗' },
  { value: '盤', label: '盤' },
  { value: '杯', label: '杯' },
];

interface LocationState {
  specs: string[],
  units: string[]
};

const AddProduct = () => {

    const [specification, setSpecification] = useState([]);
    const [finalUnit, setFinalUnit] = useState([]);
    const [preservation, setPreservation] = useState([]);
    const [PDUnit, setPDUnit] = useState([]);
    const [unit, setUnit] = useState([]);
    const [itemsInfo, setItemsInfo] = useState({"productNumber": "", "productName":"", "specification": "", "unitPrice": "", "finalUnit": "", "weight": "", "unit": "", "PD": "", "PDUnit": "",  "preservation": "", "image": "", "imageInfo": "", "remark": ""});
    const [productSpecs, setProductSpecs] = useState([]);
    const [productUnits, setProductUnits] = useState([]);
    const history = useHistory();
    const location = useLocation<LocationState>();

    const handleInfoChange = (e) => {
      console.log(e.target.id);
      let temp = e.target.id.split("_");
      let type = temp[0];
      itemsInfo[type] = e.target.value;
      setItemsInfo({...itemsInfo});
    }

    const handleSubmit = async () => {
      try {
        const response = await request.post(`/product/create`, {
          product_no: itemsInfo.productNumber,
          name: itemsInfo.productName,
          spec: itemsInfo.specification,
          product_unit: itemsInfo.finalUnit,
          price: itemsInfo.unitPrice,
          weight: itemsInfo.weight,
          weight_unit:  itemsInfo.unit,
          shelf_life: itemsInfo.PD,
          shelf_life_unit: itemsInfo.PDUnit,
          storage: itemsInfo.preservation,
          picture: itemsInfo.image,
          picture_description: itemsInfo.imageInfo,
          note: itemsInfo.remark
        });
        history.push(PRODUCTS);
        if (response) {
          console.log("Add product success");
        } else {
          console.log("Add product failed");
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function getProductSpecs() {
      const product_specs = location.state.specs;
      const spec_list = product_specs.map(element => {
        return {
          value: element["spec"],
          label: element["spec"]
        };
      });
      console.log(spec_list);
      setProductSpecs(spec_list);
    }

    async function getProductUnits() {
      const product_units = location.state.units;
      const unit_list = product_units.map(element => {
        return {
          value: element["unit"],
          label: element["unit"]
        };
      });
      console.log(unit_list);
      setProductUnits(unit_list);
    }

    useEffect(() => {
      getProductSpecs();
      getProductUnits();
      console.log(itemsInfo);
    }, [itemsInfo])
  

    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>
                    新增
                </Title>
                <Wrapper onChange={handleInfoChange}>
                  <Heading>新增商品</Heading>
                  <RowBox>
                  
                    <InputBox><Text>商品編號</Text><Input height='100%' id={"productNumber"} placeholder="輸入商品編號"/></InputBox>
                    <InputBox><Text>商品名稱</Text><Input height='100%' id={"productName"} placeholder="輸入商品名稱"/></InputBox>
                  </RowBox>
                  <RowBox>
                    <InputBox><Text>規格</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={productSpecs} value={specification}
                      onChange={({ value }) => {setSpecification(value); itemsInfo["specification"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/></InputBox>
                    <InputBox><Text>單價</Text><Input height="100%" id={"unitPrice"} placeholder="輸入單價"/></InputBox>
                  </RowBox>
                  <RowBox>
                    <InputBox><Text>成品單位</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={productUnits} value={finalUnit}
                      onChange={({ value }) => {setFinalUnit(value); itemsInfo["finalUnit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/></InputBox>
                    <InputBox><Text>成品重量</Text>
                      <ContentBox>
                        <Input height="100%" id={"weight"} placeholder="輸入數字"/>
                        <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit}
                          onChange={({ value }) => {setUnit(value); itemsInfo["unit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                      </ContentBox>
                    </InputBox>
                  </RowBox>
                  <RowBox>
                    <InputBox><Text>保存期限</Text>
                      <ContentBox>
                        <Input height="100%" id={"PD"} placeholder="輸入數字"/>
                        <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={PDUnitList} value={PDUnit}
                          onChange={({ value }) => {setPDUnit(value); itemsInfo["PDUnit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                      </ContentBox>
                    </InputBox>
                    <InputBox><Text>保存性質</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={preservationList} value={preservation}
                          onChange={({ value }) => {setPreservation(value); itemsInfo["preservation"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/></InputBox>
                  </RowBox>
                  <RowBox>
                    <InputBox><Text>照片</Text><Input height="100%" id={"image"} placeholder="選擇檔案"/></InputBox>
                    <InputBox><Text>相片說明</Text><Input height="100%" id={"imageInfo"} placeholder="輸入相片說明"/></InputBox>
                  </RowBox>
                  <RowBox>
                    <InputBox><Text>備註</Text><Input height="100px" id={"remark"} placeholder="" /></InputBox>
                  </RowBox>
                </Wrapper>
            </Col>
          </Row>
        </Grid>
      );
  };
  
  export default AddProduct;