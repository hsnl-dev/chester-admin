import React, { useState, useEffect } from 'react';
import { Wrapper, TitleBox, ProductBox, ImageBox, InfoBox, Name, Price, Line, Head, TableBox, Table, ThOrange, ThGrey, Td, Button, BottomBox, BottomText } from './RealFood.style';
import curveTop from '../../assets/image/parts/curveTop.png';
import curveBottom from '../../assets/image/parts/curveBottom.png';
import logo from '../../assets/image/parts/realfood.png';
import test from '../../assets/image/parts/bento.jpg';

import { request } from '../../utils/request';

const RealFood = () => {
	const [name, setName] = useState("雞腿便當");
	const [imageUrl, setImageUrl] = useState("");
	const [price, setPrice] = useState("110");
	const [food, setFood] = useState({"staple_food": [{'name': '米飯', 'origin': '嘉義縣', "url": ""}], 
																	"main_dish": [{'name': '雞腿', 'origin': '台南市', "url": ""}], 
																	"side_dish": [{'name': '滷蛋', 'origin': '宜蘭縣', "url": ""}, {'name': '高麗菜', 'origin': '嘉義縣', "url": ""}], 
																	"others": []});
	const [store, setStore] = useState({'name': '阿王水果行', 'address': '新北市三重區光復路1號', 'phone': '0922-123-456', 'food_industry_id': 'A-124975494-00000-2'})
	const [machine, setMachine] = useState({'shelf_time': '2020/01/03 15:00', 'temperature': '70', 'name': '切斯特國際股份有限公司', 'address': '台北市中山區復興北路92號 10樓之1', 'phone': '02-2715-1011', 'food_industry_id':'12304'});
	const [traceId, setTraceId] = useState("2021091411testproduct006-machine001");
	
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
								<Td>{item.origin}</Td>
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
			const data = result.data;
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
				<img src={logo} />
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
			<Head>商品履歷</Head>

			{foodTable('主食', food.staple_food)}
			{foodTable('主菜', food.main_dish)}
			{foodTable('配菜', food.side_dish)}
			{foodTable('其他', food.others)}

			<TableBox>
				<Table>
					<tr><ThOrange>供應商資訊</ThOrange></tr>
					<tr><Td>名稱:	{store.name}</Td></tr>
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
			<Button>了解更多</Button>

			<BottomBox>
				<img src={curveBottom} width="100%" />
				<BottomText>Copyright © 2021 切斯特國際股份有限公司. All rights reserved.</BottomText>
			</BottomBox>
		</Wrapper>
	);
}
export default RealFood;