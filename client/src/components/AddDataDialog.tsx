import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Tag, Button } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface AddDataDialogProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (data: { name: string; description: string; time: string; tags: string }) => void;
}

const AddDataDialog: React.FC<AddDataDialogProps> = ({ visible, onClose, onAdd }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]); // 所有可用标签
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // 已选标签
    const { t } = useTranslation();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tags');
                if (response.status === 200) {
                    setTags(response.data.map((tag: { name: string }) => tag.name)); // 假设返回的数据是标签对象数组
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    const handleAdd = () => {
        // 验证名称是否为空
        if (!name.trim()) {
            alert(t('validation.nameRequired'));
            return;
        }

        if (selectedTags.length === 0) {
            alert(t('validation.tagRequired'));
            return;
        }
        // 获取当前日期并转换为北京时间
        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // 转换为UTC时间
        const cstTime = new Date(utcTime + (3600000 * 8)); // 转换为北京时间 (UTC+8)

        // 获取北京时间的日期部分
        const formattedDate = cstTime.getFullYear() + '-' +
            ('0' + (cstTime.getMonth() + 1)).slice(-2) + '-' +
            ('0' + cstTime.getDate()).slice(-2);

        const data = {
            name,
            description,
            time: formattedDate,
            tags: selectedTags.join(',')
        };
        onAdd(data);
        handleClose();
    };

    const handleTagRemove = (tag: string) => {
        setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setSelectedTags([]);
        onClose();
    };

    return (
        <Modal
            title={t('addDataDialog.title')} // 使用 t 函数获取翻译
            open={visible}
            maskClosable={false}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>{t('common.cancel')}</Button>, // 使用 t 函数获取翻译
                <Button key="submit" type="primary" onClick={handleAdd}>{t('common.submit')}</Button>, // 使用 t 函数获取翻译
            ]}
        >
            <Input
                placeholder={t('addDataDialog.namePlaceholder')} // 使用 t 函数获取翻译
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <Input.TextArea
                placeholder={t('addDataDialog.descriptionPlaceholder')} // 使用 t 函数获取翻译
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <Select
                mode="multiple"
                placeholder={t('addDataDialog.selectTags')} // 使用 t 函数获取翻译
                value={selectedTags}
                onChange={setSelectedTags}
                style={{ width: '100%', marginBottom: 8 }}
            >
                {tags.map(tag => (
                    <Select.Option key={tag} value={tag}>{tag}</Select.Option>
                ))}
            </Select>
            <div>
                {selectedTags.map(tag => (
                    <Tag
                        closable
                        onClose={() => handleTagRemove(tag)}
                        key={tag}
                        style={{ marginBottom: 4 }}
                    >
                        {tag}
                    </Tag>
                ))}
            </div>
        </Modal>
    );
};

export default AddDataDialog;
