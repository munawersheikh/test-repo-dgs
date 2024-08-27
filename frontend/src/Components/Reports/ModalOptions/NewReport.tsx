import { useState, useEffect } from 'react';
import { DatePicker, TimePicker, Checkbox, Select, Typography, Divider, Radio, Collapse, Button, message } from 'antd';
import { SearchOutlined, PieChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCollections } from '../../../Services'; // Import the service function
import Cookies from 'js-cookie';
import { Utilities } from '../../../Utilities';

const { Title } = Typography;
const { Option } = Select;

const NewReport = ({ setIsModalVisible }: { setIsModalVisible: (visible: boolean) => void }) => {
  const utils = new Utilities();
  const timeSettings = Cookies.get("TimeSettings");
  const navigate = useNavigate();
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [timeSlices, setTimeSlices] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<any[]>([]);
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<string | null>(null);
  const [modalNewData, setModalNewData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [stopDate, setStopDate] = useState<any>(null);
  const [startTime, setStartTime] = useState<any>(null);
  const [stopTime, setStopTime] = useState<any>(null);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);
  const [nodeAliases, setNodeAliases] = useState<any[]>([]); // State to store node aliases from local storage
  const [collectStart, setCollectStart] = useState<any>(null);
  const [collectEnd, setCollectEnd] = useState<any>(null);

  useEffect(() => {
    // Fetch node aliases from local storage
    const storedNodes = JSON.parse(localStorage.getItem('nodes') || '[]');
    setNodeAliases(storedNodes);
  }, []);

  const formatDateTime = (datetime: any) => {
    const dateObj = new Date(datetime);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const formattedTime = `${String(dateObj.getUTCHours()).padStart(2, '0')}:${String(dateObj.getUTCMinutes()).padStart(2, '0')}:${String(dateObj.getUTCSeconds()).padStart(2, '0')}`;
    return { formattedDate, formattedTime };
  };

  const handleRadioChange = (e: any) => {
    const selectedTime = e.target.value;
    const endTime = utils.calculateEndTime(selectedTime, timeSettings);
    setCollectStart(selectedTime)
    setCollectEnd(endTime)
    setSelectedTimeSlice(selectedTime);
  };

  const handleIconClick = (key: string) => {
    setActiveKey(prevActiveKey =>
      prevActiveKey.includes(key) ? prevActiveKey.filter(k => k !== key) : [...prevActiveKey, key]
    );
  };

  // const createTimeSlices = (start: string, end: string) => {
  //   const timeSlices = [];
  //   for (let time = new Date(start); time <= new Date(end); time.setHours(time.getHours() + 1)) {
  //     timeSlices.push(new Date(time));
  //   }
  //   return timeSlices;
  // };

  const handleSearch = async () => {
    if (startDate && stopDate && startTime && stopTime) {
      // Combine date and time into a full DateTime
      const startDateTime = new Date(`${startDate.format('YYYY-MM-DD')}T${startTime.format('HH:mm:ss')}`);
      const stopDateTime = new Date(`${stopDate.format('YYYY-MM-DD')}T${stopTime.format('HH:mm:ss')}`);

      try {
        const data = await getCollections(500, 0);

        if (data) {
          const fetchedData = data.records.map((record: any, index: number) => {
            // Check if node name matches any alias in local storage
            const matchingAlias = nodeAliases.find((node: any) => node.name === record.node.name);
            const displayNodeName = matchingAlias && matchingAlias.alias.trim() !== '' ? matchingAlias.alias : record.node.name;

            return {
              key: index,
              siteName: record.node.name,
              nodeName: displayNodeName, // Use alias name if available and not empty, otherwise use node name from API
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
              timeSliceDetails: utils.createTimeSlices(record.job.collect_start, record.job.collect_end)
            };
          });

          // Filter records by complete DateTime range
          const matchingRecords = fetchedData.filter((record: { descriptionDetails: { collectStart: string | number | Date; collectStop: string | number | Date; }; }) =>
            new Date(record.descriptionDetails.collectStart) <= stopDateTime &&
            new Date(record.descriptionDetails.collectStop) >= startDateTime
          );

          if (matchingRecords.length > 0) {
            setModalNewData(matchingRecords);
          } else {
            message.warning('No data available in this date range.');
            setModalNewData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    } else {
      message.warning('Please select start date, stop date, start time, and stop time.');
    }
  };

  const handleSiteChange = (checkedValues: string[]) => {
    setSelectedSites(checkedValues);
    const additionalSitesSelected = checkedValues.some(site => site === 'Cetacea' || site === 'Hanger 12' || site === 'Republican');
    setIsSearchEnabled(additionalSitesSelected);
  };

  const handleCreateReport = () => {
    if (selectedReportType) {
      const firstRecord = modalNewData[0];
      const matchingAlias = nodeAliases.find((node: any) => node.name === firstRecord.nodeName);
      const nodeNameToSend = matchingAlias && matchingAlias.alias.trim() !== '' ? matchingAlias.alias : firstRecord.nodeName;

      const details = {
        reportType: selectedReportType,
        nodeName: nodeNameToSend,  // Use alias or node name
        startTime: collectStart,
        // startDate: startDate?.format('YYYY-MM-DD'),
        endTime: collectEnd,
        // endDate: stopDate?.format('YYYY-MM-DD'),
        recId: firstRecord.descriptionDetails.nodeRecId
      };

      navigate('/reports', { state: details });
      setIsModalVisible(false);
    } else {
      message.warning('Please select a report type.');
    }
  };

  const handleCancelReport = () => {
    setIsModalVisible(false);
  };

  const customItems = modalNewData.map((item, index) => {
    const key = (index + 1).toString();
    const isActive = activeKey.includes(key);
    return {
      key: key,
      header: (
        <span>
          <PieChartOutlined
            onClick={() => handleIconClick(key)}
            style={{
              marginRight: '8px',
              verticalAlign: 'middle',
              cursor: 'pointer',
              backgroundColor: isActive ? 'blue' : 'transparent',
              padding: '5px',
              borderRadius: '5px',
              fontSize: "15px"
            }}
          />
          {item.nodeName}
        </span>
      ),
      children: (
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          <Radio.Group value={selectedTimeSlice} onChange={handleRadioChange}>
            {item.timeSliceDetails.map((time: any, idx: number) => (
              <p key={idx}>
                <Radio value={time.toISOString()}>
                  {` Time Slice ${idx + 1}: ${time.toISOString()}`}
                </Radio>
              </p>
            ))}
          </Radio.Group>
        </div>
      )
    };
  });

  const siteOptions = ['Memphis'];
  const additionalSites = ['Cetacea', 'Hanger 12', 'Republican'];

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 10 }}>
      <Title level={4} style={{ color: '#fff' }}>Create New Report</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <Title level={5} style={{ color: '#fff' }}>Date/Time</Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Start Date</Title>
              <DatePicker style={{ width: '110%' }} onChange={date => setStartDate(date)} />
            </div>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Stop Date</Title>
              <DatePicker style={{ width: '110%', marginLeft: '10px' }} onChange={date => setStopDate(date)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Start Time</Title>
              <TimePicker style={{ width: '100%' }} onChange={time => setStartTime(time)} />
            </div>
            <div>
              <Title level={5} style={{ color: '#fff' }}>Stop Time</Title>
              <TimePicker style={{ width: '100%' }} onChange={time => setStopTime(time)} />
            </div>
          </div>
          <Divider style={{ backgroundColor: '#444' }} />
          <div>
            <Title level={5} style={{ color: '#fff' }}>Select Sites</Title>
            <Checkbox.Group options={siteOptions} onChange={handleSiteChange} />
            {selectedSites.includes('Memphis') && (
              <Checkbox.Group
                options={additionalSites}
                onChange={handleSiteChange}
                value={selectedSites}
                style={{ marginTop: 16 }}
              />
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              disabled={
                startDate === null ||
                stopDate === null ||
                startTime === null ||
                stopTime === null ||
                !isSearchEnabled
              }>
              Search for REC ID
            </Button>
          </div>
        </div>
        <div style={{ width: '45%' }}>
          <Title level={5} style={{ color: '#fff' }}>REC ID</Title>
          <div style={{ width: '115%', maxHeight: '300px', overflowY: 'auto' }}>
            <Collapse
              activeKey={activeKey}
              expandIcon={() => null} // Hides the default icon
              expandIconPosition="right"
            >
              {customItems.map(item => (
                <Collapse.Panel key={item.key} header={item.header}>
                  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                    {item.children}
                  </div>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '150px' }}>
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

export default NewReport;
