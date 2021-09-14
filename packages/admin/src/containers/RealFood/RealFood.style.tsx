import { styled } from "baseui";
import Background from '../../assets/image/parts/vegetables-pattern.png';



export const Wrapper = styled("div", ({ $theme }) => ({
    width: "100%",    
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    backgroundColor: "#fff",
    
  
    "@media only screen and (max-width: 520px)": {
      backgroundColor: "#fff"
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
    display: "flex",
    flexDirection: 'row',
    justifyContent: "center"
}));

export const ImageBox = styled("div", (props) => ({
    width: "500px",
    height: "300px",
    backgroundImage: "url("+ props.url +")",
    backgroundSize: 'cover',
    borderRadius: '10px'
}));

export const InfoBox = styled("div", () => ({
    width: "500px",
    height: "300px",
    display: "flex",
    flexDirection: 'column',
    paddingLeft: "1%"
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
    marginTop: '40px',
}));

export const Head = styled("h2", () => ({
    color: "#45595B",
    fontFamily: "Rubik",
    fontSize: "36px",
    marginTop: "40px",
    width: "1000px"
}));

export const TableBox = styled("div", () => ({
    marginTop: "40px"
}))

export const Table = styled("table", () => ({
    width: "950px",
    fontFamily: "Poppins",
    fontSize: "20px",
    borderCollapse: "collapse"
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
    marginTop: '40px',
    
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
    color: '#FFFFFF'
}));

export const Arrow = styled("a", () => ({
    width: "20px",
    height: "20px",
    marginLeft: "10px",
}));
