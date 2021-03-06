import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { styled, withStyle } from 'baseui';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import { SelectBox } from '../../components/Select/Select';
import { Datepicker } from 'baseui/datepicker';
import dayjs from 'dayjs';
import Input from '../../components/Input/Input';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import NoResult from '../../components/NoResult/NoResult';
import { Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import { ADDRESUME, VIEWRESUME, LABEL } from '../../settings/constants';
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
}));

const InputBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	marginTop: '10px',
	
}));

const MBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
	marginTop: '10px',
	alignItems: 'center',
	justifyContent: 'center',
}));

const Mtext = styled('div', () => ({
	fontSize: '20px',
	display: 'flex',
	flexDirection: 'row',	
}));

const RowBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	width: '100%',
	marginTop: '10px',
	padding: '0px'
}));

const Resume = () => {
	const amountSelectOptions = [
			{ value: 10, label: '10' },
			{ value: 25, label: '25' },
			{ value: 50, label: '50' },
			{ value: 100, label: '100' },
	];
	const labelOptions = [
		{value: 1, label: '??????'},
		{value: 0, label: '??????'},
		{value: -1, label: '??????'},
	];
	const column_names = ['????????????', '??????????????????', '????????????', '??????'];
	const [displayInfo, setDisplayInfo] = useState([]);
	const [displayTemp, setDisplayTemp] = useState([]);
	const [displayAmount, setDisplayAmount] = useState([]);
	const [amountTemp, setAmountTemp] = useState(10);
	const [resumes, setResumes] = useState([]);
	const [selectId, setSelectId] = useState();
	const [selectIndex, setSelectIndex] = useState(0);
	const [selectProduct, setSelectProduct] = useState({});
	const [MFG, setMFG] = useState('');
	const [storeName, setStoreName] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenLabel, setIsOpenLabel] = useState(false);
	const [isOpenPrint, setIsOpenPrint] = useState(false);
	const [labelAction, setLabelAction] = useState([labelOptions[0]]);
	const [labelAmount, setLabelAmount] = useState();
	const [machines, setMachines] = useState([]);
	const [searchName, setSearchName] = useState("");
	const [searchDate, setSearchDate] = useState(null);
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(2);
	const [nextClick, setNextClick] = useState(true);
	const [pastClick, setPastClick] = useState(false);
	const history = useHistory();

	const close = () => {
		setIsOpen(false);
	}

	const closeLabel = () => {
		setIsOpenLabel(false);
	}

	const closePrint = () => {
		setIsOpenPrint(false);
	}

	const submitLabel = async () => {
		try {
			const total_amount = machines.map(element => parseInt(element.labelAmount))
										.filter(element => Number.isInteger(element))
										.reduce((a, b) => a+b);
			const print_arr = machines.map(function(element) {
				return {
					"machine_name": element.machine_name,
					"machine_id": element.machine_id,
					"amount": parseInt(element.labelAmount)
				}
			}).filter(function(element) {
				if (Number.isInteger(element.amount)) {
					if (element.amount !== 0) {
						return true;
					}
				}
				return false;
			});
			const result = await request.post(`/trace/${selectId}/print`, {
				operation: labelAction[0].value,
				total_amount: total_amount,
				print_array: print_arr
			});
			let restoreMachine = machines;
			restoreMachine.forEach(element => {
				element.labelAmount = 0
			});
			setMachines(restoreMachine);
			let data = [];
			console.log(print_arr)
			print_arr.forEach(element => {
				for (let i = 0; i < element.amount; i++) {
					data.push({
						'name': selectProduct['name'], 
						'traceNumber': String(selectId).slice(0, 10), 
						'store': storeName, 
						'MFG': MFG, 
						'storeMethod': selectProduct['storage'] + '/' + selectProduct['shelflife'] + selectProduct['shelflife_unit'], 
						'machine': element.machine_name,  
						'url': `https://app.realfoodtw.com/realFood/${selectId}-${element.machine_id}`
					})
				}
			});

			history.push(LABEL, [data]);

		} catch (err) {
			console.log(err);
		}
		closeLabel();
	}

	const amountChange = ({ value }) => {
		let amount = 0;

		if (value.length !== 0)
		amount = value[0].value;
		else
		amount = 10;
		
		setAmountTemp(amount);
		setDisplayAmount([{ value: amount, label: amount.toString() }]);
		setMaxPage(Math.ceil(displayTemp.length/amount));
		setPage(1);
		setPastClick(false);
		if (displayTemp.length > amount) {
			setDisplayInfo(displayTemp.slice(0, amount));
			setNextClick(true);
		}
		else {
			setDisplayInfo(displayTemp);
			setNextClick(false);
		}
	}

	const handleDate = ({ date }) => {
		setSearchDate(date);
	}

	const searchResume = () => {
		let date = dayjs(searchDate).format("YYYY-MM-DD");
		if (searchDate !== null || searchName !== "") {
			let temp = []
			for (let i = 0; i < displayTemp.length; i++) {
				if (displayTemp[i].name.indexOf(searchName) !== -1) {
					if ((searchDate !== null && dayjs(displayTemp[i].date).format("YYYY-MM-DD") === date) || searchDate === null) {
						temp.push(displayTemp[i]);
					}
				}
			}
			setDisplayInfo(temp);
		}
		else {
			setDisplayInfo(displayTemp);
		}
	}

	const handleSearch = (e) => {
		let temp = [];
		let value = e.target.value;
		if (value !== "") {
			for (let i = 0; i < displayTemp.length; i++) {
				let info = displayTemp[i];
				if (String(info.number).indexOf(value) !== -1 || info.name.indexOf(value) !== -1 || dayjs(info.date).format("YYYY-MM-DD").indexOf(value) !== -1) {
					temp.push(info);
				}
			}
			setDisplayInfo(temp);
		}
		else {
			setDisplayInfo(displayTemp);
		}
	}	

	const checkResume = async (e) => {
		const resume_id = resumes[e.target.id]['trace_no'];
		try {
			const result = await request.get(`/trace/${resume_id}/view`);
			console.log(result.data);
			history.push(VIEWRESUME, [result.data]);
		} catch (err) {
			console.log(err);
		}
	}

	const getProduct = async (product_id) => {
		try {
			const result = await request.get(`/product/${product_id}/view`);
			setSelectProduct(result.data);
			
			const result2 = await request.get(`/users`);
			setStoreName(result2.data[0].partner_name)
		
		} catch (err) {
			console.log(err);
		}
	}

	const manageLabel = (e) => {
		const resume_id = resumes[e.target.id]['trace_no'];
		setMFG(dayjs(resumes[e.target.id]['create_date']).format('YYYY-MM-DD'))
		getProduct(resumes[e.target.id]['product_id'])
		setSelectId(resume_id);
		setSelectIndex(e.target.id);
		setIsOpenLabel(true);
	}

	const deleteResumeTemp = (e) => {
		console.log(resumes)
		let resume_id = resumes[e.target.id]['trace_no'];
		setSelectId(resume_id);
		setIsOpen(true);
	}

	const deleteResume = async () => {
		try {
			const result = await request.post(`/trace/${selectId}/delete`);
			console.log(result);
			getResumes();
		} catch (err) {
			console.log(err);
		}
	}

	async function getResumes() {
		try {
			const result = await request.get(`/trace`);
			const resume_arr = result.data;
			console.log(resume_arr);
			let temp = [];
			for (let i = 0; i < resume_arr.length; i++) {
				temp.push({'index': i, 'date': resume_arr[i]['create_date'], 'number': resume_arr[i]['trace_no'], 'name': resume_arr[i]['product_name'], "disabled_machine": resume_arr[i]['disabled_machine']});
			}
			setDisplayTemp(temp);
			setDisplayInfo(temp.slice(0, amountTemp));
			setMaxPage(Math.ceil(temp.length/amountTemp));
      		setNextClick(page === Math.ceil(temp.length/amountTemp)? false: true)
			setResumes(resume_arr);
		} catch (err) {
			console.log(err);
		}
	}

	async function getMachines() {
		const result = await request.get(`/users/machines`);
		console.log(result)
		setMachines([...result.data]);
	}

	const pagePast = () => {
		if (page !== 1) {
			let newPage = page - 1;
			let amount = displayAmount.length !== 0? displayAmount[0].value: amountTemp;
			setPage(newPage);
			setDisplayInfo(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
			setNextClick(true);
			if (newPage === 1)
				setPastClick(false);
			else
				setPastClick(true);
		}
	}
	
	const pageNext = () => {
		if (page !== maxPage){
			let newPage = page + 1;
			let amount = displayAmount.length !== 0? displayAmount[0].value: amountTemp;
			setPage(newPage);
			setDisplayInfo(displayTemp.slice(((newPage - 1)*amount), newPage * amount));
			setPastClick(true);
			if (newPage === maxPage)
			setNextClick(false);
			else
			setNextClick(true);
		}
	}

	useEffect(() => {
		getResumes();
		getMachines();
	}, []);


	return (
		<Grid fluid={true}>
			<Modal onClose={close} isOpen={isOpen}>
				<ModalHeader>????????????</ModalHeader>
				<ModalBody>???????????????????</ModalBody>
				<ModalFooter>
					<Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>??????</Button>
					<Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {close(); deleteResume();}}>??????</Button>
				</ModalFooter>
			</Modal>
			<Modal onClose={closeLabel} isOpen={isOpenLabel}>
				<ModalHeader>????????????</ModalHeader>
				<ModalBody>
					<SelectBox>
						<Text>??????????????????</Text>
						<Select
							options = {labelOptions}
							labelKey="label"
							valueKey="value"
							placeholder={''}
							value={labelAction}
							searchable={false}
							onChange={({value}) => {setLabelAction(value)}}
						/>
					</SelectBox>
					{Object(machines).map((item, index) => {
						return (
							<RowBox>
								<MBox>
									<Mtext>{item.machine_name}</Mtext>
								</MBox>
								<InputBox>
									<Text>??????</Text>
									{displayInfo.length > 0 ? (
										<Input placeholder = '????????????' disabled={displayTemp[selectIndex]['disabled_machine'].includes(item.machine_id)? true: false} onChange = {(e) => {machines[index]['labelAmount'] = e.target.value; setMachines([...machines])}}/>
									): (null)
									}
									
								</InputBox>
							</RowBox>
						);
					})}
					
				</ModalBody>
				<ModalFooter>
					<Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={closeLabel}>??????</Button>
					<Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={submitLabel}>??????</Button>
				</ModalFooter>
			</Modal>
			<Row>
				<Col md={12}>
					<Title>????????????</Title>
					<Wrapper>
						<Heading>????????????</Heading>
						<SearchProductBox>
							<ContentBox>
								<Text>????????????</Text>
								<Datepicker 
									onChange = {handleDate}
								/>
							</ContentBox>
							<ContentBox>
								<Text>????????????</Text>
								<Input 
									placeholder = '??????????????????'    
									onChange = {(e) => {setSearchName(e.target.value)}}
									height = {'45px'}
							/>
							</ContentBox>
						</SearchProductBox>
						<ButtonBox>
							<Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} 
								onClick={() => history.push({
									pathname: ADDRESUME,
									state: {data: resumes}
								})}>
								??????
							</Button>
							<Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={searchResume}>??????</Button>
						</ButtonBox>
					</Wrapper>
				</Col>
			</Row>
			<Row>
				<Col md={12}>
					<Wrapper>
						<Heading>
							<SubHeadingLeft>Show
								<SelectBox width="15%">
									<Select
										options = {amountSelectOptions}
										labelKey="label"
										valueKey="value"
										placeholder={10}
										value={displayAmount}
										searchable={false}
										onChange={amountChange}
									/>
								</SelectBox>
									entries
							</SubHeadingLeft>
							<SubHeadingRight>
								<SearchBox>Search:<Input onChange={handleSearch}/></SearchBox>
							</SubHeadingRight>
						</Heading>
						<div>
							{displayInfo.length !== 0 ? (
								<StyledTable>
									<tr>
										{column_names.map((column_name) => (
												<StyledTh>{column_name}</StyledTh>
										))}
									</tr>
									{displayInfo.map((item) => Object.values(item))
										.map((row: Array<string>, index) => (
											<tr>
												<React.Fragment key={row[0]}>
													<StyledTd>{dayjs(row[1]).format('YYYY-MM-DD')}</StyledTd>
													<StyledTd>{row[2]}</StyledTd>
													<StyledTd>{row[3]}</StyledTd>
													<StyledTd>
														<StyledButtonBox>
															<Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={checkResume}>??????</Button>
															<Button id={row[0]} margin='5px' width='110px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={manageLabel}>????????????</Button>
															<Button id={row[0]} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={deleteResumeTemp}>??????</Button>
														</StyledButtonBox>
													</StyledTd>
												</React.Fragment>
											</tr>
										))
									}
									<tr>
									{column_names.map((column_name) => (
											<StyledTh>{column_name}</StyledTh>
									))}
									</tr>
								</StyledTable>
							) : (
								<NoResult
									hideButton={false}
									style={{
											gridColumnStart: '1',
											gridColumnEnd: 'one',
									}}
								/>
							)}
						</div>
						<RowBox>
							<div>
								Showing {(page - 1)*amountTemp + 1} to {page !== maxPage? page*amountTemp: displayTemp.length}
									of {page !== maxPage? amountTemp: displayTemp.length - ((page - 1)*amountTemp + 1) + 1} entries
							</div>
							<div>
								<Button margin='5px' width='95px' height='30px' disabled={!pastClick} background_color={pastClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pagePast}>?????????</Button>
								{page}
								<Button margin='5px' width='95px' height='30px' disabled={!nextClick} background_color={nextClick === true? '#FF902B': '#E9ECEF'} color={'#FFFFFF'} onClick={pageNext}>?????????</Button>
							</div>
						</RowBox>
					</Wrapper>
				</Col>
			</Row>
		</Grid>
	);
};
export default Resume;