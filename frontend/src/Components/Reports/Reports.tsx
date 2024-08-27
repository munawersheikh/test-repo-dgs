import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Occupancy from '../Graphs/Occupancy';
import OccupancyDetail from '../Graphs/OccupanyDetail';
import { Select, Tabs, Spin } from 'antd';
import ChannelPeakPower from '../Graphs/ChannelPeakPower';
import Navbar from '../Navbar';
import ChannelAveragePower from '../Graphs/ChannelAveragePower';
import { getChopData } from '../../Services';
import ReportsModal from './ReportsModal';

const { TabPane } = Tabs;

const Reports = () => {
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [chopData, setChopData] = useState<any[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const storageData: any = localStorage.getItem("StorageData");
  const parsedStorageData = JSON.parse(storageData);
  const addReportOptions = ["New", "New with existing params"];

  const initialFetchedChopData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getChopData(
        parsedStorageData.jobRecId, parsedStorageData.startTime, parsedStorageData.endTime,
      );


      setChopData(fetchedData ?? []);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialFetchedChopData();
  }, []);



  useEffect(() => {
    if (location.state) {
      const { reportType, ...details } = location.state;
      setReportDetails(details);
      handleReportChange(reportType, details);
    }
  }, [location.state]);



  const onReportChangeChopData = async (details: any) => {
    console.log("option selected: ", selectedReportOption)
    console.log("reportDetails: ", reportDetails)
    setIsLoading(true);
    try {
      const fetchedData = await getChopData(
        parsedStorageData.jobRecId,
        selectedReportOption === "New" ? reportDetails.startTime : parsedStorageData.startTime,
        selectedReportOption === "New" ? reportDetails.endTime : parsedStorageData.endTime
      );

      setChopData(fetchedData ?? []);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportOption = (value: string) => {
    if (value !== undefined) {
      setSelectedReportOption(value);
      setIsModalVisible(true);
    }
  };


  const handleReportChange = (value: string, details?: any) => {
    if (!value) {
      return;
    }

    setIsLoading(true); // Set loading true when report changes
    const report = reports.find((r) => r.title.toLowerCase().replace(/\s/g, '') === value.toLowerCase().replace(/\s/g, ''));
    if (report && !tabs.find((tab) => tab.key === report.key)) {
      setTabs([...tabs, { ...report, details: details || reportDetails }]);
      setActiveKey(report.key);
    } else if (report) {
      setActiveKey(report.key);
    }
    setSelectedReport(value);

    if (details) {
      onReportChangeChopData(details);
    } else if (reportDetails) {
      onReportChangeChopData(reportDetails);
    }
  };

  const removeTab = (targetKey: string) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newTabs = tabs.filter((tab) => tab.key !== targetKey);
    if (newTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabs[lastIndex].key;
      } else {
        newActiveKey = newTabs[0].key;
      }
    } else {
      newActiveKey = null;
    }
    setTabs(newTabs);
    setActiveKey(newActiveKey);
  };

  const reports = [
    {
      key: '1',
      title: 'Occupancy',
      content: (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" /> {/* Loading spinner */}
            </div>
          ) : chopData.length > 0 ? (
            <>
              <Occupancy chopData={chopData} details={reportDetails} />
              <OccupancyDetail chopData={chopData} details={reportDetails} />
            </>
          ) : (
            <div>No Data Available</div>
          )}
        </>
      ),
    },
    {
      key: '2',
      title: 'Channel Peak Power',
      content: (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" /> {/* Loading spinner */}
            </div>
          ) : chopData.length > 0 ? (
            <ChannelPeakPower chopData={chopData} details={reportDetails} />
          ) : (
            <div>No Data Available</div>
          )}
        </>
      ),
    },
    {
      key: '3',
      title: 'Channel Average Power',
      content: (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" /> {/* Loading spinner */}
            </div>
          ) : chopData.length > 0 ? (
            <ChannelAveragePower chopData={chopData} details={reportDetails} />
          ) : (
            <div>No Data Available</div>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className='h-[10vh]'>
        <Navbar page="reports" />
      </div>

      <div className="min-h-[90vh] h-fit  bg-black flex flex-col p-5 space-y-5 text-white">
        <Select
          allowClear={true}
          style={{ width: '100%' }}
          placeholder="Add Report"
          onChange={handleReportOption}
          options={addReportOptions.map((report: string) => ({
            label: report,
            value: report,
          }))}
        />
        {reportDetails && (
          <div className="bg-gray-800 text-white p-3 rounded-lg">
            <div className="flex flex-row">
              <p style={{ fontSize: "14px" }}><strong>Node Name:</strong> {reportDetails.nodeName}</p>
              <p style={{ fontSize: "14px", marginLeft: "20px" }}><strong>REC ID:</strong> {parsedStorageData.jobRecId}</p>
            </div>
            <div className="flex flex-row">
              <p style={{ fontSize: "14px" }}><strong>Start Time:</strong> {selectedReportOption === "New" ? reportDetails.startTime : parsedStorageData.startTime}</p>
              <p style={{ fontSize: "14px", marginLeft: "20px" }}><strong>End Time:</strong> {selectedReportOption === "New" ? reportDetails.endTime : parsedStorageData.endTime}</p>
            </div>
            {/* <div className="flex flex-row">
              <p style={{ fontSize: "14px" }}><strong>Start Date:</strong> {reportDetails.startDate}</p>
              <p style={{ fontSize: "14px", marginLeft: "20px" }}><strong>End Date:</strong> {reportDetails.endDate}</p>
            </div> */}
          </div>
        )}
        <div className="flex-grow">
          <Tabs
            type="editable-card"
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key);
              const activeTab = tabs.find(tab => tab.key === key);
              if (activeTab) {
                setReportDetails(activeTab.details);
              }
            }}
            onEdit={(targetKey, action) => {
              if (action === 'remove') {
                removeTab(targetKey as string);
              }
            }}
            hideAdd
          >
            {tabs.map((tab) => (
              <TabPane tab={tab.title} key={tab.key}>
                {tab.content}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <ReportsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedReportOption={selectedReportOption}
      />
    </>
  );
};

export default Reports;
