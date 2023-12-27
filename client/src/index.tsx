import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './assets/language/en.json';
import zhTranslation from './assets/language/zh.json';

async function initializeApp() {
  try {
    // 从后端获取当前语言设置
    const response = await axios.get<{ language: string }>('http://localhost:3001/language');
    const currentLanguage = response.data.language || 'zh'; // 如果没有获取到，则默认为'zh'

    // 初始化 i18next
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: enTranslation },
          zh: { translation: zhTranslation }
        },
        lng: currentLanguage, // 使用后端返回的语言设置
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
      });

    // 渲染应用
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error("Failed to find the root element");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// 启动应用初始化
initializeApp();

// Performance measuring
reportWebVitals();
