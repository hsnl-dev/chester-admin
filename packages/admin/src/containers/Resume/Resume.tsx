import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { styled, withStyle } from 'baseui';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'baseui/modal';

import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import Select from '../../components/Select/Select';
import { SelectBox } from '../../components/Select/Select';
import { Datepicker } from 'baseui/datepicker';
import Input from '../../components/Input/Input';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import NoResult from '../../components/NoResult/NoResult';
import { Heading, StyledTable, StyledTd, StyledTh, StyledButtonBox, SubHeadingLeft, SubHeadingRight, Title } from '../../components/DisplayTable/DisplayTable';
import { ADDRESUME } from '../../settings/constants';
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

const Resume = () => {
	const amountSelectOptions = [
			{ value: 10, label: '10' },
			{ value: 25, label: '25' },
			{ value: 50, label: '50' },
			{ value: 100, label: '100' },
	];
	const column_names = ['建立日期', '溯源履歷號碼', '商品名稱', '操作'];
	const [displayInfo, setDisplayInfo] = useState([{'date': '2020/12/02', 'number': '12345', 'name': 'ABC'}]);
	const [displayAmount, setDisplayAmount] = useState([]);
	const [resumes, setResumes] = useState([]);
	const [selectId, setSelectId] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const history = useHistory();

	const close = () => {
    setIsOpen(false);
  }

	const amountChange = ({ value }) => {
			setDisplayAmount(value);
			console.log(displayAmount)
	}

	const handleChange = () => {
			
	}

	const searchResume = () => {

	}

	const handleSearch = () => {

	}

	const checkResume = () => {

	}

	const manageLabel = () => {

	}

	const deleteResumeTemp = (e) => {
		console.log(resumes)
    let resume_id = resumes[e.target.id]['id'];
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
      let displayTemp = [];
      for (let i = 0; i < resume_arr.length; i++) {
        displayTemp.push({'date': resume_arr[i]['create_date'], 'number': resume_arr[i]['id'], 'name': resume_arr[i]['product_name']});
      }
      setDisplayInfo(displayTemp);
      setResumes(resume_arr);
    } catch (err) {
      console.log(err);
    }
	}

	useEffect(() => {
		getResumes();
	}, []);


	return (
		<Grid fluid={true}>
			<Modal onClose={close} isOpen={isOpen}>
        <ModalHeader>刪除履歷</ModalHeader>
        <ModalBody>是否確定刪除?</ModalBody>
        <ModalFooter>
          <Button background_color={'#616D89'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={close}>取消</Button>
          <Button background_color={'#FF902B'} color={'#FFFFFF'} margin={'5px'} height={'40px'} onClick={() => {close(); deleteResume();}}>確定</Button>
        </ModalFooter>
      </Modal>
			<Row>
				<Col md={12}>
					<Title>履歷管理</Title>
					<Wrapper>
						<Heading>履歷查詢</Heading>
						<SearchProductBox>
							<ContentBox>
								<Text>建立日期</Text>
								<Datepicker 
									onChange = {handleChange}
								/>
							</ContentBox>
							<ContentBox>
								<Text>商品名稱</Text>
								<Input 
									placeholder = '輸入商品名稱'    
									onChange = {handleChange}
									height = {'45px'}
							/>
							</ContentBox>
						</SearchProductBox>
						<ButtonBox>
							<Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} 
								onClick={() => history.push({
								pathname: ADDRESUME
								})}>
								新增
							</Button>
							<Button margin='5px' width='80px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={searchResume}>查詢</Button>
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
												<React.Fragment key={index}>
													<StyledTd>{row[0]}</StyledTd>
													<StyledTd>{row[1]}</StyledTd>
													<StyledTd>{row[2]}</StyledTd>
													{row.length >= 4 && row[3] !== '' ? <StyledTd>{row[3]}</StyledTd>: null}
													<StyledTd>
														<StyledButtonBox>
															<Button id={index} margin='5px' width='80px' height='45px' background_color='#40C057' color={'#FFFFFF'} onClick={checkResume}>查看</Button>
															<Button id={index} margin='5px' width='110px' height='45px' background_color='#2F8BE6' color={'#FFFFFF'} onClick={manageLabel}>標籤管理</Button>
															<Button id={index} margin='5px' width='80px' height='45px' background_color='#F55252' color={'#FFFFFF'} onClick={deleteResumeTemp}>刪除</Button>
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
					</Wrapper>
				</Col>
			</Row>
		</Grid>
	);
};
export default Resume;