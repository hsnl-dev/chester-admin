import React from 'react';
import { styled, withStyle } from 'baseui';
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import { Heading, Title, Text } from '../../components/DisplayTable/DisplayTable';
import { StyledRoot, StyledTable, StyledTableHeadRow, StyledTableHeadCell, StyledTableBodyRow, StyledTableBodyCell } from 'baseui/table-semantic';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import { PURCHASING } from '../../settings/constants';
import Button from '../../components/Button/Button';
import dayjs from 'dayjs';

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

const ButtonBox = styled('div', ({}) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
}));

const ViewPruchasing = () => {
    const [commodities, setCommodities] = useState([]);
    const [vendor, setVendor] = useState({});
    const location = useLocation();
    const history = useHistory();
    const column_names = ['進貨品名', '溯源履歷號碼', '原產地', '批號', '品牌', '數量', '單位', '製造日期', '有效日期', '單價', '總價', '備註'];

    const getInfo = async (info) => {
        // console.log(info);
        commodities.push(...info[0]);
        let keys = Object.keys(info[1]);
        for (let i = 0; i < keys.length; i++) {
            vendor[keys[i]] = info[1][keys[i]];
        }
        setCommodities([...commodities]);
        setVendor({...vendor});
    }

    useEffect(() => {
        getInfo(location.state);
        // console.log(commodities);
        // console.log(vendor);
    }, [])
    return (
        <Grid fluid={true}>
          <Row>
            <Col md={12}>
                <Title>查看</Title>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Wrapper>
                <Heading>進貨資訊</Heading>
                <StyledRoot>
                    <StyledTable>
                        <StyledTableHeadRow>
                        {column_names.map((column_name) => (
                            <StyledTableHeadCell>{column_name}</StyledTableHeadCell>
                        ))}
                        </StyledTableHeadRow>
                        {commodities.map((item) => Object.values(item))
                            .map((row: Array<string>, index) => (
                            <StyledTableBodyRow>
                                <StyledTableBodyCell>{commodities[index].name}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].trace_no}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].origin}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].batch_no}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].brand}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].amount}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].unit}</StyledTableBodyCell>
                                <StyledTableBodyCell>{dayjs(commodities[index].MFG).format('YYYY-MM-DD')}</StyledTableBodyCell>
                                <StyledTableBodyCell>{dayjs(commodities[index].EXP).format('YYYY-MM-DD')}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].unit_price}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].gross_price}</StyledTableBodyCell>
                                <StyledTableBodyCell>{commodities[index].note}</StyledTableBodyCell>
                            </StyledTableBodyRow>
                            ))
                        }
                    </StyledTable>
                </StyledRoot>
                <ButtonBox>
                    <Button margin='5px' width='120px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={()=>{history.push(PURCHASING)}}>完成查看</Button>
                </ButtonBox>
              </Wrapper>
            </Col>
          </Row>
        </Grid>
    );
};
export default ViewPruchasing;