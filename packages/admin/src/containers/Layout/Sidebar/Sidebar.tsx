import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import {
  SidebarWrapper,
  NavLink,
  MenuWrapper,
  Svg,
  LogoutBtn,
} from './Sidebar.style';
import {
  PURCHASING,
  PRODUCTS,
  RESUME,
  ORDERS,
  CUSTOMERS,
  COUPONS,
  SETTINGS,
} from '../../../settings/constants';
import { AuthContext } from '../../../context/auth';
import {
  DashboardIcon,
  ProductIcon,
  SidebarCategoryIcon,
  OrderIcon,
  CustomerIcon,
  CouponIcon,
  SettingIcon,
  LogoutIcon,
} from '../../../components/AllSvgIcon';
import backgroundImage from '../../../assets/image/sidebar-bg/01.jpg';

const sidebarMenus = [
  {
    name: '進貨管理',
    path: PURCHASING,
    exact: true,
    icon: <DashboardIcon />,
  },
  {
    name: '商品管理',
    path: PRODUCTS,
    exact: false,
    icon: <ProductIcon />,
  },
  {
    name: '履歷管理',
    path: RESUME,
    exact: false,
    icon: <SidebarCategoryIcon />,
  },
  {
    name: '系統管理',
    path: SETTINGS,
    exact: false,
    icon: <SettingIcon />,
  },
];

export default withRouter(function Sidebar({
  refs,
  style,
  onMenuItemClick,
}: any) {
  const { signout } = useContext(AuthContext);
  return (
    <SidebarWrapper ref={refs} style={style}>
      <MenuWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={{
              color: '#00C58D',
              backgroundColor: '#f7f7f7',
              borderRadius: '50px 0 0 50px',
            }}
            onClick={onMenuItemClick}
          >
            {menu.icon ? <Svg>{menu.icon}</Svg> : ''}
            {menu.name}
          </NavLink>
        ))}
      </MenuWrapper>
    </SidebarWrapper>
  );
});
