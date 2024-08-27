import { useState, useEffect } from 'react';
import { DatePicker, TimePicker, Checkbox, Select, Typography, Divider, Radio, Collapse, Button, message } from 'antd';
import { SearchOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCollections } from '../../../Services';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const NewReportExistingParams = ({ setIsModalVisible }: { setIsModalVisible: (visible: boolean) => void }) => {
  const navigate = useNavigate();
  const CollectionobjectData: any = localStorage.getItem("CollectionobjectData");
  const parsedCollectionobjectData = JSON.parse(CollectionobjectData);
  const [selectedSites, setSelectedSites] = useState<string[]>(['Memphis']);
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<string | null>(null);
  const [modalNewData, setModalNewData] = useState<any[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [nodeAliases, setNodeAliases] = useState<any[]>([]); // State to store node aliases from local storage

  const formatDateTime = (datetime: any) => {
    const dateObj = new Date(datetime);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const formattedTime = `${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(dateObj.getUTCMinutes()).padStart(2, '0')}:${String(dateObj.getUTCSeconds()).padStart(2, '0')}`;
    return { formattedDate, formattedTime };
  };

  useEffect(() => {
    // Fetch node aliases from local storage
    const storedNodes = JSON.parse(localStorage.getItem('nodes') || '[]');
    setNodeAliases(storedNodes);
  }, []);

  useEffect(() => {
    getCollections(500, 0)
      .then(data => {
        const fetchedData = data.records.map((record: any, index: number) => {
          // Check if node name matches any alias in local storage
          const matchingAlias = nodeAliases.find((node: any) => node.name === record.node.name);
          const displayNodeName = matchingAlias && matchingAlias.alias.trim() !== '' ? matchingAlias.alias : record.node.name;

          return {
            key: index,
            siteName: record.node.name,
            nodeName: displayNodeName, // Use alias if available and not empty
            startDate: formatDateTime(record.job.collect_start).formattedDate,
            startTime: formatDateTime(record.job.collect_start).formattedTime,
            stopDate: formatDateTime(record.job.collect_end).formattedDate,
            stopTime: formatDateTime(record.job.collect_end).formattedTime,
            centerFrequency: record.job.center_frequency,
            descriptionDetails: {
              collectStart: record.job.collect_start,
              collectStop: record.job.collect_end,
              nodeRecId: record.job.recid,
              centerFrequency: record.job.center_frequency,
              sampleRate: record.job.sample_rate,
              sdrUseAgc: record.job.sdr_use_agc,
              sdrGain: record.job.sdr_gain,
              psd: record.job.pack_name === "PSD" ? "Y" : "N",
              chop: record.job.chop_enabled,
              lmrDecode: "N",  // Assumed value
              lteDecode: "N",  // Assumed value
              locationData: "Y",  // Assumed value
            },
            timeSliceDetails: createTimeSlices(record.job.collect_start, record.job.collect_end)
          };
        });

        setModalNewData(fetchedData);
      })
      .catch(error => {
        console.error("Error fetching data from API:", error);
      });
  }, [nodeAliases]);

  const handleRadioChange = (e: any) => {
    const selectedTime = e.target.value;
    setSelectedTimeSlice(selectedTime);
  };

  const createTimeSlices = (start: string, end: string) => {
    const timeSlices = [];
    for (let time = new Date(start); time <= new Date(end); time.setHours(time.getHours() + 1)) {
      timeSlices.push(new Date(time));
    }
    return timeSlices;
  };

  const siteOptions = ['Memphis'];
  const additionalSites = ['Cetacea', 'Hanger 12', 'Republican'];

  const handleCreateReport = () => {
    if (selectedReportType) {
      const firstRecord = modalNewData[0];
      const matchingAlias = nodeAliases.find((node: any) => node.name === firstRecord.nodeName);
      const nodeNameToSend = matchingAlias && matchingAlias.alias.trim() !== '' ? matchingAlias.alias : firstRecord.nodeName;

      navigate('/reports', {
        state: {
          reportType: selectedReportType,
          nodeName: nodeNameToSend,  // Send alias if available, otherwise node name from API
          startTime: firstRecord.startTime,
          startDate: firstRecord.startDate,
          endTime: firstRecord.stopTime,
          endDate: firstRecord.stopDate,
          recId: firstRecord.descriptionDetails.nodeRecId
        }
      });
      setIsModalVisible(false);
    } else {
      message.warning('Please select a report type.');
    }
  };

  const handleCancelReport = () => {
    setIsModalVisible(false);
  };

  const customItems = modalNewData.map((item, index) => {
    const timeSlices = createTimeSlices(item.descriptionDetails.collectStart, item.descriptionDetails.collectStop);
    return {
      key: index.toString(),
      header: (
        <span>
          <PieChartOutlined style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {item.nodeName}
        </span>
      ),
      children: (
        <Radio.Group value={selectedTimeSlice} onChange={handleRadioChange}>
          {timeSlices.map((time, idx) => (
            <p key={idx}>
              <Radio value={time.toISOString()}>
                {`Time Slice ${idx + 1}: ${time.toISOString()}`}
              </Radio>
            </p>
          ))}
        </Radio.Group>
      )
    };
  });

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 10 }}>
      <Title level={4} style={{ color: '#fff' }}>Create New Report with Existing Parameters</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <Title level={5} style={{ color: '#fff' }}>Date/Time</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Start Date</Title>
              <Button type="primary" disabled>
                {moment(parsedCollectionobjectData.startDate).format('YYYY-MM-DD')}
              </Button>
            </div>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Stop Date</Title>
              <Button type="primary" disabled>
                {moment(parsedCollectionobjectData.endDate).format('YYYY-MM-DD')}
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Start Time</Title>
              <Button type="primary" disabled>
                {moment(parsedCollectionobjectData.startTime, 'HH:mm:ss').format('HH:mm:ss')}
              </Button>
            </div>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Stop Time</Title>
              <Button type="primary" disabled>
                {moment(parsedCollectionobjectData.endTime, 'HH:mm:ss').format('HH:mm:ss')}
              </Button>
            </div>
          </div>
          <Divider style={{ backgroundColor: '#444' }} />
          <div>
            <Title level={5} style={{ color: '#fff' }}>Select Sites</Title>
            <Checkbox.Group
              options={siteOptions}
              value={['Memphis']}
              disabled
            />
            {selectedSites.includes('Memphis') && (
              <Checkbox.Group
                options={additionalSites}
                value={selectedSites}
                style={{ marginTop: 16 }}
                disabled
              />
            )}
          </div>
        </div>
        <div style={{ width: '45%' }}>
          <Title level={5} style={{ color: '#fff' }}>REC ID</Title>
          <div style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
            <Collapse
              expandIcon={() => null}
              expandIconPosition="right"
            >
              {customItems.map(item => (
                <Collapse.Panel key={item.key} header={item.header}>
                  {item.children}
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
          <Divider style={{ backgroundColor: '#444' }} />
          <div>
            <Title level={5} style={{ color: '#fff' }}>Report Type</Title>
            <Select
              style={{ width: '100%' }}
              placeholder="Selection"
              onChange={(value) => setSelectedReportType(value)}
            >
              <Option value="channelPeakPower">Channel Peak Power</Option>
              <Option value="channelAveragePower">Channel Average Power</Option>
              <Option value="occupancy">Occupancy</Option>
              {/* <Option value="outlier">Utilization</Option> */}
              {/* <Option value="tbd">TBD</Option> */}
            </Select>
          </div>
          <div style={{ flexDirection: "row", marginTop: "70px" }}>
            <Button type="default" onClick={handleCancelReport}>
              Cancel
            </Button>
            <Button style={{ marginLeft: '20px' }} type="primary" onClick={handleCreateReport}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewReportExistingParams;
