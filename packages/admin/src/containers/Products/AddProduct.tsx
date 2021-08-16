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
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
];

interface LocationState {
  specs: string[],
  units: string[],
  info: {},
  type: string,
};

const AddProduct = () => {
  const [specification, setSpecification] = useState([]);
  const [finalUnit, setFinalUnit] = useState([]);
  const [preservation, setPreservation] = useState([]);
  const [PDUnit, setPDUnit] = useState([]);
  const [unit, setUnit] = useState([]);
  const [addName, setAddName] = useState("");
  const [newSpec, setNewSpec] = useState("");
  const [newFinalUnit, setNewFinalUnit] = useState("");
  const [itemsInfo, setItemsInfo] = useState({"productNumber": "", "productName":"", "specification": "", "unitPrice": "", "finalUnit": "", "weight": "", "unit": "", "PD": "", "PDUnit": "",  "preservation": "", "image": undefined, "imageInfo": "", "remark": ""});
  const [productSpecs, setProductSpecs] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isOpen, setIsOpen] = useState(false);
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

  const close = () => {
    setIsOpen(false);
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
    setSpecification([{value: productInfo['spec'], label: productInfo['spec']}]);
    setFinalUnit([{value: productInfo['product_unit'], label: productInfo['product_unit']}]);
    setUnit([{value: productInfo['weight_unit'], label: productInfo['weight_unit']}]);
    setPDUnit([{value: productInfo['shelflife_unit'], label: productInfo['shelflife_unit']}]);
    setPreservation([{value: productInfo['storage'], label: productInfo['storage']}]);
    console.log(productInfo)
  }

  const getProductSpecs = async () => {
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

  const getProductUnits = async () => {
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

  const createProductSpec = async () => {
    try {
      const response = await request.post(`/product/create-spec`, {
        spec: newSpec,
      });
      const data = response.data;
      if (data.status === 1) {
        console.log(data.message);
        setProductSpecs([...productSpecs, {value: newSpec, label: newSpec}]);
      } else if (data.status === 0) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
    close();
  };

  const createProductUnit = async () => {
    try {
      const response = await request.post(`/product/create-unit`, {
        unit: newFinalUnit,
      });
      const data = response.data;
      console.log(data);
      if (data.status === 1) {
        console.log(data.message);
        setProductUnits([...productUnits, {value: newFinalUnit, label: newFinalUnit}]);
      } else if (data.status === 0) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
    close();
  };

  const handleAddSpecUnit = (e) => {
    if (e.target.id === 'spec')
      setAddName("規格");
    else
      setAddName("成品單位");
    setIsOpen(true);
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
    getProductSpecs();
    getProductUnits();
    getProductInfo();
  }, [])

  return (
    <Grid fluid={true}>
      <Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>新增{addName}</ModalHeader>
        <ModalBody>
          <RowBox><InputBox><Text>{addName}</Text>
            <Input  placeholder={"輸入" + addName} onChange={(e)=>{addName === '規格'? setNewSpec(e.target.value): setNewFinalUnit(e.target.value)}}/>
          </InputBox></RowBox>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {addName === '規格'? createProductSpec(): createProductUnit()}}>新增</Button>
        </ModalFooter>
      </Modal>
      <Modal onClose={closeImage} isOpen={isOpenImage}>
        <ModalHeader>照片</ModalHeader>
        <ModalBody>
          <img src={itemsInfo['image']}/>
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
                <InputBox><Text>規格</Text><AddBox><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={productSpecs} value={specification} disabled={type==="view"? true: false} onChange={({ value }) => {setSpecification(value); itemsInfo["specification"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                  <Button id="spec" height={'48px'} background_color={'#FFD2AB'} color={'#FF902B'} onClick={handleAddSpecUnit} disabled={type==="view"? true: false}>+</Button></AddBox></InputBox>
                <InputBox><Text>單價</Text><Input height="100%" id={"unitPrice"} placeholder="輸入單價" value={itemsInfo["unitPrice"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>成品單位</Text><AddBox><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={productUnits} value={finalUnit} disabled={type==="view"? true: false} onChange={({ value }) => {setFinalUnit(value); itemsInfo["finalUnit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                  <Button id="finalUnit" height={'48px'} background_color={'#FFD2AB'} color={'#FF902B'} onClick={handleAddSpecUnit} disabled={type==="view"? true: false}>+</Button></AddBox></InputBox>
                <InputBox><Text>成品重量</Text>
                  <ContentBox>
                    <Input height="100%" id={"weight"} placeholder="輸入數字" value={itemsInfo["weight"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setUnit(value); itemsInfo["unit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>保存期限</Text>
                  <ContentBox>
                    <Input height="100%" id={"PD"} placeholder="輸入數字" value={itemsInfo["PD"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={PDUnitList} value={PDUnit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setPDUnit(value); itemsInfo["PDUnit"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>保存性質</Text><Select placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={preservationList} value={preservation} disabled={type==="view"? true: false} onChange={({ value }) => {setPreservation(value); itemsInfo["preservation"]=value[0]['value']; setItemsInfo({...itemsInfo})}}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox>
                  <Text>照片</Text>
                  <ContentBox>
                    {itemsInfo["image"] !== ""? (<Button width="40%" background_color={'#FF902B'} color={'#FFFFFF'} onClick={()=>{setIsOpenImage(true)}}>查看照片</Button>):(null)}
                    <Input type="file" height="100%" id={"image"} placeholder="選擇檔案" disabled={type==="view"? true: false}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>相片說明</Text><Input height="100%" id={"imageInfo"} placeholder="輸入相片說明" disabled={type==="view"? true: false}/></InputBox>
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