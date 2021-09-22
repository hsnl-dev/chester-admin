import React, { useState, useEffect, useRef } from 'react';
import { styled, withStyle } from 'baseui';

import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';

import Button from '../../components/Button/Button';
import { ButtonBox, Text } from '../../components/SearchCard/SearchCard';

import logo from '../../assets/image/parts/Logo.jpg';
import logoBottom from '../../assets/image/parts/LogoBottom.png';

import QRCode from 'qrcode.react';
import { useHistory, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { RESUME } from '../../settings/constants';

const Col = withStyle(Column, () => ({
	'@media only screen and (max-width: 574px)': {
			marginBottom: '40px',

			':last-child': {
					marginBottom: 0,
			},
	},
}));


const LabelBox = styled('div', () => ({
	
    marginBottom: '40px',
	overFlow: 'scroll',
}));

const Label = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	width: '400px',
	height: '335px',
	backgroundColor: '#FFFFFF',
}));

const LabelRow = styled('div', () => ({
	display: 'flex',
	flexDirection: 'Row',
	alignItems: 'center',
    justifyContent: 'space-between',
	padding: '10px',
}));

const LabelText = styled('div', () => ({
	fontFamily: "Microsoft JhengHei",
	fontWeight: '700',
	paddingLeft: '10px'
}));

const LabelProductBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	
}));

const QRcodeBox = styled('div', () => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	paddingLeft: '10px',
}));

interface props {
    data: any
}

class ComponentToPrint extends React.Component<props> {
    render() {
        return (
            <LabelBox>
                {Object(this.props.data).map((item, index) => {
                    return (
                        <Label>
                            <LabelRow>
                                <img src={logo} width='179' height='67'/>
                                <LabelText>查看商品履歷請掃碼</LabelText>
                            </LabelRow>
                            <LabelRow>
                                <LabelProductBox>
                                    <LabelText>名稱: {item.name}</LabelText>
                                    <LabelText>履歷號碼: {item.traceNumber}</LabelText>
                                    <LabelText>供應商: {item.store}</LabelText>
                                    <LabelText>製造日期: {item.MFG}</LabelText>
                                    <LabelText>保存方式: {item.storeMethod}</LabelText>
                                    <LabelText>智販機名稱: {item.machine}</LabelText>
                                </LabelProductBox>
                                <QRcodeBox>
                                    <QRCode value={item.url} />
                                </QRcodeBox>
                            </LabelRow>
                            <img src={logoBottom} width='100%' height='70' />
                        </Label>
                    )
                })}
            </LabelBox>
        );
    }
}

const LabelPrint = () => {
    const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});
    const history = useHistory();
    const location = useLocation();

    return (
        <Grid fluid={true}>
           
            <ComponentToPrint data={location.state[0]} ref={componentRef} />
        
            <ButtonBox>
				<Button margin='5px' width='100px' height='45px' background_color='#616D89' color={'#FFFFFF'} 
					onClick={() => history.push({
							pathname: RESUME
					})}>
					前一頁
				</Button>
				<Button margin='5px' width='110px' height='45px' background_color='#FF902B' color={'#FFFFFF'} onClick={handlePrint}>列印</Button>
			</ButtonBox>
        </Grid>
    )
    
}

export default LabelPrint;