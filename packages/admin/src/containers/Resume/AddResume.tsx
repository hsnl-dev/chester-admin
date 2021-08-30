import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { styled, withStyle } from 'baseui';
import { Datepicker } from 'baseui/datepicker';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import { 
	StyledRoot, 
	StyledTable, 
	StyledTableHeadRow, 
	StyledTableHeadCell,
	 StyledTableBodyRow, 
	 StyledTableBodyCell 
} from 'baseui/table-semantic';
import tw from 'date-fns/locale/zh-TW';
import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { Heading, Title } from '../../components/DisplayTable/DisplayTable';

import { RESUME } from '../../settings/constants';
import { request } from '../../utils/request';

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
	const [productList, setProductList] = useState([]);
	const [method, setMethod] = useState([]);
	const [product, setProduct] = useState([]);
	const [MFG, setMFG] = useState([]);
	const column_names = ['選取', '進料日期', '數量', '選取數量', '單位'];
	const display_column_name = ['進貨品名', '進貨日期', '數量', '單位', '刪除'];
	const [amount, setAmount] = useState(0);
	const [isCheck, setIsCheck] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [addFoodName, setAddFoodName] = useState("");
	const [foodOptions, setFoodOptions] = useState([]);
	const [commodities, setCommodities] = useState([]);
	const [chooseFood, setChooseFood] = useState({'主食': {}, '主菜': {}, '配菜': {}, '其他': {} });
    const [foodTemp, setFoodTemp] = useState({})
	const [selectFood, setSelectFood] = useState(foodOptions[0]);
	const history = useHistory();

	const close = () => {
		setIsOpen(false);
	}

	const check = async () => {
		setIsCheck(true);
		console.log(product);
		console.log(amount);
		console.log(MFG);
		try {
      const response = await request.post(`/trace/create`, {
        product_id: product[0].value,
        amount: amount,
				create_date: MFG
      });
			console.log(response);
    } catch (err) {
      console.log(err);
    }
	}

	const handleFoodChange = (e) => {
        console.log(e.target.id)
        console.log(selectFood)
		let keys = Object.keys(foodTemp);
		let split = e.target.id.split('_');
		let key = split[0];
		let index = String(split[1]);
        let id = String(commodities[parseInt(index)].id);
		
		if (keys.indexOf(id) !== -1) {
            console.log('no')
			foodTemp[id][key] = e.target.value;
		}	else {
			let temp = {'id': commodities[parseInt(index)].id,'foodName': selectFood[0].value, 'checked': '', 'date': commodities[parseInt(index)].date, 'amount': '', 'unit': commodities[parseInt(index)].unit};
			temp[key] = e.target.value;
			foodTemp[id] = temp;
		}
        setFoodTemp({...foodTemp});
        
	}
    
    const handleAdd = () => {
		let keys = Object.keys(foodTemp);
		for (let i = 0; i < keys.length; i++) {
			chooseFood[addFoodName][keys[i]] = foodTemp[keys[i]];
		}
        setChooseFood({...chooseFood});
        close();
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
        setSelectFood([foodOptions[0]]);
        setFoodTemp({});
		setIsOpen(true);
	}

	const handleSubmit = () => {

	}

	const addRow = (head) => {
		let displayInfo = [];
        let keys = Object.keys(chooseFood[head]);
		for (let i = 0; i < keys.length; i++) {
			if (chooseFood[head][keys[i]].checked === 'on') {
				displayInfo.push(chooseFood[head][keys[i]]);
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
														<StyledTableBodyCell><Button id={head + '_' + displayInfo[index].id} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={deleteDisplay}>刪除</Button></StyledTableBodyCell>
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

	async function getProductList() {
		try {
			const result = await request.get(`/product`);
			const product_arr = result.data.products;
			console.log(product_arr);
			let product_list = [];
      		product_arr.forEach(element => {
				product_list.push({
					value: element.id,
					label: element.name
				});
			});
			console.log(product_list);
      		setProductList(product_list);
    	} catch (err) {
      		console.log(err);
    	}
	}

	async function getCommodityList() {
		try {
            const result = await request.get(`/trace/commodity`);
            const commodity_arr = result.data.commodities;
			const commodity_name = result.data.commodity_name;
            console.log("commodity_arr: ", commodity_arr);
			console.log("commodity_name: ", commodity_name);
			let name_list = [];
            commodity_name.forEach(element => {
				name_list.push({
					value: element,
					label: element
				});
			});
			let commodity_list = [];
			commodity_arr.forEach(element => {
				if (element.remain_amount > 0) {
					commodity_list.push({
                        id: element.commodity_id,
						date: element.create_at,
						amount: element.remain_amount,
						unit: element.unit
					});
				}
			})
			console.log(name_list);
			console.log(commodity_list);
            setFoodOptions(name_list);
			setCommodities(commodity_list);
        } catch (err) {
            console.log(err);
        }
	}

	useEffect(() => {
		getProductList();
		getCommodityList();
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
						placeholder="選擇"
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
								<StyledTableBodyRow onChange={handleFoodChange}>
									<StyledTableBodyCell><input id={'checked_' + index} type='checkbox'></input></StyledTableBodyCell>
									<StyledTableBodyCell>{commodities[index].date}</StyledTableBodyCell>
									<StyledTableBodyCell>{commodities[index].amount}</StyledTableBodyCell>
									<StyledTableBodyCell><input id={'amount_' + index} style={{width: "30px"}}></input></StyledTableBodyCell>
									<StyledTableBodyCell>{commodities[index].unit}</StyledTableBodyCell>
								</StyledTableBodyRow>
								))
							}
						</StyledTable>
					</StyledRoot>
				</ModalBody>
				<ModalFooter>
					<Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
					<Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={handleAdd}>新增</Button>
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
									placeholder="選擇"
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
									placeholder='選擇'
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
						{isCheck ? null: (
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
			) : (null)}
		</Grid>
	);
};
export default AddResume;