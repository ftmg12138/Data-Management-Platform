import React, { useState } from 'react';
import './NavBar.css';
import Settings from './Settings'; // 确保 Settings 组件也已转换为 TypeScript
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const showSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">{t('navbar.title')}</div>
        <div className="navbar-links">
          <button className="navbar-link" onClick={showSettings}>{t('navbar.settings')}</button>
        </div>
      </nav>
      <Settings visible={settingsVisible} onClose={closeSettings} />
    </>
  );
};

export default Navbar;
