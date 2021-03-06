import { styled } from "baseui";
import Background from '../../assets/image/parts/vegetables-pattern.png';

export const Wrapper = styled("div", ({ $theme }) => ({
	width: "100%",    
	display: "flex",
	flexDirection: 'column',
	alignItems: "center",
	
	backgroundColor: "#fff",
	
	"@media only screen and (max-width: 520px)": {
		backgroundColor: "#fff",
		
	}
}));

export const TitleBox = styled("div", () => ({
	width: "100vw",
	height: "45vh",
	display: "flex",
	flexDirection: 'column',
	alignItems: "center",
	paddingTop: "5vh",
	justifyContent: "space-between",
	backgroundColor: "#FFB524",
}));

export const ProductBox = styled("div", () => ({
	width: "100%",
	display: "flex",
	flexDirection: 'row',
	justifyContent: "center",
	marginTop: '80px'
}));

export const ImageBox = styled("div", (props) => ({
	width: "500px",
	height: "300px",
	backgroundImage: "url("+ props.url +")",
	backgroundSize: 'cover',
	borderRadius: '10px',

	"@media only screen and (max-width: 520px)": {
		width: "250px",
		height: "150px",
	}

}));

export const InfoBox = styled("div", () => ({
	width: "500px",
	height: "300px",
	display: "flex",
	flexDirection: 'column',
	paddingLeft: "1%",
	"@media only screen and (max-width: 520px)": {
		width: "100px",
		height: "60px",
	}
}));

export const Name = styled("h2", () => ({
	color: "#45595B",
	fontFamily: "Rubik",
	fontSize: "36px",
	marginTop: "0px"
}));

export const Price = styled("h2", () => ({
	color: "#FFB524",
	fontFamily: "Poppins",
	fontSize: "24px",
	marginTop: "5px"
}));

export const Line = styled("div", () => ({
	display: "flex",
	flexDirection: 'column',
	backgroundColor: "#FFB524",
	width: "1000px",
	height: "10px",
	marginTop: '100px',
	marginBottom: '100px',
	"@media only screen and (max-width: 520px)": {
		width: "100%",
	}
}));

export const Head = styled("h2", () => ({
	color: "#45595B",
	fontFamily: "Rubik",
	fontSize: "36px",
	marginTop: "40px",
	width: "1000px",
	display: "flex",

	"@media only screen and (max-width: 520px)": {
		width: "70%",
		fontSize: "28px",
		
	}
}));

export const Note = styled("h3", () => ({
	fontFamily: "Rubik",
	fontSize: "18px",
	marginLeft: "30px"
}));

export const TableBox = styled("div", () => ({
	marginTop: "40px",

	"@media only screen and (max-width: 520px)": {
		width: "70%",
	}
}))

export const Table = styled("table", () => ({
	width: "950px",
	fontFamily: "Poppins",
	fontSize: "20px",
	borderCollapse: "collapse",

	"@media only screen and (max-width: 520px)": {
		width: "100%",
	}
}));

export const ThOrange = styled("th", () => ({
	color: "#FFFFFF",
	backgroundColor: "#FFB524",
	height: "50px",
}));

export const ThGrey = styled("th", () => ({
	color: "#495057",
	backgroundColor: "#E9ECEF",
	height: "50px",
	width: "475px",
	padding: "0px",
	borderTop: '2px solid #dee2e6',
}));

export const Td = styled("td", () => ({
	color: "#212529",
	height: "50px",
	width: "475px",
	padding: "0px",
	fontSize: "18px",
	borderTop: '2px solid #dee2e6',
	textAlign: 'center'
}));

export const Button = styled("button", () => ({
	height: "46px",
	width: "104px",
	color: "#FFFFFF",
	backgroundColor: '#007BFF',
	fontFamily: "Poppins",
	fontSize: "14px",
	borderRadius: '20px',
	borderColor: '#FFFFFF',
	marginTop: '100px',
	cursor: "pointer"
}));

export const Button2 = styled("button", () => ({
	display: "inline-block",
	fontWeight: "600",
	textAlign: "center",
	verticalAlign: "middle",
	backgroundColor: "transparent",
	fontSize: "1rem",
	lineHeight: "1.6",
	borderRadius: "0.3125rem",
	padding: "0.1rem 0.5rem",
	marginLeft: "30px",
	marginTop: "10px",
	color: "#71869d",
	borderColor: "#71869d", 
	":hover": {
		color: "#fff",
		backgroundColor: "#71869d",
		borderColor: "#71869d",
		cursor: "pointer"
	},
	"@media only screen and (max-width: 520px)": {
		fontSize: "10px",
		
	}
}));

export const BottomBox = styled("div", () => ({
	width: "100%",
	height: "250px",
	display: "flex",
	flexDirection: 'column',
	alignItems: "center",
	justifyContent: "space-between",
	backgroundColor: "#333333",
	backgroundImage: "url(" + Background + ")",
	marginTop: '40px',
}));

export const BottomText = styled("div", () => ({
	fontFamily: "Poppins",
	fontSize: "20px",
	color: '#FFFFFF', 
	marginBottom: "80px",
	marginLeft: '20px',
	marginRight: '20px',
}));

export const Arrow = styled("a", () => ({
	width: "20px",
	height: "20px",
	marginLeft: "10px",
}));
