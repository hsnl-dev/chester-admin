import React, { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import { SelectBox } from '../../components/Select/Select';
import { Datepicker } from 'baseui/datepicker';
import Input from '../../components/Input/Input';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { RESUME } from '../../settings/constants';
import { Heading, Title } from '../../components/DisplayTable/DisplayTable';
import dayjs from 'dayjs';
import tw from 'date-fns/locale/zh-TW';
import {Modal, ModalHeader, ModalBody, ModalFooter, ModalButton} from 'baseui/modal';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell, StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';
import { useHistory } from 'react-router';
import { split } from 'apollo-boost';

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
    fontFamily: "Montserrat",
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    boxShadow: "-3px 3px 5px 1px #E0E0E0",
    marginBottom: '20px',
}));

const SearchBox = styled('div', () => ({
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
}));
  
const SearchProductBox = styled('div', () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: '10px'
}));
  
const ContentBox = styled('div', () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    height: '100%',
    marginRight: '10px',
    marginBottom: '10px',
}));

const AddResume = () => {
    const methodSelectOptions = [
        { value: '選擇進貨', label: '選擇進貨'},
        { value: '填寫進貨', label: '填寫進貨'},
    ];
    const [productList, setProductList] = useState([{ value: "雞腿便當", label: '雞腿便當' }, { value: "XXX", label: 'XXX' }]);
    const [method, setMethod] = useState([]);
    const [product, setProduct] = useState([]);
    const [MFG, setMFG] = useState([]);
    const column_names = ['選取', '進料日期', '數量', '選取數量', '單位'];
    const display_column_name = ['進貨品名', '進貨日期', '數量', '單位', '刪除'];
    const [amount, setAmount] = useState(0);
    const [isCheck, setIsCheck] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [addFoodName, setAddFoodName] = useState("");
    const [foodOptions, setFoodOptions] = useState([{value: '白飯', label: '白飯'}, {value: '糙米', label: '糙米'}, {value: '麵', label: '麵'}]);
    const [commodities, setCommodities] = useState([{'date': '2021/06/20', 'amount': 10, 'unit': 'kg'}]);
    const [chooseFood, setChooseFood] = useState({'主食': {}, '主菜': {}, '配菜': {}, '其他': {} });
    const [selectFood, setSelectFood] = useState(foodOptions[0]);
    const history = useHistory();

    const close = () => {
        setIsOpen(false);
    }

    const check = () => {
        setIsCheck(true);
    }

    const handleAdd = (e) => {
		let keys = Object.keys(chooseFood[addFoodName]);
        let split = e.target.id.split('_');
        let key = split[0];
        let index = String(split[1]);
        
        if (keys.indexOf(index) !== -1) {
            chooseFood[addFoodName][index][key] = e.target.value;
        }
        else {
            let temp = {'foodName': selectFood.value, 'checked': false, 'date': commodities[parseInt(index)].date, 'amount': '', 'unit': commodities[parseInt(index)].unit};
            temp[key] = e.target.value;
            chooseFood[addFoodName][index] = temp;
        }
        if (chooseFood[addFoodName][index].checked === 'on' && chooseFood[addFoodName][index].amount !== '') {
            setChooseFood({...chooseFood});
        }
        
    }

    const deleteDisplay = (e) => {
        let split = e.target.id.split('_');
        let key = split[0];
        let index = String(split[1]);
        
        delete chooseFood[key][index];
        setChooseFood({...chooseFood});
        
    }

    const setDialog = (head) => {
        setAddFoodName(head);
        setIsOpen(true);
    }

    const handleSubmit = () => {

    }

    const addRow = (head) => {
        let displayInfo = [];
        for (let i = 0; i < Object.keys(chooseFood[head]).length; i++) {
            if (chooseFood[head][String(i)].checked === 'on') {
                displayInfo.push(chooseFood[head][String(i)]);
            }
        }
        if (isCheck){
            return (
                <Row>
                    <Col md={12}>
                        <Wrapper>
                            <Heading>{head}</Heading>
                            {displayInfo.length === 0? (
                                <Button margin='5px' width='90px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={()=>{setDialog(head)}}>新增</Button>
                            ):(
                                <div>
                                    <StyledRoot>
                                        <StyledTable>
                                            <StyledTableHeadRow>
                                            {display_column_name.map((column_name) => (
                                                <StyledTableHeadCell>{column_name}</StyledTableHeadCell>
                                            ))}
                                            </StyledTableHeadRow>
                                            {displayInfo.map((item) => Object.values(item))
                                                .map((row: Array<string>, index) => (
                                                <StyledTableBodyRow>
                                                    <StyledTableBodyCell>{displayInfo[index].foodName}</StyledTableBodyCell>
                                                    <StyledTableBodyCell>{displayInfo[index].date}</StyledTableBodyCell>
                                                    <StyledTableBodyCell>{displayInfo[index].amount}</StyledTableBodyCell>
                                                    <StyledTableBodyCell>{displayInfo[index].unit}</StyledTableBodyCell>
                                                    <StyledTableBodyCell><Button id={head + '_' + index} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={deleteDisplay}>刪除</Button></StyledTableBodyCell>
                                                </StyledTableBodyRow>
                                                ))
                                            }
                                        </StyledTable>
                                    </StyledRoot>
                                    <Button margin='5px' width='90px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={()=>{setDialog(head)}}>新增</Button>
                                </div>
                            )}
                            
                        </Wrapper>
                    </Col>
                </Row>
            )
        }
        return null;
    }

    useEffect(() => {
        console.log(method);
        console.log(MFG);
        console.log(product);
        console.log(amount)
    }, [method, MFG, product, amount])

    return (
        <Grid fluid={true}>
            <Modal onClose={close} isOpen={isOpen}>
                <ModalHeader>新增{addFoodName}</ModalHeader>
                <ModalBody>
                    <Text>選擇進貨品名</Text>
                    <Select
                        options = {foodOptions}
                        labelKey="label"
                        valueKey="value"
                        placeholder={""}
                        value={selectFood}
                        searchable={false}
                        onChange={({value}) => setSelectFood(value)}
                    />
                    <StyledRoot>
                        <StyledTable>
                            <StyledTableHeadRow>
                            {column_names.map((column_name) => (
                                <StyledTableHeadCell>{column_name}</StyledTableHeadCell>
                            ))}
                            </StyledTableHeadRow>
                            {commodities.map((item) => Object.values(item))
                                .map((row: Array<string>, index) => (
                                <StyledTableBodyRow onChange={handleAdd}>
                                    <StyledTableBodyCell><input id={'checked_' + String(index)} type='checkbox'></input></StyledTableBodyCell>
                                    <StyledTableBodyCell>{commodities[index].date}</StyledTableBodyCell>
                                    <StyledTableBodyCell>{commodities[index].amount}</StyledTableBodyCell>
                                    <StyledTableBodyCell><input id={'amount_' + String(index)} style={{width: "30px"}}></input></StyledTableBodyCell>
                                    <StyledTableBodyCell>{commodities[index].unit}</StyledTableBodyCell>
                                </StyledTableBodyRow>
                                ))
                            }
                        </StyledTable>
                    </StyledRoot>
                </ModalBody>
                <ModalFooter>
                    <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
                    <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>新增</Button>
                </ModalFooter>
            </Modal>
            <Row>
                <Col md={12}>
                    <Title>履歷管理</Title>
                    <Wrapper>
                        <Heading>履歷資訊</Heading>
                        <SearchProductBox>
                            <ContentBox>
                                <Text>製作日期</Text>
                                <Datepicker 
                                    locale={tw}
                                    onChange = {({ date }) => {MFG[0] = date; setMFG([...MFG])}}
                                />
                            </ContentBox>
                            <ContentBox>
                                <Text>製成商品</Text>
                                <Select
                                    options = {productList}
                                    labelKey="label"
                                    valueKey="value"
                                    placeholder={productList[0].value}
                                    value={product}
                                    searchable={false}
                                    onChange={({value}) => setProduct(value)}
                                />
                            </ContentBox>
                        </SearchProductBox>
                        <SearchProductBox>
                            <ContentBox>
                                <Text>選擇進貨方式</Text>
                                <Select
                                    options = {methodSelectOptions}
                                    labelKey="label"
                                    valueKey="value"
                                    placeholder={'選擇'}
                                    value={method}
                                    searchable={false}
                                    onChange={({value}) => setMethod(value)}
                                />
                            </ContentBox>
                            <ContentBox>
                                <Text>製成數量</Text>
                                <Input 
                                    placeholder = '輸入製成數量'    
                                    onChange = {(e) => {setAmount(e.target.value)}}
                                    height = {'45px'}
                                />
                            </ContentBox>
                        </SearchProductBox>
                        {isCheck? null: (
                            <ButtonBox>
                                <Button margin='5px' width='80px' height='45px' background_color='#616D89' color={'#FFFFFF'} 
                                    onClick={() => history.push({
                                        pathname: RESUME
                                    })}>
                                    取消
                                </Button>
                                <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={check}>確認</Button>
                            </ButtonBox>
                        )}
                    </Wrapper>
                </Col>
            </Row>
            {addRow('主食')}
            {addRow('主菜')}
            {addRow('配菜')}
            {addRow('其他')}
            {isCheck? (
                <ButtonBox>
                    <Button margin='5px' width='80px' height='45px' background_color='#616D89' color={'#FFFFFF'} 
                        onClick={() => history.push({
                            pathname: RESUME
                        })}>
                        取消
                    </Button>
                    <Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={handleSubmit}>確認送出</Button>
                </ButtonBox>
            ): (null)}
        </Grid>
    );
};
export default AddResume;