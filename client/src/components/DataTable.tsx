import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Select, Tooltip, Popover, DatePicker } from 'antd';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './DataTable.css';
import AddDataDialog from './AddDataDialog';
import EditDataDialog from './EditDataDialog';
import { useTranslation } from 'react-i18next';

interface DataRecord {
  id: number;
  name: string;
  description: string;
  time: string;
  tags: string;
  continuousId?: number;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

const DataTable: React.FC = () => {
  const { t } = useTranslation();
  const [allData, setAllData] = useState<DataRecord[]>([]);
  const [displayData, setDisplayData] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({ current: 1, pageSize: 10, total: 0 });
  const [nameFilter, setNameFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [datePickerKey, setDatePickerKey] = useState<number>(0);

  const [tempNameFilter, setTempNameFilter] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tempSelectedDate, setTempSelectedDate] = useState<string>('');

  const [isAddDialogVisible, setIsAddDialogVisible] = useState<boolean>(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<DataRecord | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<DataRecord[]>(`http://localhost:3001/data`);
      if (response.status === 200) {
        setAllData(response.data.map(record => ({
          ...record,
          time: dayjs(record.time).format('YYYY/MM/DD')
        })));
        setPagination(prev => ({ ...prev, total: response.data.length }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = allData.filter(record => {
      const recordTags = record.tags.split(','); // 将记录的标签字符串转换为数组
      return record.name.includes(nameFilter) &&
             (!selectedDate || record.time === selectedDate) &&
             tagFilter.every(tag => recordTags.includes(tag)); // 检查每个选中的标签是否都在记录的标签数组中
    });

    const total = filteredData.length;
    const { current, pageSize } = pagination;
  
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentDisplayData = filteredData
      .slice(startIndex, endIndex)
      .map((item, index) => ({
        ...item,
        continuousId: startIndex + index + 1
      }));
  
    setDisplayData(currentDisplayData);
    setPagination(prev => ({ ...prev, total }));
  }, [allData, nameFilter, tagFilter, selectedDate]);

  const resetFilters = () => {
    setNameFilter('');
    setTagFilter([]);
    setSelectedTags([]);
    setSelectedDate('');
    setTempNameFilter('');
    setTempSelectedDate('');
    setDatePickerKey(prevKey => prevKey + 1);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    setPagination({ ...pagination, current: page, pageSize: pageSize ?? pagination.pageSize });
  };

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

  const handleSearch = () => {
    setNameFilter(tempNameFilter);
    setTagFilter(selectedTags);
    setSelectedDate(tempSelectedDate);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3001/data/${id}`);
      if (response.status === 200) {
        const updatedData = allData.filter(record => record.id !== id);
        setAllData(updatedData);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleAddData = (newData: { name: string; description: string; time: string; tags: string }) => {
    axios.post('http://localhost:3001/data', newData)
      .then(response => {
        if (response.status === 200) {
          fetchData();
        }
      })
      .catch(error => {
        console.error('Error adding data:', error);
      });
  };

  const handleEdit = (id: number, updatedData:{ name: string; description: string; time: string; tags: string }) => {
    axios.put(`http://localhost:3001/data/${id}`, updatedData)
      .then(response => {
        if (response.status === 200) {
          fetchData();
        }
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleEditClick = (record: DataRecord) => {
    setEditingData(record);
    setIsEditDialogVisible(true);
  };


const columns: ColumnsType<DataRecord> = [
    {
      title: t('dataTable.columns.id'), // 使用 t 函数获取翻译
      dataIndex: 'continuousId',
      key: 'continuousId',
      width: 80
    },
    {
      title: t('dataTable.columns.name'),
      dataIndex: 'name',
      key: 'name',
      width: 120,
    render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-ellipsis">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t('dataTable.columns.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-ellipsis">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: t('dataTable.columns.time'),
      dataIndex: 'time',
      key: 'time',
      width: 120,
    },
    {
      title: t('dataTable.columns.tags'),
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
    render: (tags: string) => {
        const tagList = tags.split(',');
        if (tagList.length > 2) {
          const popoverContent = (
            <div>
              {tagList.slice(2).map(tag => (
                <Button key={tag} size="small" style={{ margin: '4px' }}>
                  {tag}
                </Button>
              ))}
            </div>
          );
          return (
            <div>
              <Button size="small" style={{ margin: '0 4px' }}>{tagList[0]}</Button>
              <Button size="small" style={{ margin: '0 4px' }}>{tagList[1]}</Button>
              <Popover content={popoverContent} title={t('dataTable.popover.otherTags')}>
                <Button size="small">...</Button>
              </Popover>
            </div>
          );
        }
        return tagList.map(tag => (
          <Button key={tag} size="small" style={{ margin: '0 4px' }}>
            {tag}
          </Button>
        ));
      },
    },
    {
      title:  t('dataTable.columns.action'),
      key: 'action',
      width: 120,
    render: (text: string, record: DataRecord) => (
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
    <div className="data-container">
      <div className="filter-bar">
        <p>{t('dataTable.filters.name')}</p>
        <Input
          placeholder={t('dataTable.filters.enterName')}
          value={tempNameFilter}
          onChange={e => setTempNameFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <p>{t('dataTable.filters.tags')}</p>
        <Select
          className="select-placeholder-left-align"
          mode="multiple"
          placeholder={t('dataTable.filters.selectTags')}
          value={selectedTags}
          onChange={value => setSelectedTags(value as string[])}
          style={{ width: 200 }}
        >
          {tags.map(tag => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
        <p>{t('dataTable.filters.addTime')}</p>
        <DatePicker
          placeholder={t('dataTable.filters.selectDate')}
          key={datePickerKey}
          format="YYYY/MM/DD"
          onChange={(date, dateString) => setTempSelectedDate(dateString)}
          style={{ marginLeft: 8 }}
        />
        <Button type="primary" onClick={handleSearch} style={{ marginLeft: 8 }}>
          {t('common.search')}
        </Button>
        <Button onClick={resetFilters} style={{ marginLeft: 8 }}>
          {t('common.reset')}
        </Button>
      </div>
      <div className="table-container">
        <div className="add-btn-container">
          <Button type="primary" onClick={() => setIsAddDialogVisible(true)} style={{ marginBottom: 16 }}>
            {t('common.add')}
          </Button>
        </div>
        <AddDataDialog
          visible={isAddDialogVisible}
          onClose={() => setIsAddDialogVisible(false)}
          onAdd={handleAddData}
        />
        {editingData && (
            <EditDataDialog
          visible={isEditDialogVisible}
          onClose={() => setIsEditDialogVisible(false)}
          onEdit={handleEdit}
          data={editingData} 
        />
        )}
        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="continuousId" 
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handleTableChange,
            showSizeChanger: true,
            onShowSizeChange: handleTableChange,
            pageSizeOptions: ['5', '10', '15', '20', '50', '100'],
          }}
          loading={loading}
        />
      </div>
    </div>
  );
  
};

export default DataTable;