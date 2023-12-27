import React, { useState } from 'react';
import './App.css';
import Navbar from './components/NavBar';
import DataTable from './components/DataTable';
import TagsTable from './components/TagsTable';
import Sidebar from './components/Sidebar'; // 确保 Sidebar 组件也已转换为 TypeScript

const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('data'); // 使用 string 类型注解

  const handleMenuSelect = (menu: string) => {
    setActiveComponent(menu); // 参数 menu 也被注解为 string 类型
  };

  return (
    <div className="App">
      <Sidebar onMenuSelect={handleMenuSelect} />
      <Navbar />
      <div className="main-content">
        {activeComponent === 'data' ? <DataTable /> : <TagsTable />}
      </div>
    </div>
  );
};

export default App;
