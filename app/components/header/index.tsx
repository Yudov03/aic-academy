import { Header, HeaderHandle } from '@aic-kits/react';
import { useLocation, useNavigate, Form } from '@remix-run/react';
import { useMemo, useRef } from 'react';

import { DROPDOWN_NAV_ITEMS, NAV_ITEMS } from './constants';

export const AppHeader = ({ isSignedIn }: { isSignedIn: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const headerRef = useRef<HeaderHandle>(null);

  const handleLogoutClick = () => {
    headerRef.current?.hideDropdown();
    const logoutForm = document.getElementById('logout-form') as HTMLFormElement | null;
    logoutForm?.submit();
  };

  const headerProps = useMemo(() => ({
    navItems: NAV_ITEMS.map((item) => ({
      ...item,
      isActive: item.path === pathname,
      onClick: () => navigate(item.path),
    })),
    isSignedIn: isSignedIn,
    onSignInClick: () => navigate('/login'),
    onRegisterClick: () => navigate('/register'),
    onLogoClick: () => navigate('/'),
    profileDropdownItems: isSignedIn ? [
      ...DROPDOWN_NAV_ITEMS.map((item) => ({
        ...item,
        isActive: item.path === pathname,
        onClick: () => navigate(item.path),
      })),
      {
        label: 'Logout',
        onClick: handleLogoutClick,
      }
    ] : [],
  }), [navigate, pathname, isSignedIn]);

  const renderHiddenLogoutForm = isSignedIn && (
     <Form id="logout-form" action="/logout" method="post" style={{ display: 'none' }} />
  );

  return (
    <>
      <Header ref={headerRef} {...headerProps} />
      {renderHiddenLogoutForm}
    </>
  );
}
