import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Row, Col } from 'antd';
import axios from 'axios';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface SettingsProps {
    visible: boolean;
    onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ visible, onClose }) => {
    const [tempLanguage, setTempLanguage] = useState<string>(''); // 用于暂时存储选中的语言

    const { t } = useTranslation();

    useEffect(() => {
        const fetchLanguage = async () => {
            try {
                const response = await axios.get('http://localhost:3001/language');
                if (response.status === 200 && response.data.language) {
                    setTempLanguage(response.data.language);
                }
            } catch (error) {
                console.error('Error fetching language:', error);
            }
        };

        if (visible) {
            fetchLanguage();
        }
    }, [visible]); // 添加 visible 作为 useEffect 的依赖

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:3001/language', { language: tempLanguage });
            i18n.changeLanguage(tempLanguage);
            onClose();
        } catch (error) {
            console.error('Error updating language:', error);
        }
    };

    return (
        <Modal
            title={t('settings.title')}
            open={visible}
            maskClosable={false}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>{t('common.cancel')}</Button>,
                <Button key="submit" type="primary" onClick={handleSave}>{t('settings.saveSettings')}</Button>,
            ]}
        >
            <Row align="middle" style={{ marginBottom: 16 }}>
                <Col span={8}>{t('settings.language')}</Col>
                <Col span={16}>
                    <Select
                        value={tempLanguage}
                        onChange={setTempLanguage}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="zh">简体中文</Select.Option>
                        <Select.Option value="en">English</Select.Option>
                    </Select>
                </Col>
            </Row>
        </Modal>
    );
};

export default Settings;
