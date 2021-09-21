import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { styled, withStyle } from 'baseui';
import { Datepicker } from 'baseui/datepicker';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell,StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';
import tw from 'date-fns/locale/zh-TW';
import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { Heading, Title } from '../../components/DisplayTable/DisplayTable';
import dayjs from 'dayjs';

import { RESUME } from '../../settings/constants';
import { request } from '../../utils/request';

dayjs.locale("zh-tw");

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

const ModalWrapper = styled('div', () => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    boxShadow: "-3px 3px 5px 1px #E0E0E0",
}));
  
const RowBox = styled('div', () => ({
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

const InputBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	marginRight: '20px',
	marginLeft: '20px',
	marginTop: '10px',
}));

const AddResume = () => {
	const methodSelectOptions = [
		{ value: '選擇進貨', label: '選擇進貨'},
		{ value: '填寫進貨', label: '填寫進貨'},
	];
	const onShelfTimeOptions = [
		{ value: 1, label: '早餐'},
		{ value: 2, label: '午餐'},
		{ value: 3, label: '下午茶'},
		{ value: 4, label: '晚餐'},
		{ value: 5, label: '宵夜'}
	];
	const unitList = [
		{ value: 'g', label: 'g' },
		{ value: 'kg', label: 'kg' },
		{ value: 'ml', label: 'ml' },
	];
	const commodityFormat = {"id": "", "date": dayjs(new Date()).format("YYYY-MM-DD"), "name": "", "traceNumber": "", "origin": "", "batchNumber": "", "brand": "", "amount": "", "unit": null, "remark": "", "checked": "on", 'period': '', 'periodDisable': true};
	const [onShelfTime, setOnSelfTime] = useState([{}]);
	const [addTimes, setAddTimes] = useState("");
	const [lowTimes, setLowTimes] = useState("");
	const [productList, setProductList] = useState([]);
	const [method, setMethod] = useState([]);
	const [product, setProduct] = useState([{}]);
	const [MFG, setMFG] = useState(null);
	const column_names = ['選取', '進料日期', '數量', '選取數量', '單位'];
	const display_column_name = ['進貨品名', '進貨日期', '數量', '單位', '刪除'];
	const [commodityTemp, setCommodityTemp] = useState(commodityFormat);
	const [amount, setAmount] = useState("");
	const [isCheck, setIsCheck] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenCheck, setIsOpenCheck] = useState(false);
	const [isOpenCommodity, setIsOpenCommodity] = useState(false);
	const [checkMessage, setCheckMessage] = useState("");
	const [addFoodName, setAddFoodName] = useState("");
	const [foodOptions, setFoodOptions] = useState([]);
	const [commodities, setCommodities] = useState([]);
	const [selectCommodities, setSelectCommodities] = useState([]);
	const [chooseFood, setChooseFood] = useState({'主食': {}, '主菜': {}, '配菜': {}, '其他': {} });
	const [foodTemp, setFoodTemp] = useState({})
	const [selectFood, setSelectFood] = useState(foodOptions[0]);
	const [unit, setUnit] = useState([]);
	const [traceId, setTraceId] = useState(-1);
	const history = useHistory();
	const location = useLocation();

	const close = () => {
		setIsOpen(false);
	}

	const closeCheck = () => {
		setIsOpenCheck(false);
	}

	const closeCommodity = () => {
		setIsOpenCommodity(false);
	}

	const check = async () => {
		
		if (MFG === null) {
			setCheckMessage("請選擇日期");
			setIsOpenCheck(true);
		} else if (product[0]['value'] === undefined) {
			setCheckMessage("請選擇商品");
			setIsOpenCheck(true);
		} else if (onShelfTime[0]['value'] === undefined){
			setCheckMessage("請選擇上架時段");
			setIsOpenCheck(true);
		} else if (addTimes === "" || addTimes === "0") {
			setCheckMessage("請輸入第幾次補貨(大於0)");
			setIsOpenCheck(true);
		}else if (method.length === 0) {
			setCheckMessage("請選擇進貨方式");
			setIsOpenCheck(true);
		} else if (amount === "" || amount === "0") {
			setCheckMessage("請輸入製成數量(大於0)");
			setIsOpenCheck(true);
		} else {
			setIsCheck(true);
			if (method[0].value === "填寫進貨") {
				setFoodOptions([]);
				setCommodities([]);
			}
			try {
				const response = await request.post(`/trace/create`, {
					product_id: product[0]['value'],
					amount: amount,
					create_date: MFG,
					time_period: onShelfTime,
					batch: addTimes
				});
				console.log(response.data);
				setTraceId(response.data.trace_id);
			} catch (err) {
				console.log(err);
			}
		}
	}
	
	const handleDate = ({ date }) => {
		setMFG(date);
		if (product[0]['value'] !== undefined && onShelfTime[0]['value'] !== undefined)
			getLowAddTimes("MFG", date);	
	}

	const handleProduct = ({ value }) => {
	
		product[0] = value[0];
		setProduct(value);
		if (MFG !== null && onShelfTime[0]['value'] !== undefined)
			getLowAddTimes("product", product[0]['value']);
	}

	const handleSelfTime = ({ value }) => {
		onShelfTime[0] = value[0];
		setOnSelfTime(value);
		if (MFG !== null && product[0]['value'] !== undefined)
			getLowAddTimes("shelfTime", onShelfTime[0]['value']);
	}

	const handleFoodChange = (e) => {
		let keys = Object.keys(foodTemp);
		let split = e.target.id.split('_');
		let key = split[0];
		let index = String(split[1]);
		let id = String(selectCommodities[parseInt(index)].id);
		
		if (keys.indexOf(id) !== -1) {
			foodTemp[id][key] = e.target.value;
		}	else {
			let temp = {'id': selectCommodities[parseInt(index)].id,'foodName': selectFood[0].value, 'checked': '', 'date': selectCommodities[parseInt(index)].date, 'amount': '', 'unit': selectCommodities[parseInt(index)].unit};
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

	const handelCommodity = (e) => {
		if (commodityTemp.id === "") {
			commodityTemp.id = String(commodities.length);
		}
		
		if (e.target.id === "brand") {
			console.log(e.target.id)
				commodityTemp['periodDisable'] = false;
			
		}
		commodityTemp[e.target.id] = e.target.value;
		setCommodityTemp(commodityTemp);
	}	

	const submitCommodity = () => {
		if (commodityTemp.name === "") {
			setCheckMessage("請輸入品名");
			setIsOpenCheck(true);
		} else if (commodityTemp.traceNumber === "") {
			setCheckMessage("請輸入溯源履歷號碼");
			setIsOpenCheck(true);
		} else if (commodityTemp.origin === "") {
			setCheckMessage("請輸入原產地");
			setIsOpenCheck(true);
		} else if (commodityTemp.batchNumber === "") {
			setCheckMessage("請輸入批號");
			setIsOpenCheck(true);
		} else if (commodityTemp.brand === "") {
			setCheckMessage("請輸入品牌");
			setIsOpenCheck(true);
		} else if (commodityTemp.traceNumber === "") {
			setCheckMessage("請輸入溯源履歷號碼");
			setIsOpenCheck(true);
		} else if (commodityTemp.amount === "" || commodityTemp.amount === "0") {
			setCheckMessage("請輸入數量");
			setIsOpenCheck(true);
		}  else if (commodityTemp.unit === null) {
			setCheckMessage("請選擇單位");
			setIsOpenCheck(true);
		} else {
			commodityTemp["foodName"] = commodityTemp["name"];
			chooseFood[addFoodName][commodityTemp.id] = commodityTemp;
			commodities.push(commodityTemp);
			setCommodities(commodities);
			setChooseFood(chooseFood);
			setCommodityTemp(commodityFormat);
			closeCommodity();
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
		if (method[0].value === "選擇進貨") {
			setAddFoodName(head);
			setSelectFood([foodOptions[0]]);
			setFoodTemp({});
			let select_list = [];
			for (let i = 0; i < commodities.length; i++) {
				if (commodities[i].name === foodOptions[0].value) {
					select_list.push(commodities[i]);
				}
			}
			setSelectCommodities([...select_list]);
			setIsOpen(true);
		} else {
			setUnit([]);
			setAddFoodName(head);
			setIsOpenCommodity(true);
		}
		
	}

	const getLowAddTimes = (type, data) => {
		let resumes = location.state['data'];
		let date = type==="MFG"? data: MFG
		setLowTimes("0");
		for (let i = 0; i < resumes.length; i++) {
			let resume = resumes[i];
			console.log(dayjs(resume.create_date).format("YYYY-MM-DD"))
			if (dayjs(date).format("YYYY-MM-DD") === dayjs(resume.create_date).format("YYYY-MM-DD") && product[0]['label'] === resume.product_name && onShelfTime[0]['value'] === resume.time_period) {
				let times = (parseInt(resume.batch) + 1).toString()
				setLowTimes(times);
				setAddTimes(times);
				break;
			}
		}
	}

	const handleSubmit = async () => {
		try {
			console.log(commodities)
			let commodity_arr = [];
			for (const [key, value] of Object.entries(chooseFood["主菜"])) {
				if (method[0].value === "選擇進貨") { 
					commodity_arr.push({
						"commodity_id": parseInt(key),
						"amount": parseFloat(value["amount"]),
						"type": "main_dish"
					})
				} else {
					commodity_arr.push({
						"name": commodities[key]["name"],
						"trace_no": commodities[key]["traceNumber"],
						"batch_no": commodities[key]["batchNumber"],
						"origin": commodities[key]["origin"],
						"brand" : commodities[key]["brand"],
						"produce_period": commodities[key]["period"],
						"unit" : commodities[key]["unit"],
						"note": commodities[key]["remark"],
						"amount": parseFloat(value["amount"]),
						"type": "main_dish"
					})
				}
			}
			for (const [key, value] of Object.entries(chooseFood["主食"])) {
				if (method[0].value === "選擇進貨") { 
					commodity_arr.push({
						"commodity_id": parseInt(key),
						"amount": parseFloat(value["amount"]),
						"type": "staple_food"
					})
				} else {
					commodity_arr.push({
						"name": commodities[key]["name"],
						"trace_no": commodities[key]["traceNumber"],
						"batch_no": commodities[key]["batchNumber"],
						"origin": commodities[key]["origin"],
						"brand" : commodities[key]["brand"],
						"produce_period": commodities[key]["period"],
						"unit" : commodities[key]["unit"],
						"note": commodities[key]["remark"],
						"amount": parseFloat(value["amount"]),
						"type": "staple_food"
					})
				}
			}
			for (const [key, value] of Object.entries(chooseFood["配菜"])) {
				if (method[0].value === "選擇進貨") { 
					commodity_arr.push({
						"commodity_id": parseInt(key),
						"amount": parseFloat(value["amount"]),
						"type": "side_dish"
					})
				} else {
					commodity_arr.push({
						"name": commodities[key]["name"],
						"trace_no": commodities[key]["traceNumber"],
						"batch_no": commodities[key]["batchNumber"],
						"origin": commodities[key]["origin"],
						"brand" : commodities[key]["brand"],
						"produce_period": commodities[key]["period"],
						"unit" : commodities[key]["unit"],
						"note": commodities[key]["remark"],
						"amount": parseFloat(value["amount"]),
						"type": "side_dish"
					})
				}
			}
			for (const [key, value] of Object.entries(chooseFood["其他"])) {
				if (method[0].value === "選擇進貨") { 
					commodity_arr.push({
						"commodity_id": parseInt(key),
						"amount": parseFloat(value["amount"]),
						"type": "others"
					})
				} else {
					commodity_arr.push({
						"name": commodities[key]["name"],
						"trace_no": commodities[key]["traceNumber"],
						"batch_no": commodities[key]["batchNumber"],
						"origin": commodities[key]["origin"],
						"brand" : commodities[key]["brand"],
						"produce_period": commodities[key]["period"],
						"unit" : commodities[key]["unit"],
						"note": commodities[key]["remark"],
						"amount": parseFloat(value["amount"]),
						"type": "others"
					})
				}
			}
			console.log(commodity_arr);
			if (method[0].value === "選擇進貨") {
				const result = await request.post(`/trace/${traceId}/add-commodity`, {
					commodities_arr: commodity_arr
				});
				console.log(result);
			} else {
				const result = await request.post(`/trace/${traceId}/add-tmp-commodity`, {
					commodities_arr: commodity_arr
				});
				console.log(result);
			}
			
		} catch (err) {
			console.log(err);
		}
		history.push({pathname: RESUME});
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
						name: element.name,
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

	const handleSelectFood = ({value}) => {
		let name = value[0].value;
		let temp = [];
		for (let i = 0; i < commodities.length; i++) {
			if (commodities[i].name === name) {
				temp.push(commodities[i]);
			}
		}
		setSelectCommodities([...temp]);
		setSelectFood(value);
	}

	useEffect(() => {
		getProductList();
		getCommodityList();
		// console.log(method);
		// console.log(MFG);
		// console.log(product);
		// console.log(amount);
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
						onChange={handleSelectFood}
					/>
					<StyledRoot>
						<StyledTable>
							<StyledTableHeadRow>
							{column_names.map((column_name) => (
								<StyledTableHeadCell>{column_name}</StyledTableHeadCell>
							))}
							</StyledTableHeadRow>
							{selectCommodities.map((item) => Object.values(item))
								.map((row: Array<string>, index) => (
								<StyledTableBodyRow onChange={handleFoodChange}>
									<StyledTableBodyCell><input id={'checked_' + index} type='checkbox'></input></StyledTableBodyCell>
									<StyledTableBodyCell>{selectCommodities[index].date}</StyledTableBodyCell>
									<StyledTableBodyCell>{selectCommodities[index].amount}</StyledTableBodyCell>
									<StyledTableBodyCell><input id={'amount_' + index} style={{width: "30px"}}></input></StyledTableBodyCell>
									<StyledTableBodyCell>{selectCommodities[index].unit}</StyledTableBodyCell>
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
			<Modal onClose={closeCheck} isOpen={isOpenCheck}>
				<ModalHeader>欄位未填</ModalHeader>
				<ModalBody>
					<Text>{checkMessage}</Text>
				</ModalBody>
				<ModalFooter>
					<Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeCheck}>確認</Button>
				</ModalFooter>
			</Modal>
			<Modal onClose={closeCommodity} isOpen={isOpenCommodity} overrides={{
          			Dialog: {
            			style: {
              				width: '80vw',
              				display: 'flex',
              				flexDirection: 'column',
           		},},}}>
				<ModalHeader><Heading>新增品項</Heading></ModalHeader>
				<ModalBody onChange={handelCommodity}>
						<RowBox>
							<InputBox><Text>進貨品名</Text><Input id={"name"} placeholder="輸入品名"/></InputBox>
							<InputBox><Text>溯源履歷號碼</Text><Input id={"traceNumber"}   placeholder="輸入溯源履歷號碼"/></InputBox>
						</RowBox>
						<RowBox>
							<InputBox><Text>原產地</Text><Input id={"origin"} placeholder="輸入原產地"/></InputBox>
							<InputBox><Text>品牌</Text><Input id={"brand"} placeholder="輸入品牌"/></InputBox>
						</RowBox>
						<RowBox>
							<InputBox><Text>批號</Text><Input id={"batchNumber"} placeholder="輸入批號"/></InputBox>
							<InputBox><Text>幾年幾期</Text><Input id={"period"} placeholder="輸入三光米幾年幾期"/></InputBox>
						</RowBox>
						<RowBox>
							<InputBox><Text>數量</Text><Input type="Number" id={"amount"} placeholder="輸入數量"/></InputBox>
							<InputBox><Text>單位</Text><Select id="unit" placeholder="選擇" labelKey="label" valueKey="value" searchable={false} options={unitList} value={unit}
								onChange={({ value }) => {setUnit(value); commodityTemp.unit=value[0]['value']; setCommodityTemp(commodityTemp)}}/></InputBox>
						</RowBox>
						<RowBox>
							<InputBox><Text>備註</Text><Input id={"remark"} placeholder="" height="100px"/></InputBox>
						</RowBox>
				</ModalBody>
				<ModalFooter>
					<Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={submitCommodity}>確認</Button>
				</ModalFooter>
			</Modal>
			<Row>
				<Col md={12}>
					<Title>履歷管理</Title>
					<Wrapper>
						<Heading>履歷資訊</Heading>
						<RowBox>
							<ContentBox>
								<Text>製作日期</Text>
								<Datepicker 
									locale={tw}
									onChange = {handleDate}
									disabled={isCheck? true: false}
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
									onChange={handleProduct}
									disabled={isCheck? true: false}
								/>
							</ContentBox>
						</RowBox>
						<RowBox>
							<ContentBox>
								<Text>選擇上架時段</Text>
								<Select
									options = {onShelfTimeOptions}
									labelKey="label"
									valueKey="value"
									placeholder='選擇'
									value={onShelfTime}
									searchable={false}
									onChange={handleSelfTime}
									disabled={isCheck? true: false}
								/>
							</ContentBox>
							<ContentBox>
								<Text>輸入第幾次補貨</Text>
								<Input 
									placeholder = '輸入第幾次補貨'
									type = 'Number'  
									onChange = {(e) => {setAddTimes(e.target.value)}}
									height = {'45px'}
									min = {lowTimes}
									value = {addTimes}
									disabled={isCheck? true: false}
								/>
							</ContentBox>
						</RowBox>
						<RowBox>
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
									disabled={isCheck? true: false}
								/>
							</ContentBox>
							<ContentBox>
								<Text>製成數量</Text>
								<Input 
									placeholder = '輸入製成數量'
									type = 'Number'  
									onChange = {(e) => {setAmount(e.target.value)}}
									height = {'45px'}
									disabled={isCheck? true: false}
								/>
							</ContentBox>
						</RowBox>
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