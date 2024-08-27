import { Table } from 'antd';
import moment from 'moment';

const OccupancyDetail = ({ chopData }: any) => {



  const distinctCV = Array.from(new Set(chopData.map((key: any) => key.cv_center_freq)))
  const calculateOccupancy = (cvCenterFreq: number) => {
    const total = chopData.filter((record: any) => record.cv_center_freq === cvCenterFreq).length;
    const occupied = chopData.filter((record: any) => record.cv_center_freq === cvCenterFreq && record.cv_occupied === 1).length;
    return (occupied / total) * 100;
  };
  const calculateTotalDuration = (records: any) => {
    const timestamps = records.map((record: any) => moment(record.time_collected_timestamp));
    const minTimestamp = moment.min(timestamps);
    const maxTimestamp = moment.max(timestamps);
    const result = maxTimestamp.diff(minTimestamp, 'seconds');
    return result;
  };
  const calculateMaxPeakPower = (records: any) => {
    return records.reduce((max: any, record: any) => Math.max(max, record.cv_peak_power), -Infinity);
  };

  const calculateAvgPower = (records: any) => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum: any, record: any) => sum + record.cv_power_avg, 0);
    return total / records.length;
  };
  const data = distinctCV.map((cvCenterFreq: any) => {
    const records = chopData.filter((record: any) => record.cv_center_freq === cvCenterFreq);

    const totalDuration = calculateTotalDuration(records);
    const maxPeakPower = calculateMaxPeakPower(records);
    const avgPower = calculateAvgPower(records);

    return {
      cv_center_freq: cvCenterFreq,
      channel_peak_power: maxPeakPower,
      channel_avg_power: avgPower,
      bandwidth: records[0]?.cv_bandwidth / 1000, // Convert to KHz
      total_duration: totalDuration, // assuming cv_frames_occupied represents time in some unit
      occupancy: calculateOccupancy(cvCenterFreq),
    };
  });
  const dataColumns = [
    {
      title: "Channel Center (MHz)",
      render: (record: any) => <span>{(record.cv_center_freq / 1000000).toFixed(2)}</span>,
      width: 160
    },
    {
      title: "Bandwidth (KHz)",
      render: (record: any) => <span>{record.bandwidth}</span>,
      width: 160
    },
    {
      title: "Channel Peak Power",
      render: (record: any) => <span>{(record.channel_peak_power).toFixed(2)}</span>,
      width: 160
    },
    {
      title: "Channel Average Power",
      render: (record: any) => <span>{(record.channel_avg_power).toFixed(2)}</span>,
      width: 160
    },
    {
      title: "% Occupancy",
      render: (record: any) => <span>{record.occupancy.toFixed(2)}</span>,
      width: 160
    },
  ]

  return (
    <Table
      className='w-full custom-table'
      bordered={true}
      pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      dataSource={data}
      columns={dataColumns}
      scroll={{ x: "auto", y: "50vh" }}
    />
  );
};

export default OccupancyDetail;