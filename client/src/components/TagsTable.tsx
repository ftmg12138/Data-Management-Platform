import React, { useState, useEffect } from 'react';
import { Table, Button, Tooltip } from 'antd';
import axios from 'axios';
import AddTagsDialog from './AddTagsDialog';
import EditTagsDialog from './EditTagsDialog';
import './TagsTable.css';
import { useTranslation } from 'react-i18next';

interface Tag {
  id: number;
  name: string;
}

const TagsTable: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [isAddDialogVisible, setIsAddDialogVisible] = useState<boolean>(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { t } = useTranslation();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Tag[]>('http://localhost:3001/tags');
      if (response.status === 200) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = (newTag: Tag) => {
    axios.post('http://localhost:3001/tags', newTag)
      .then(response => {
        if (response.status === 200) {
          const addedTag = response.data;
          setTags(currentTags => [...currentTags, addedTag]);
          fetchTags();
        }
      })
      .catch(error => {
        console.error('Error adding tag:', error);
      });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3001/tags/${id}`);
      if (response.status === 200) {
        fetchTags();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert(t('validation.tagUsed'));
    }
  };

  const handleEdit = (id: number, updatedTag: Tag) => {
    axios.put(`http://localhost:3001/tags/${id}`, updatedTag)
      .then(response => {
        if (response.status === 200) {
          fetchTags();
        }
      })
      .catch(error => {
        console.error('Error updating tag:', error);
      });
  };

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setIsEditDialogVisible(true);
  };

  const columns = [
    {
      title: t('tagsTable.columns.tag'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-ellipsis">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t('tagsTable.columns.action'),
      key: 'action',
      render: (text: string, record: Tag) => (
        <span>
          <Button type="link" onClick={() => handleEditClick(record)}>
            {t('common.edit')}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            {t('common.delete')}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="tags-container">
      <div className="add-btn-container">
        <Button
          type="primary"
          onClick={() => setIsAddDialogVisible(true)}
          style={{ marginBottom: 16 }}
        >
          {t('tagsTable.addTag')}
        </Button>
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading}
        />
        {editingTag && (
            <EditTagsDialog
                visible={isEditDialogVisible}
                onClose={() => setIsEditDialogVisible(false)}
                onEdit={handleEdit}
                tag={editingTag}
            />
            )}
        <AddTagsDialog
          visible={isAddDialogVisible}
          onClose={() => setIsAddDialogVisible(false)}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default TagsTable;
