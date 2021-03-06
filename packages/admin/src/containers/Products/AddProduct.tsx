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
  { value: '???', label: '???' },
  { value: '???', label: '???' },
  { value: '???', label: '???' },
  { value: '??????', label: '??????' },
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
  const [itemsInfo, setItemsInfo] = useState({"productNumber": "", "productUUid": "", "productName":"", "specification": "", "unitPrice": "", "finalUnit": "", "weight": "", "unit": "", "PD": null, "PDUnit": "",  "preservation": "", "image": undefined, "imageInfo": "", "remark": ""});
  const [productOptions, setProductOptions] = useState([]);
  const [product, setProduct] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [weightUnits, setWeightUnits] = useState([]);
  const [storage, setStorage] = useState([]);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [isOpenCheck, setIsOpenCheck] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
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

  const handleProductChange = ({ value }) => {
    setProduct(value);
    if (value[0] !== undefined) {
      let temp = value[0]['label'].split('(');
      itemsInfo.productNumber = temp[0];
      itemsInfo.productName = temp[1].replace(')', '');
    } else {
      itemsInfo.productNumber = null;
    }
    itemsInfo.productUUid = (value[0] !== undefined ? value[0]['value'] : null);
    console.log(itemsInfo);
  }

  const closeImage = () => {
    setIsOpenImage(false);
  }

  const closeCheck = () => {
    setIsOpenCheck(false);
  }

  const checkProductInfo = () => {
    if (itemsInfo.productNumber === "") {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.productName === "") {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.unitPrice === "") {
      setCheckMessage("???????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.finalUnit === "") {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.PD === null) {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.PDUnit === "") {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (itemsInfo.preservation === "") {
      setCheckMessage("?????????????????????");
      setIsOpenCheck(true);
    } else if (image === undefined && type === 'add') {
      setCheckMessage("???????????????");
      setIsOpenCheck(true);
    } else {
      handleSubmit();
    }
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
          product_uuid: itemsInfo.productUUid,
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
    itemsInfo['productUUid'] = productInfo['product_uuid'];
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
    setProduct([{value: productInfo['product_uuid'], label: productInfo['product_no'] + '(' + itemsInfo['productName'] + ')'}]);
    console.log(productInfo)
  }

  const getProductList = async () => {
    if (location.state.type === 'add') {
      try {
        const reponse = await request.get(`/product/init-list`);
        const productList = reponse.data;
        
        console.log(productList);
        productList.forEach(element => {
          const product_noName = element.product_no + '  (' + element.product_name + ')';
          productOptions.push({label: product_noName, value: element.uuid});
        });
        // console.log(productOptions);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const getProductUnits = async () => {
    const product_units = location.state.product_unit;
    const unit_list = product_units.map(element => {
      return {
        value: element,
        label: element
      };
    });
    // console.log(unit_list);
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
    // console.log(weight_unit_list);
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
    // console.log(storage_list);
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
      // console.log(response.data.url);
      itemsInfo.image = response.data.url
      setItemsInfo({...itemsInfo});
    }
  };

  useEffect(() => {
    getProductUnits();
    getWeightUnits();
    getStorage();
    getProductInfo();
    getProductList();
  }, [])

  return (
    <Grid fluid={true}>
      <Modal onClose={closeImage} isOpen={isOpenImage}>
        <ModalHeader>??????</ModalHeader>
        <ModalBody>
          <img width="450px" height="300px" src={itemsInfo['image']} alt={"????????????"}/>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeImage}>??????</Button>
        </ModalFooter>
      </Modal>
      <Modal onClose={closeCheck} isOpen={isOpenCheck}>
        <ModalHeader>????????????</ModalHeader>
        <ModalBody>
          <Text>{checkMessage}</Text>
        </ModalBody>
        <ModalFooter>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeCheck}>??????</Button>
        </ModalFooter>
      </Modal>
      <Row>
        <Col md={12}>
            <Title>
                {type === "add"? "??????": type === "edit"? "??????": "??????"}
            </Title>
            <Wrapper onChange={handleInfoChange}>
              <Heading>{type === "add"? "??????": type === "edit"? "??????": "??????"}??????</Heading>
              <RowBox>
                <InputBox><Text>????????????</Text><Select placeholder="??????????????????" labelKey="label" valueKey="value" searchable={false} options={productOptions} value={product} disabled={type==="add"? false: true} onChange={handleProductChange}/></InputBox>
                <InputBox></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>??????</Text><Input height='100%' id={"specification"} placeholder="????????????" value={itemsInfo["specification"]} disabled={type==="view"? true: false}/></InputBox>
                <InputBox><Text>??????</Text><Input height="100%" id={"unitPrice"} placeholder="????????????" value={itemsInfo["unitPrice"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>????????????</Text><Select placeholder="??????" labelKey="label" valueKey="value" searchable={false} options={productUnits} value={finalUnit} disabled={type==="view"? true: false} onChange={({ value }) => {setFinalUnit(value); itemsInfo["finalUnit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/></InputBox>
                <InputBox><Text>????????????</Text>
                  <ContentBox>
                    <Input height="100%" id={"weight"} placeholder="????????????" value={itemsInfo["weight"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="??????" labelKey="label" valueKey="value" searchable={false} options={weightUnits} value={unit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setUnit(value); itemsInfo["unit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>????????????</Text>
                  <ContentBox>
                    <Input height="100%" id={"PD"} placeholder="????????????" value={itemsInfo["PD"]} disabled={type==="view"? true: false}/>
                    <Select placeholder="??????" labelKey="label" valueKey="value" searchable={false} options={PDUnitList} value={PDUnit} disabled={type==="view"? true: false}
                      onChange={({ value }) => {setPDUnit(value); itemsInfo["PDUnit"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>????????????</Text><Select placeholder="??????" labelKey="label" valueKey="value" searchable={false} options={storage} value={preservation} disabled={type==="view"? true: false} onChange={({ value }) => {setPreservation(value); itemsInfo["preservation"] = (value[0] !== undefined ? value[0]['value'] : null); setItemsInfo({...itemsInfo})}}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox>
                  <Text>??????</Text>
                  <ContentBox>
                    {itemsInfo["image"] !== ""? (<Button width="40%" background_color={'#FF902B'} color={'#FFFFFF'} onClick={()=>{setIsOpenImage(true)}}>????????????</Button>):(null)}
                    <Input type="file" height="100%" id={"image"} placeholder="????????????" disabled={type==="view"? true: false}/>
                  </ContentBox>
                </InputBox>
                <InputBox><Text>????????????</Text><Input height="100%" id={"imageInfo"} placeholder="??????????????????" value={itemsInfo["imageInfo"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <RowBox>
                <InputBox><Text>??????</Text><Input height="100px" id={"remark"} placeholder="" value={itemsInfo["remark"]} disabled={type==="view"? true: false}/></InputBox>
              </RowBox>
              <ButtonBox>
                  <Button
                    background_color={'#616D89'}
                    color={'#FFFFFF'}
                    margin={'5px'}
                    height={'60%'}
                    onClick={()=> history.push(PRODUCTS)}
                  >{type === "view"? "?????????": "??????"}</Button>
                  {type === "view"? (
                    null
                  ):(
                    <Button
                      background_color={'#FF902B'}
                      color={'#FFFFFF'}
                      margin={'5px'}
                      height={'60%'}
                      onClick={checkProductInfo}
                    >????????????</Button>
                  )}
                  
                </ButtonBox>
            </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
};

export default AddProduct;