import { Header, HeaderHandle } from '@aic-kits/react';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback, useMemo, useRef } from 'react';

import { DROPDOWN_NAV_ITEMS, NAV_ITEMS } from './constants';


export const AppHeader = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const pathname = location.pathname;

  const headerRef = useRef<HeaderHandle>(null)
  const handleLogout = useCallback(async () => {
    headerRef.current?.hideDropdown()
  }, []);

  const headerProps = useMemo(() => ({
    navItems: NAV_ITEMS.map((item) => ({
      ...item,
      isActive: item.path === pathname,
      onClick: () => navigate(item.path),
    })),
    isSignedIn: false,
    onSignInClick: () => navigate('/login'),
    onRegisterClick: () => navigate('/register'),
    onLogoClick: () => navigate('/'),
    profileDropdownItems: [
      ...DROPDOWN_NAV_ITEMS.map((item) => ({
        ...item,
        isActive: item.path === pathname,
        onClick: () => navigate(item.path),
      })),
      {
        label: 'Logout',
        onClick: handleLogout,
      }
    ],
  }), [handleLogout, navigate, pathname]);
	
  return <Header {...headerProps} />;
}
