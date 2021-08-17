import React from 'react';
import axios from 'axios';
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
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'baseui/modal';

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

const AddBox = styled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
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

const PDUnitList = [
  { value: '天', label: '天' },
  { value: '月', label: '月' },
  { value: '年', label: '年' },
  { value: '小時', label: '小時' },
];

interface LocationState {
  product_unit: string[],
  weight_unit: string[],
  storage: string[],
  info: {},
  type: string,
};

const AddProduct = () => {
  const [finalUnit, setFinalUnit] = useState([]);
  const [preservation, setPreservation] = useState([]);
  const [PDUnit, setPDUnit] = useState([]);
  const [unit, setUnit] = useState([]);
  const [itemsInfo, setItemsInfo] = useState({"productNumber": "", "productName":"", "specification": "", "unitPrice": "", "finalUnit": "", "weight": "", "unit": "", "PD": "", "PDUnit": "",  "preservation": "", "image": undefined, "imageInfo": "", "remark": ""});
  const [productUnits, setProductUnits] = useState([]);
  const [weightUnits, setWeightUnits] = useState([]);
  const [storage, setStorage] = useState([]);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [type, setType] = useState("add");
  const history = useHistory();
  const location = useLocation<LocationState>();

  const handleInfoChange = (e) => {
    console.log(e.target.id);
    let temp = e.target.id.split("_");
    let type = temp[0];
    itemsInfo[type] = e.target.value;
    setItemsInfo({...itemsInfo});
    if (type === 'image'){
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  }

  const closeImage = () => {
    setIsOpenImage(false);
  }

  const handleSubmit = async () => {
    try {
      // upload image
      if (image) {
        await uploadImage();
        console.log("imageurl: ", itemsInfo.image);
      }
      console.log(itemsInfo);
      let response;
      if (type === "add") {
        response = await request.post(`/product/create`, {
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
      }
      else {
        response = await request.post(`/product/${location.state.info['id']}/edit`, {
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
      }
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

  const getProductInfo = async () => {
    if (location.state.type !== "add")
      setType(location.state.type);
    else
      return;
    const productInfo = location.state.info;
    itemsInfo['productNumber'] = productInfo['product_no'];
    itemsInfo['productName'] = productInfo['name'];
    itemsInfo['specification'] = productInfo['spec'];
    itemsInfo['unitPrice'] = productInfo['price'];
    itemsInfo['finalUnit'] = productInfo['product_unit'];
    itemsInfo['weight'] = productInfo['weight'];
    itemsInfo['unit'] = productInfo['weight_unit'];
    itemsInfo['PD'] = productInfo['shelflife'];
    itemsInfo['PDUnit'] = productInfo['shelflife_unit'];
    itemsInfo['preservation'] = productInfo['storage'];
    itemsInfo['remark'] = productInfo['note'];
    itemsInfo['image'] = productInfo['picture'];
    itemsInfo['imageInfo'] = productInfo['picture_description'];
    setFinalUnit([{value: productInfo['product_unit'], label: productInfo['product_unit']}]);
    setUnit([{value: productInfo['weight_unit'], label: productInfo['weight_unit']}]);
    setPDUnit([{value: productInfo['shelflife_unit'], label: productInfo['shelflife_unit']}]);
    setPreservation([{value: productInfo['storage'], label: productInfo['storage']}]);
    console.log(productInfo)
  }

  const getProductUnits = async () => {
    const product_units = location.state.product_unit;
    const unit_list = product_units.map(element => {
      return {
        value: element,
        label: element
      };
    });
    console.log(unit_list);
    setProductUnits(unit_list);
  }

  const getWeightUnits = async () => {
    const weight_units = location.state.weight_unit;
    const weight_unit_list = weight_units.map(element => {
      return {
        value: element,
        label: element
      };
    });
    console.log(weight_unit_list);
    setWeightUnits(weight_unit_list);
  }

  const getStorage = async () => {
    const storage_arr = location.state.storage;
    const storage_list = storage_arr.map(element => {
      return {
        value: element,
        label: element
      };
    });
    console.log(storage_list);
    setStorage(storage_list);
  }

  const uploadImage = async () => {
    let data = new FormData();
    console.log(image);
    data.append("file", image);
    data.append("upload_preset", "chester");
    data.append("cloud_name", "ktgincot");
    const config = {
      headers: {"X-Requested-With": "XMLHttpRequest"},
    };
    const response = await axios.post("https://api.cloudinary.com/v1_1/ktgincot/image/upload", data, config);
    if (response) {
      console.log(response);
      console.log(response.data.url);
      itemsInfo.image = response.data.url
      setItemsInfo({...itemsInfo});
    }
  };

  useEffect(() => {
    getProductUnits();
    getWeightUnits();
    getStorage();
    getProductInfo();
  }, [])

  return (
    <Grid fluid={true}>
      <Modal onClose={closeImage} isOpen={isOpenImage}>
        <ModalHeader>照片</ModalHeader>
        <ModalBody>
          <img src={itemsInfo['image']} alt={"商品照片"}/>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeImage}>關閉</Button>
        </ModalFooter>
      </Modal>
      <Row>
        <Col md={12}>
            <Title>
                {type === "add"? "新增": type === "edit"? "編輯": "查看"}
            </Title>
            <Wrapper onChange={handleInfoChange}>
              <Heading>{type === "add"? "新增": type === "edit"? "編輯": "查看"}商品</Heading>
              <RowBox>
                <InputBox><Text>商品編號</Text><Input height='100%' id={"productNumber"} placeholder="輸入商品編號" value={itemsInfo["productNumber"]} disabled={type==="view"? true: false}/></InputBox>
                <InputBox><Text>商品名稱</Text><Input height='100%' id={"productName"} placeholder="輸入商品名稱" value={itemsInfo["productName"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>規格</Text><Input height='100%' id={"specification"} placeholder="輸入規格" value={itemsInfo["specification"]} disabled={type==="view"? true: false}/></InputBox>
                <InputBox><Text>單價</Text><Input height="100%" id={"unitPrice"} placeholder="輸入單價" value={itemsInfo["unitPrice"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>成品單位</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={productUnits} value={finalUnit} disabled={type==="view"? true: false} onChange={({ value }) => {setFinalUnit(value); itemsInfo["finalUnit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/></InputBox>
                <InputBox><Text>成品重量</Text>
                  <ContentBox>
                    <Input height="100%" id={"weight"} placeholder="輸入數字" value={itemsInfo["weight"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={weightUnits} value={unit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setUnit(value); itemsInfo["unit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>保存期限</Text>
                  <ContentBox>
                    <Input height="100%" id={"PD"} placeholder="輸入數字" value={itemsInfo["PD"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={PDUnitList} value={PDUnit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setPDUnit(value); itemsInfo["PDUnit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>保存性質</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={storage} value={preservation} disabled={type==="view"? true: false} onChange={({ value }) => {setPreservation(value); itemsInfo["preservation"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox>
                  <Text>照片</Text>
                  <ContentBox>
                    {itemsInfo["image"] !== ""? (<Button width="40%" background_color={'#FF902B'} color={'#FFFFFF'} onClick={()=>{setIsOpenImage(true)}}>查看照片</Button>):(null)}
                    <Input type="file" height="100%" id={"image"} placeholder="選擇檔案" disabled={type==="view"? true: false}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>相片說明</Text><Input height="100%" id={"imageInfo"} placeholder="輸入相片說明" value={itemsInfo["imageInfo"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>備註</Text><Input height="100px" id={"remark"} placeholder="" value={itemsInfo["remark"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <ButtonBox>
                  <Button
                    background_color={'#616D89'}
                    color={'#FFFFFF'}
                    margin={'5px'}
                    height={'60%'}
                    onClick={()=> history.push(PRODUCTS)}
                  >{type === "view"? "上一頁": "取消"}</Button>
                  {type === "view"? (
                    null
                  ):(
                    <Button
                      background_color={'#FF902B'}
                      color={'#FFFFFF'}
                      margin={'5px'}
                      height={'60%'}
                      onClick={handleSubmit}
                    >確認送出</Button>
                  )}
                  
                </ButtonBox>
            </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};

export default AddProduct;