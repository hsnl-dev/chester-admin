import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { Wrapper, TitleBox, ProductBox, ImageBox, InfoBox, Name, Price, Line, Head, TableBox, Table, ThOrange, ThGrey, Td, Button, Button2, BottomBox, BottomText, Arrow } from './RealFood.style';
import { Link } from 'react-router-dom';
import curveTop from '../../assets/image/parts/curveTop.png';
import curveBottom from '../../assets/image/parts/curveBottom.png';
import logo from '../../assets/image/parts/realfood.png';
import arrow from '../../assets/image/parts/right-arrow.png';
import { request } from '../../utils/request';

interface RouteParams {
    traceId: string,
};

const RealFood = () => {
	let params = useParams<RouteParams>();
	let testId = "2021091411testproduct001-machine001";
	const [blockHash, setBlockHash] = useState("");
	const [name, setName] = useState("雞腿便當");
	const [imageUrl, setImageUrl] = useState("");
	const [price, setPrice] = useState("110");
	const [food, setFood] = useState({"staple_food": [], "main_dish": [], "side_dish": [], "others": []});
	const [store, setStore] = useState({'name': '', 'address': '', 'phone': '', 'food_industry_id': ''})
	const [machine, setMachine] = useState({'shelf_time': '', 'temperature': '', 'name': '', 'address': '', 'phone': '', 'food_industry_id':''});
	const [traceId, setTraceId] = useState(params.traceId);
    
	const foodTable = (foodName, data) => {
		if (data.length > 0) {
			return (
				<TableBox>
					<Table>
							<tr><ThOrange>{foodName}</ThOrange></tr>
					</Table>
					<Table>
						<tr> 
							<ThGrey>原料/名稱</ThGrey>
							<ThGrey>產地來源</ThGrey>
						</tr>
						{data.map((item) => (
							<tr>
								<Td>{item.name}</Td>
								<Td>{item.origin}
								{
									item.url !== "" ? (
										<a href = {item.url} target="_blank">
											<Arrow><img alt="arrow" src={arrow} width="20px" height="20px"/></Arrow>
											產銷履歷
										</a>) 
									: (null)
								}
								{
									item.bc_url !== "" ? (
											<a href = {item.bc_url} target="_blank">
												<Arrow><img alt="arrow" src={arrow} width="20px" height="20px"/></Arrow>
												區塊鏈溯源
											</a>
									) : (null)
								}
								</Td>
							</tr>
						))}
					</Table>
				</TableBox>
			)
		}
	}

	async function getTraceInfo() {
		try {
			const result = await request.get(`/api/${traceId}`);
			console.log(result);
			const data = result.data.data;
			const block_hash = result.data.block_hash;
			setBlockHash(block_hash);
			setName(data.product_name);
			setImageUrl(data.product_picture);
			setPrice(data.product_price);
			setStore({
				"name": data.partner_name,
				"address": data.partner_address,
				"phone": data.partner_phone,
				"food_industry_id": data.partner_fdaId
			});
			setMachine({
				"shelf_time": data.machine_timestamp,
				"temperature": data.machine_temperature,
				"name": data.vendor_name,
				"address": data.vendor_address,
				"phone": data.vendor_phone,
				"food_industry_id": data.vendor_fdaId
			});
			setFood({
				"staple_food": data.commodities.staple_food,
				"main_dish": data.commodities.main_dish,
				"side_dish": data.commodities.side_dish,
				"others": data.commodities.others
			});
		}	catch (err) {
			console.log(err);
		}
	}

    useEffect(() => {
        getTraceInfo();
    }, []);

	return (
		<Wrapper>
			<TitleBox>
				<img src={logo} width="80%" height="80%"/>
				<img src={curveTop} width="100%"/>
			</TitleBox>
            
			<ProductBox>
				<ImageBox url={imageUrl}></ImageBox>
				<InfoBox>
					<Name>{name}</Name>
					<Price>${price}</Price>
				</InfoBox>
			</ProductBox>
			 <Line/>
			<Head>
				商品履歷
				<Button2
					onClick={() =>
						window.open("https://goerli.etherscan.io/tx/" + blockHash)
					}
				>
					<FontAwesomeIcon icon={faShieldAlt} />
					詳細區塊鏈資訊...
				</Button2>
			</Head>

			{foodTable('主食', food.staple_food)}
			{foodTable('主菜', food.main_dish)}
			{foodTable('配菜', food.side_dish)}
			{foodTable('其他', food.others)}

			<TableBox>
				<Table>
					<tr><ThOrange>供應商資訊</ThOrange></tr>
					<tr><Td>名稱: {store.name}</Td></tr>
					<tr><Td>地址: {store.address}</Td></tr>
					<tr><Td>電話: {store.phone}</Td></tr>
					<tr><Td>食品業者登錄字號: {store.food_industry_id}</Td></tr>
				</Table>
			</TableBox>

			<Line/>
			<Head>販賣機履歷</Head>

			<TableBox>
				<Table>
					<tr><ThOrange>販賣機管理項目</ThOrange></tr>
					<tr><Td>上架時間: {machine.shelf_time}</Td></tr>
					<tr><Td>販賣機溫度: {machine.temperature} °C</Td></tr>
				</Table>
			</TableBox>

			<TableBox>
				<Table>
					<tr><ThOrange>販賣機廠商資訊</ThOrange></tr>
					<tr><Td>名稱: {machine.name}</Td></tr>
					<tr><Td>地址: {machine.address}</Td></tr>
					<tr><Td>電話: {machine.phone}</Td></tr>
					<tr><Td>食品業者登錄字號: {machine.food_industry_id}</Td></tr>
				</Table>
			</TableBox>
			<Button 
				onClick={() =>
					window.open("https://lin.ee/U71tKeD")
				}
			>
				了解更多
			</Button> 
			
			<BottomBox>
				<img src={curveBottom} width="100%" />
				<BottomText>Copyright © 2021 切斯特國際股份有限公司. All rights reserved.</BottomText>
			</BottomBox>
		</Wrapper>
	);
}
export default RealFood;