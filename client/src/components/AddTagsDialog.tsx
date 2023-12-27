import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface AddTagsDialogProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (newTag: { id: number; name: string }) => void;
}

const AddTagsDialog: React.FC<AddTagsDialogProps> = ({ visible, onClose, onAdd }) => {
    const [tagName, setTagName] = useState<string>('');
    const { t } = useTranslation();

    const handleAdd = async () => {
        if (!tagName.trim()) {
            alert(t('validation.tagNameRequired'));
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/tags', { name: tagName });
            if (response.status === 200) {
                // 假设这里后端返回的是添加成功的标签ID
                const newTag = { id: response.data.id, name: tagName };
                onAdd(newTag); // 使用内部状态更新父组件
                setTagName(''); // 清空输入框
                onClose(); // 关闭对话框
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        }
    };

    return (
        <Modal
            title={t('addTagsDialog.title')} // 使用 t 函数获取翻译
            open={visible}
            maskClosable={false}
            onCancel={() => {
                setTagName('');
                onClose();
            }}
            footer={[
                <Button key="back" onClick={() => {
                    setTagName('');
                    onClose();
                }}>{t('common.cancel')}</Button>, // 使用 t 函数获取翻译
                <Button key="submit" type="primary" onClick={handleAdd}>{t('common.add')}</Button>, // 使用 t 函数获取翻译
            ]}
        >
            <Input
                placeholder={t('addTagsDialog.placeholder')} // 使用 t 函数获取翻译
                value={tagName}
                onChange={e => setTagName(e.target.value)}
                onPressEnter={handleAdd} // 允许按回车键提交
            />
        </Modal>
    );
};

export default AddTagsDialog;
