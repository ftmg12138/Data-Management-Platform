import React, { useState } from 'react';
import './Sidebar.css';
import arrowImage from '../assets/images/arrow_to_left.png';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface SidebarProps {
    onMenuSelect: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const { t } = useTranslation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* 当侧边栏没有收缩时，显示按钮 */}
            {!collapsed && (
                <>
                    <button onClick={() => onMenuSelect('data')} className="menu-item">{t('sidebar.dataTable')}</button>
                    <button onClick={() => onMenuSelect('tags')} className="menu-item">{t('sidebar.tagsTable')}</button>
                </>
            )}
            {/* 箭头按钮一直显示 */}
            <div className={`sidebar-toggle ${collapsed ? 'toggle-collapse' : ''}`} onClick={toggleSidebar}>
                <img src={arrowImage} alt="Toggle Sidebar" className={`toggle-arrow ${collapsed ? 'collapsed' : ''}`} />
            </div>
        </div>
    );
};

export default Sidebar;
