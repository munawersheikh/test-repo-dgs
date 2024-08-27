import { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Typography } from 'antd';
import { PieChartOutlined } from "@ant-design/icons";
import Navbar from '../Navbar';
import ExportModal from './ExportModal';
import Sidebar from '../Sidebar/Sidebar';
import CollectionsCollapsedListing from './CollectionsCollapsedListing';
import { useNavigate } from 'react-router-dom';
import { getCollections } from '../../Services'; // Import the service function
import { Utilities } from '../../Utilities';

const CollectionsListing = () => {
  const navigate = useNavigate();
  const { Title } = Typography;
  const utils = new Utilities();

  const initialStorageData = {
    count: null,
    jobRecId: null,
    startTime: null,
    endTime: null,
    maskStartTime: null,
    maskEndTime: null,
    threshold: null,
    bandwidth: null,
    sdrGain: null,
    frequency: null,
    sampleRate: null,
    operations: [],
  };

  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [tableKey, setTableKey] = useState(0);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<string | null>(null);
  const [storageData, setStorageData] = useState(initialStorageData);
  const [selectedRecord, setSelectedRecord] = useState<any>(null); // Add state to store the selected record
  const [nodeAliases, setNodeAliases] = useState<any[]>([]); // State to store node aliases from local storage

  useEffect(() => {
    // Fetch node aliases from local storage
    const storedNodes = JSON.parse(localStorage.getItem('nodes') || '[]');
    setNodeAliases(storedNodes);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCollections(500, 0); // Use the service function

        if (data) {
          const filteredData = data.records.filter((item: any) => {
            const splitted = item.job.status.split('~');
            const lastIndex = splitted.length - 1;
            return splitted[lastIndex].toLowerCase() !== "failed";
          });

          const fetchedData = filteredData.map((record: any, index: number) => {
            // Check if node name matches any alias in local storage
            const matchingAlias = nodeAliases.find((node: any) => node.name === record.node.name);
            const displayNodeName = matchingAlias && matchingAlias.alias.trim() !== '' ? matchingAlias.alias : record.node.name;

            return {
              key: index,
              count: data.count,
              siteName: record.node.name,
              nodeName: displayNodeName, // Use alias name if available and not empty, otherwise use node name from API
              startDate: formatDateTime(record.job.collect_start).formattedDate,
              startTime: formatDateTime(record.job.collect_start).formattedTime,
              stopDate: formatDateTime(record.job.collect_end).formattedDate,
              stopTime: formatDateTime(record.job.collect_end).formattedTime,
              centerFrequency: record.job.center_frequency,
              bandwidth: record.job.usable_bw,
              descriptionDetails: {
                recId: record.job.recid,
                collectStart: record.job.collect_start,
                collectStop: record.job.collect_end,
                nodeRecId: record.node.recid,
                centerFrequency: record.job.center_frequency,
                bandwidth: record.job.usable_bw,
                sampleRate: record.job.sample_rate,
                sdrUseAgc: record.job.sdr_use_agc,
                sdrGain: record.job.sdr_gain,
                psd: record.job.pack_name === "PSD" ? "Y" : "N",
                chop: record.job.chop_enabled,
                lmrDecode: "N",
                lteDecode: "N",
                locationData: "Y",
              },
              timeSliceDetails: utils.createTimeSlices(record.job.collect_start, record.job.collect_end)
            };
          });
          setCollectionData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, [nodeAliases]);

  const onReportButtonClick = () => {
    // if (selectedRecord) {
    //   const jobInfo = JSON.stringify({
    //     count: selectedRecord.count,
    //     jobRecId: selectedRecord.descriptionDetails.recId,
    //     startDate: selectedRecord.startDate,
    //     endDate: selectedRecord.stopDate,
    //     startTime: selectedRecord.startTime,
    //     endTime: selectedRecord.stopTime,
    //     maskStartTime: selectedRecord.maskStartTime,
    //     maskEndTime: selectedRecord.maskEndTime,
    //     threshold: selectedRecord.threshold,
    //     bandwidth: selectedRecord.bandwidth,
    //     frequency: selectedRecord.centerFrequency,
    //     operations: selectedRecord.operations,
    //   });
    //   localStorage.setItem("CollectionobjectData", jobInfo);
    //   navigate('/reports');

    // } else {
    //   console.error("No record selected for generating report");
    // }

    const stringifiedStorageData = JSON.stringify(storageData);
    localStorage.setItem("StorageData", stringifiedStorageData);
    navigate('/reports')
  };

  const onDisplayButtonClick = () => {
    const stringifiedStorageData = JSON.stringify(storageData);
    localStorage.setItem("StorageData", stringifiedStorageData);
    navigate('/displays')
  };

  const formatDateTime = (datetime: any) => {
    const dateObj = new Date(datetime);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const formattedTime = `${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(dateObj.getUTCMinutes()).padStart(2, '0')}:${String(dateObj.getUTCSeconds()).padStart(2, '0')}`;

    return { formattedDate, formattedTime };
  };

  const handleExpandIconClick = (recordKey: number) => {
    if (expandedType === 'DescriptionDetails' && expandedRowKeys.includes(recordKey)) {
      setExpandedRowKeys([]);
      setExpandedType(null);
    } else {
      setExpandedRowKeys([recordKey]);
      setExpandedType('DescriptionDetails');
      setSelectedRecord(collectionData.find(record => record.key === recordKey)); // Set the selected record
    }
  };

  const handleTimeSliceClick = (recordKey: number) => {
    if (expandedType === 'TimeSliceDetails' && expandedRowKeys.includes(recordKey)) {
      setExpandedRowKeys([]);
      setExpandedType(null);
      setSelectedTimeSlice(null);
    } else {
      setExpandedRowKeys([recordKey]);
      setExpandedType('TimeSliceDetails');
      setSelectedRecord(collectionData.find(record => record.key === recordKey)); // Set the selected record
    }
  };

  const getUniqueValues = (key: string) => {
    return Array.from(new Set(collectionData.map((item: any) => item[key]))).map((value) => ({
      text: key === "centerFrequency" ? (value / 1000000).toFixed(4) : value,
      value: key === "centerFrequency" ? (value / 1000000).toFixed(4) : value,
    }));
  };

  const handleResetFilters = () => {
    setExpandedRowKeys([]);
    setExpandedType(null);
    setTableKey((prevKey) => prevKey + 1);
  };

  const customColumns: any = [
    {
      title: "",
      render: (_: any, record: any) => (
        <span onClick={() => handleTimeSliceClick(record.key)}>
          <PieChartOutlined style={{ fontSize: "20px" }} />
        </span>
      ),
      width: 160
    },
    {
      title: "SITE NAME",
      dataIndex: "siteName",
      render: (_: any, record: any) => (<span>MEMPHIS</span>),
      width: 160
    },
    {
      title: "NODE NAME",
      dataIndex: "nodeName",
      render: (_: any, record: any) => (<span>{record.nodeName}</span>),
      filters: getUniqueValues("nodeName"),
      onFilter: (value: any, record: any) => record.nodeName === value,
      filterSearch: true,
      width: 160
    },
    {
      title: (
        <Tooltip title="MM/DD/YYYY">
          <span>START DATE</span>
        </Tooltip>
      ),
      dataIndex: "startDate",
      render: (_: any, record: any) => (<span>{record.startDate}</span>),
      filters: getUniqueValues("startDate"),
      onFilter: (value: any, record: any) => record.startDate === value,
      filterSearch: true,
      width: 160
    },

    {
      title: "START TIME (UTC)",
      dataIndex: "startTime ",
      render: (_: any, record: any) => (<span>{record.startTime}</span>),
      filters: getUniqueValues("startTime"),
      onFilter: (value: any, record: any) => record.startTime === value,
      filterSearch: true,
      width: 180
    },

    {
      title: (
        <Tooltip title="MM/DD/YYYY">
          <span>STOP DATE</span>
        </Tooltip>
      ),
      dataIndex: "stopDate",
      render: (_: any, record: any) => (<span>{record.stopDate}</span>),
      filters: getUniqueValues("stopDate"),
      onFilter: (value: any, record: any) => record.stopDate === value,
      filterSearch: true,
      width: 160
    },



    {
      title: "STOP TIME (UTC)",
      dataIndex: "stopTime",
      render: (_: any, record: any) => (<span>{record.stopTime}</span>),
      filters: getUniqueValues("stopTime"),
      onFilter: (value: any, record: any) => record.stopTime === value,
      filterSearch: true,
      width: 160
    },

    {
      title: "CENTER FREQ (MHz)",
      dataIndex: "centerFrequency",
      render: (_: any, record: any) => (<span>{(record.centerFrequency / 1000000).toFixed(4)}</span>),
      filters: getUniqueValues("centerFrequency"),
      onFilter: (value: any, record: any) => (record.centerFrequency / 1000000).toFixed(4) === value,
      filterSearch: true,
      width: 180
    }
  ];

  return (
    <>
      <div className='h-fit'>
        <Navbar page="collections" />
      </div>
      <div className='min-h-[90vh] h-fit flex'>
        <Sidebar />
        <div className='min-h-[90vh] h-fit flex flex-col justify-between items-end p-4'>
          <Table
            className='w-full custom-table'
            title={() => (
              <div className="flex flex-row justify-between items-center">
                <Button
                  className="w-fit"
                  size="middle"
                  onClick={handleResetFilters}
                >
                  Reset filters and sorters
                </Button>
                <Title className="flex-grow text-center m-0" level={3}>
                  COLLECTIONS
                </Title>

                <Button
                  className="w-fit mr-3"
                  size="middle"
                  onClick={onDisplayButtonClick}
                  disabled={selectedTimeSlice === null}

                >
                  Displays
                </Button>

                <Button
                  className="w-fit mr-2"
                  size="middle"
                  onClick={onReportButtonClick}
                  disabled={selectedTimeSlice === null}
                >
                  Reports
                </Button>

                <Button
                  className="w-fit "
                  size="middle"
                  onClick={() => setIsExportModalVisible(true)}
                  disabled={selectedTimeSlice === null}
                >
                  Export
                </Button>
              </div>
            )}
            key={tableKey}
            dataSource={collectionData}
            columns={customColumns}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record: any) => handleExpandIconClick(record.key),
              expandedRowRender: (record) => {
                if (expandedType === 'DescriptionDetails') {
                  return <CollectionsCollapsedListing
                    details={record.descriptionDetails}
                    type="DescriptionDetails"
                    selectedTimeSlice={selectedTimeSlice}
                    setSelectedTimeSlice={setSelectedTimeSlice}
                    storageData={storageData}
                    setStorageData={setStorageData}
                    record={record}
                  />;
                } else if (expandedType === 'TimeSliceDetails') {
                  return <CollectionsCollapsedListing
                    details={record.timeSliceDetails}
                    type="TimeSliceDetails"
                    selectedTimeSlice={selectedTimeSlice}
                    setSelectedTimeSlice={setSelectedTimeSlice}
                    storageData={storageData}
                    setStorageData={setStorageData}
                    record={record}
                  />;
                }
                return null;
              }
            }}
            bordered={true}
            pagination={collectionData.length <= 10 ? false : { pageSize: 10 }}
          />
        </div>
      </div>
      <ExportModal
        isExportModalVisible={isExportModalVisible}
        setIsExportModalVisible={setIsExportModalVisible}
        storageData={storageData}
      />
    </>
  );
};

export default CollectionsListing;
