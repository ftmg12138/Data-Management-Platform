import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

// 定义 props 的接口
interface EditTagsDialogProps {
    visible: boolean;
    onClose: () => void;
    onEdit: (id: number, updatedTag: Tag) => void;
    tag: {
        id: number;
        name: string;
    };
}
// Tag 接口的定义，如果在其他地方已定义，则无需重复定义
interface Tag {
    id: number;
    name: string;
}

const EditTagsDialog: React.FC<EditTagsDialogProps> = ({ visible, onClose, onEdit, tag }) => {
    const [tagName, setTagName] = useState<string>('');
    const { t } = useTranslation();

    useEffect(() => {
        if (visible && tag) {
            setTagName(tag.name);
        }
    }, [visible, tag]);

    const handleEdit = () => {
        if (!tagName.trim()) {
            alert(t('validation.tagNameRequired'));
            return;
        }
        onEdit(tag.id, { id: tag.id, name: tagName });
        onClose();
    };

    return (
        <Modal
            title={t('editTagDialog.title')} // 使用 t 函数获取翻译
            open={visible}
            onCancel={onClose}
            maskClosable={false}
            footer={[
                <Button key="back" onClick={onClose}>{t('common.cancel')}</Button>, // 使用 t 函数获取翻译
                <Button key="submit" type="primary" onClick={handleEdit}>{t('editTagDialog.saveChanges')}</Button>, // 使用 t 函数获取翻译
            ]}
        >
            <Input
                placeholder={t('editTagDialog.tagNamePlaceholder')} // 使用 t 函数获取翻译
                value={tagName}
                onChange={e => setTagName(e.target.value)}
            />
        </Modal>
    );
};

export default EditTagsDialog;
