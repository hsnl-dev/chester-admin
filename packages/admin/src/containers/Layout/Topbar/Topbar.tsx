import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import Popover, { PLACEMENT } from '../../../components/Popover/Popover';
import Notification from '../../../components/Notification/Notification';
import { AuthContext } from '../../../context/auth';
import { STAFF_MEMBERS, SETTINGS } from '../../../settings/constants';
import { NotificationIcon } from '../../../assets/icons/NotificationIcon';
import { AlertDotIcon } from '../../../assets/icons/AlertDotIcon';
import { ArrowLeftRound } from '../../../assets/icons/ArrowLeftRound';
import { MenuIcon } from '../../../assets/icons/MenuIcon';
import {
  TopbarWrapper,
  Logo,
  LogoImage,
  TopbarRightSide,
  ProfileImg,
  Image,
  AlertDot,
  NotificationIconWrapper,
  UserDropdowItem,
  NavLink,
  LogoutBtn,
  DrawerIcon,
  CloseButton,
  DrawerWrapper,
} from './Topbar.style';
import Logoimage from '../../../assets/image/LogoHome.png';
import LogoutImage from '../../../assets/image/logout.png';
import { useDrawerDispatch } from '../../../context/DrawerContext';
import Drawer, { ANCHOR } from '../../../components/Drawer/Drawer';
import Sidebar from '../Sidebar/Sidebar';

const data = [
  {
    title: 'Delivery Successful',
    time: '5m',
    message: 'Order #34567 had been placed',
  },
];
const Topbar = ({ refs }: any) => {
  const dispatch = useDrawerDispatch();
  const { signout } = React.useContext(AuthContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = useCallback(
    () => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM' }),
    [dispatch]
  );

  return (
    <TopbarWrapper ref={refs}>
      <Logo>
        <Link to='/'>
          <LogoImage src={Logoimage} alt='pickbazar-admin' />
        </Link>
      </Logo>

      <DrawerWrapper>
        <DrawerIcon onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </DrawerIcon>
        <Drawer
          isOpen={isDrawerOpen}
          anchor={ANCHOR.left}
          onClose={() => setIsDrawerOpen(false)}
          overrides={{
            Root: {
              style: {
                zIndex: '1',
              },
            },
            DrawerBody: {
              style: {
                marginRight: '0',
                marginLeft: '0',
                '@media only screen and (max-width: 767px)': {
                  marginLeft: '30px',
                },
              },
            },
            DrawerContainer: {
              style: {
                width: '270px',
                '@media only screen and (max-width: 767px)': {
                  width: '80%',
                },
              },
            },
            Close: {
              component: () => (
                <CloseButton onClick={() => setIsDrawerOpen(false)}>
                  <ArrowLeftRound />
                </CloseButton>
              ),
            },
          }}
        >
          <Sidebar onMenuItemClick={() => setIsDrawerOpen(false)} />
        </Drawer>
      </DrawerWrapper>

      <TopbarRightSide>
        <Popover
          onClick={() => {
            signout();
          }}
              
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: '220px',
                zIndex: 2,
              }),
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <ProfileImg>
            <Image src={LogoutImage} alt='user' />
          </ProfileImg>
        </Popover>
      </TopbarRightSide>
    </TopbarWrapper>
  );
};

export default Topbar;
