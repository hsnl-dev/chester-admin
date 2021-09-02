import React, { useState, useEffect } from 'react';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { styled, withStyle } from 'baseui';
import { useHistory, useLocation } from 'react-router';
import { Heading, Title } from '../../components/DisplayTable/DisplayTable';
import { Datepicker } from 'baseui/datepicker';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell,StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';

import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import dayjs from 'dayjs';
import tw from 'date-fns/locale/zh-TW';

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



const ViewResume = () => {
    const history = useHistory();
    const location = useLocation();
    const [product, setProduct] = useState([]);
    const [amount, setAmount] = useState(0);
    const [MFG, setMFG] = useState('1970-01-01');
    const [commodities, setCommodities] = useState({});

    

    const getResumes = (resumes) => {
        console.log("resumes data");
        console.log(resumes);
        setAmount(resumes.amount);
        setProduct([{'value': resumes.product_name, 'label': resumes.product_name}]);
        setMFG(resumes.create_date);
        setCommodities(resumes.commodities);
    }

    const foodRow = (head, commodity) => {
        const column_names = ['進貨品名', '進貨日期', '數量', '單位'];
        console.log(column_names)
        if (commodity !== undefined) {
            if (commodity.length !== 0) {
                return (
                    <Row>
                        <Col md={12}>
                            <Wrapper>
                                <Heading>{head}</Heading>
                                <div>
                                    <StyledRoot>
                                        <StyledTable>
                                            <StyledTableHeadRow>
                                            {column_names.map((column_name) => (
                                                <StyledTableHeadCell>{column_name}</StyledTableHeadCell>
                                            ))}
                                            </StyledTableHeadRow>
                                            {commodity !== undefined? (commodity.map((item) => Object.values(item))
                                                .map((row: Array<string>, index) => (
                                                    <StyledTableBodyRow>
                                                        <StyledTableBodyCell>{commodity[index].commodity_name}</StyledTableBodyCell>
                                                        <StyledTableBodyCell>{dayjs(commodity[index].create_at).format('YYYY-MM-DD')}</StyledTableBodyCell>
                                                        <StyledTableBodyCell>{commodity[index].amount}</StyledTableBodyCell>
                                                        <StyledTableBodyCell>{commodity[index].unit}</StyledTableBodyCell>
                                                    </StyledTableBodyRow>
                                                ))
                                            ):(null)}
                                        </StyledTable>
                                    </StyledRoot>
                                </div>
                            </Wrapper>
                        </Col>
                    </Row>
                );
            }
        }
    }

    useEffect(() => {
        getResumes(location.state[0]);
    }, [])

    return (
        <Grid fluid={true}>
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
									value={new Date(MFG)}
                                    disabled={true}
								/>
							</ContentBox>
							<ContentBox>
								<Text>製成商品</Text>
								<Select
									labelKey="label"
									valueKey="value"
									value={product}
                                    disabled={true}
								/>
							</ContentBox>
						</SearchProductBox>
						<SearchProductBox>
							<ContentBox>
								<Text>製成數量</Text>
								<Input 
									value={amount}
									height={'45px'}
                                    disabled={true}
								/>
							</ContentBox>
                            <ContentBox>
							</ContentBox>
						</SearchProductBox>
					</Wrapper>
				</Col>
			</Row>
            {foodRow('主食', commodities['staple_food'])}
            {foodRow('主菜', commodities['main_dish'])}
            {foodRow('配菜', commodities['side_dish'])}
            {foodRow('其他', commodities['others'])}
			<ButtonBox>
				<Button margin='5px' width='110px' height='45px' background_color='#FF902B' color={'#FFFFFF'} 
                    onClick={() => history.push({
                        pathname: RESUME
                })}>
                    完成查看
                </Button>
			</ButtonBox>
        </Grid>
    );
};
export default ViewResume;