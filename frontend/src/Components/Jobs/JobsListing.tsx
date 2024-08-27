import { useState, useEffect } from 'react';
import { Button, Table, Typography } from 'antd';
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { JobListDataType, SpectralDataType } from '../../Types/ProjectTypes';
import JobsCollapsedListing from './JobsCollapsedListing';
import Navbar from '../Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import ExportModal from '../Collections/ExportModal';
import Sidebar from '../Sidebar/Sidebar';


const JobsListing = () => {

  const { Title } = Typography;
  const url = process.env.REACT_APP_API_PATH;
  const navigate = useNavigate();

  const initialSpectralGraphData = {
    count: null,
    jobRecId: null,
    startTime: null,
    endTime: null,
    maskStartTime: null,
    maskEndTime: null,
    threshold: null,
    bandwidth: null,
    frequency: null,
    operations: null,
  };
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

  const [jobListingData, setJobListingData] = useState<any>([]);
  const [selectedTimeSlice, setSelectedTimeSlice] = useState<any>(null);
  const [iccTableCount, setIccTableCount] = useState<number>(0);
  const [spectralGraphData, setSpectralGraphData] = useState<SpectralDataType>(initialSpectralGraphData);

  const fetchInfo = async () => {
    try {
      const response = await axios.get(`${url}/icc/table`, {
        params: {
          limit: 10,
          start: 0
        }
      });
      const jsonResponse = response ? response.data : {};
      setJobListingData(jsonResponse.records || []);
      setIccTableCount(jsonResponse.count);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setJobListingData([]);
      setIccTableCount(0);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [url]);

  const onRowSelectionChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
    const newSpectralgraphData = { ...spectralGraphData };
    const arr: any = [];
    const newData = [...dataSource];
    selectedRowKeys.forEach((key: any) => {
      arr.push(newData.find((item) => item.key === key));
    });
    newSpectralgraphData.count = arr[0].count;
    newSpectralgraphData.jobRecId = arr[0].jobRecId;
    newSpectralgraphData.startTime = new Date(arr[0].descriptionDetails.collectStart);
    newSpectralgraphData.maskStartTime = new Date(arr[0].descriptionDetails.collectStart);
    newSpectralgraphData.threshold = 5;
    newSpectralgraphData.bandwidth = arr[0].usableBw;
    newSpectralgraphData.frequency = arr[0].centerFrequency;
    newSpectralgraphData.operations = ['op1', 'op2', 'op3'];
    setSpectralGraphData(newSpectralgraphData)
  };

  const hardCodedSpectralGraphData = {
    count: 12,
    jobRecId: 295,
    startTime: null,
    endTime: null,
    maskStartTime: null,
    maskEndTime: null,
    threshold: null,
    bandwidth: 40000000,
    frequency: 630000000,
    operations: null,
  }

  const onLaunchJobClick = () => {
    const stringifiedSpectralGraphData = JSON.stringify(hardCodedSpectralGraphData);
    localStorage.setItem("SpectralGraphData", stringifiedSpectralGraphData);
    navigate('/dashboard')
  }

  const filteredData = jobListingData.filter((item: any) => {
    const splitted = item.job.status.split('~');
    const lastIndex = splitted.length - 1;

    return splitted[lastIndex].toLowerCase() !== "failed";
  }

  )

  const dataSource: JobListDataType[] = filteredData?.map((item: any, index: number) => {
    const timeSlices = [];
    const collectStart = new Date(item.job.collect_start);
    const collectEnd = new Date(item.job.collect_end);

    const timeSettings = Cookies.get("TimeSettings");

    if (timeSettings === undefined) {
      for (let time = new Date(collectStart); time <= collectEnd; time.setMinutes(time.getMinutes() + 30)) {
        timeSlices.push(new Date(time));
      }
    }
    else {
      const timeSettingsObject = JSON.parse(timeSettings);
      const intervalValue = timeSettingsObject.value;
      if (timeSettingsObject.unit === "minutes") {
        for (let time = new Date(collectStart); time <= collectEnd; time.setMinutes(time.getMinutes() + intervalValue)) {
          timeSlices.push(new Date(time));
        }
      }
      else if (timeSettingsObject.unit === "hour") {
        for (let time = new Date(collectStart); time <= collectEnd; time.setHours(time.getHours() + intervalValue)) {
          timeSlices.push(new Date(time));
        }
      }
    }

    return {
      key: index,
      count: iccTableCount,
      recId: item.node.recid,
      jobRecId: item.job.recid,
      jobName: item.job.name,
      centerFrequency: item.job.center_frequency,
      fftSize: item.job.fft_size,
      fftAverage: item.job.fft_avg_count,
      nodeName: item.node.name,
      lla: item.node.lla,
      sdrName: item.sdr.name,
      usableBw: item.job.usable_bw,
      highestFrequency: 0,
      lowestFrequency: 0,
      descriptionDetails: {
        collectStart: item.job.collect_start,
        collectStop: item.job.collect_end,
        nodeRecId: item.node.recid,
        centerFrequency: item.job.center_frequency,
        sampleRate: item.job.sample_rate,
        sdrUseAgc: item.job.sdr_use_agc,
        sdrGain: item.job.sdr_gain,
      },
      timeSliceDetails: timeSlices
    };
  });



  // RECID Filter
  const RecIdFilter = Array.from(new Set(dataSource.map((value) => value.recId))).map((value) => ({
    text: value,
    value: value,
  }));

  // JobName Filter
  const JobNameFilter = Array.from(new Set(dataSource.map((value) => value.jobName))).map((value) => ({
    text: value,
    value: value,
  }));

  // CenterFrequency Filter
  const CenterFrequencyFilter = Array.from(new Set(dataSource.map((value) => value.centerFrequency))).map((value) => ({
    text: value,
    value: value,
  }));

  // FftSize Filter
  const FftSizeFilter = Array.from(new Set(dataSource.map((value) => value.fftSize))).map((value) => ({
    text: value,
    value: value,
  }));

  // FftAverage Filter
  const FftAverageFilter = Array.from(new Set(dataSource.map((value) => value.fftAverage))).map((value) => ({
    text: value,
    value: value,
  }));

  // NodeName Filter
  const NodeNameFilter = Array.from(new Set(dataSource.map((value) => value.nodeName))).map((value) => ({
    text: value,
    value: value,
  }));

  // Lla Filter
  const LlaFilter = Array.from(new Set(dataSource.map((value) => value.lla))).map((value) => ({
    text: value,
    value: value,
  }));

  // SdrName Filter
  const SdrNameFilter = Array.from(new Set(dataSource.map((value) => value.sdrName))).map((value) => ({
    text: value,
    value: value,
  }));



  const customColumn = [
    {
      title: "",
      render: (_: any, record: any) => (
        <span onClick={() => handleTimeSliceClick(record.key)}>
          <ClockCircleOutlined />
        </span>
      ),
      width: 160,
    },
    {
      title: "RECID",
      dataIndex: "RecId",
      render: (_: any, record: any) => (<span>{record.recId}</span>),
      sorter: (a: any, b: any) => a.recId - b.recId,
      filters: RecIdFilter,
      onFilter: (value: any, record: any) => record.recId === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "JOB NAME",
      dataIndex: "JobName",
      render: (_: any, record: any) => (<span>{record.jobName}</span>),
      sorter: (a: any, b: any) => a.jobName.localeCompare(b.jobName),
      filters: JobNameFilter,
      onFilter: (value: any, record: any) => record.jobName === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "CENTER FREQUENCY",
      dataIndex: "CenterFrequency",
      render: (_: any, record: any) => (<span>{record.centerFrequency}</span>),
      sorter: (a: any, b: any) => a.centerFrequency - b.centerFrequency,
      filters: CenterFrequencyFilter,
      onFilter: (value: any, record: any) => record.centerFrequency === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "FFT SIZE",
      dataIndex: "FftSize",
      render: (_: any, record: any) => (<span>{record.fftSize}</span>),
      sorter: (a: any, b: any) => a.fftSize - b.fftSize,
      filters: FftSizeFilter,
      onFilter: (value: any, record: any) => record.fftSize === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "FFT AVERAGE",
      dataIndex: "FftAverage",
      render: (_: any, record: any) => (<span>{record.fftAverage}</span>),
      sorter: (a: any, b: any) => a.fftAverage - b.fftAverage,
      filters: FftAverageFilter,
      onFilter: (value: any, record: any) => record.fftAverage === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "NODE NAME",
      dataIndex: "NodeName",
      render: (_: any, record: any) => (<span>{record.nodeName}</span>),
      sorter: (a: any, b: any) => a.nodeName.localeCompare(b.nodeName),
      filters: NodeNameFilter,
      onFilter: (value: any, record: any) => record.nodeName === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "LLA",
      dataIndex: "Lla",
      render: (_: any, record: any) => (<span>{record.lla}</span>),
      sorter: (a: any, b: any) => a.lla.localeCompare(b.lla),
      filters: LlaFilter,
      onFilter: (value: any, record: any) => record.lla === value,
      filterSearch: true,
      width: 160,
    },
    {
      title: "SDR NAME",
      dataIndex: "SdrName",
      render: (_: any, record: any) => (<span>{record.sdrName}</span>),
      sorter: (a: any, b: any) => a.sdrName.localeCompare(b.sdrName),
      filters: SdrNameFilter,
      onFilter: (value: any, record: any) => record.sdrName === value,
      filterSearch: true,
      width: 160,
    }
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [tableKey, setTableKey] = useState(0);

  const handleResetFilters = () => {
    setExpandedRowKeys([]);
    setExpandedType(null);
    setSelectedRowKeys([]);
    setTableKey((prevKey) => prevKey + 1);
  };

  const handleExpandIconClick = (recordKey: number) => {
    if (expandedType === 'DescriptionDetails' && expandedRowKeys.includes(recordKey)) {
      setExpandedRowKeys([]);
      setExpandedType(null);
    } else {
      setExpandedRowKeys([recordKey]);
      setExpandedType('DescriptionDetails');
    }
  };

  const handleTimeSliceClick = (recordKey: number) => {

    if (expandedType === 'TimeSliceDetails' && expandedRowKeys.includes(recordKey)) {
      setExpandedRowKeys([]);
      setExpandedType(null);
    } else {
      setExpandedRowKeys([recordKey]);
      setExpandedType('TimeSliceDetails');
    }
  };



  return (
    <>

      <div className='h-[10vh]'>
        <Navbar page={'job-list'} />
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
                <Title className="flex-grow text-center m-0" level={3} >
                  JOBS LISTING
                </Title>
                <Button
                  className="w-fit mr-2"
                  size="middle"
                  onClick={() => setIsExportModalVisible(true)}
                >
                  Export
                </Button>

                <Button
                  className="w-fit"
                  size="middle"
                >
                  Report
                </Button>
              </div>


            )}
            key={tableKey}
            rowSelection={{
              hideSelectAll: true,

              type: "radio",
              onChange: onRowSelectionChange

            }}
            dataSource={dataSource}
            columns={customColumn}
            bordered={true}
            pagination={dataSource.length <= 10 ? false : { pageSize: 10 }}
            expandable={{
              expandedRowKeys,
              onExpand: (expanded, record) => handleExpandIconClick(record.key),
              expandedRowRender: (record) => {
                if (expandedType === 'DescriptionDetails') {
                  return <JobsCollapsedListing
                    details={record.descriptionDetails}
                    type="DescriptionDetails"
                    selectedTimeSlice={selectedTimeSlice}
                    setSelectedTimeSlice={setSelectedTimeSlice}
                    spectralGraphData={spectralGraphData}
                    setSpectralGraphData={setSpectralGraphData}
                  />;
                } else if (expandedType === 'TimeSliceDetails') {
                  return <JobsCollapsedListing
                    details={record.timeSliceDetails}
                    type="TimeSliceDetails"
                    selectedTimeSlice={selectedTimeSlice}
                    setSelectedTimeSlice={setSelectedTimeSlice}
                    spectralGraphData={spectralGraphData}
                    setSpectralGraphData={setSpectralGraphData}
                  />;
                }
                return null;
              }
            }}


          />

          <div>
            <Button
              type='default'
              onClick={onLaunchJobClick}
            // disabled={selectedTimeSlice === null}
            >Launch Job</Button>
          </div>
        </div>

      </div>

      <ExportModal
        isExportModalVisible={isExportModalVisible}
        setIsExportModalVisible={setIsExportModalVisible}
      />


    </>

  );
};

export default JobsListing;
