import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Tag, Button } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface EditDataDialogProps {
    visible: boolean;
    onClose: () => void;
    onEdit: (id: number, updatedData: { name: string; description: string; time: string; tags: string }) => void;
    data: {
        id: number;
        name: string;
        description: string;
        tags: string; // 假设 tags 是以逗号分隔的字符串
    };
}

const EditDataDialog: React.FC<EditDataDialogProps> = ({ visible, onClose, onEdit, data }) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:3001/tags');
                if (response.status === 200) {
                    setTags(response.data.map((tag: { name: string }) => tag.name));
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (visible && data) {
            setName(data.name);
            setDescription(data.description);
            setSelectedTags(data.tags ? data.tags.split(',') : []);
        }
    }, [visible, data]);

    const handleEdit = () => {
        if (!name.trim()) {
            alert(t('validation.nameRequired'));
            return;
        }

        const now = new Date();
        const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cstTime = new Date(utcTime + (3600000 * 8));
        const formattedDate = cstTime.getFullYear() + '-' +
            ('0' + (cstTime.getMonth() + 1)).slice(-2) + '-' +
            ('0' + cstTime.getDate()).slice(-2);

        const updatedData = {
            name,
            description,
            time: formattedDate,
            tags: selectedTags.join(',')
        };
        onEdit(data.id, updatedData);
        onClose();
    };

    const handleTagRemove = (tag: string) => {
        setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
    };

    return (
        <Modal
            title={t('editDataDialog.title')}
            open={visible}
            onCancel={onClose}
            maskClosable={false}
            footer={[
                <Button key="back" onClick={onClose}>{t('common.cancel')}</Button>,
                <Button key="submit" type="primary" onClick={handleEdit}>{t('common.change')}</Button>,
            ]}
        >
            <Input
                placeholder={t('editDataDialog.namePlaceholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <Input.TextArea
                placeholder={t('editDataDialog.descriptionPlaceholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <Select
                mode="multiple"
                placeholder={t('editDataDialog.selectTags')}
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

export default EditDataDialog;
