import { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';


const Occupancy = ({ chopData }: any) => {
  const [minTimestamp, setMinTimestamp] = useState<string | null>(null);
  const [maxTimestamp, setMaxTimestamp] = useState<string | null>(null);

  const fetchData = async () => {

    try {
      const timestamps = chopData.map((record: any) => new Date(record.time_collected_timestamp));
      const minTime = new Date(Math.min(...timestamps));
      const maxTime = new Date(Math.max(...timestamps));
      const minTimeFormatted = minTime.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const maxTimeFormatted = maxTime.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMinTimestamp(minTimeFormatted);
      setMaxTimestamp(maxTimeFormatted);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  const distinctCV = Array.from(new Set(chopData.map((key: any) => key.cv_center_freq)))
  const yAxisData = distinctCV.map(cvCenterFreq => {
    const total = chopData.filter((record: any) => record.cv_center_freq === cvCenterFreq).length;
    const occupied = chopData.filter((record: any) => record.cv_center_freq === cvCenterFreq && record.cv_occupied === 1).length;
    return ((occupied / total) * 100).toFixed(2);
  });

  const options = {
    title: {
      text: `Occupancy - ${minTimestamp} - ${maxTimestamp}`,
      left: 'center',
      textStyle: {
        color: 'white',
        fontSize: 12,  // Adjusted font size for better visibility
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',   // Adjust grid settings to ensure chart fits well within the component
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: distinctCV.map((value: any) => (value / 1000000).toFixed(2)),
      axisLabel: {
        color: 'white',
        rotate: 45,  // Rotate labels for better readability
        interval: 0, // Show all labels without skipping
        textStyle: {
          fontSize: 12
        }
      },
      axisLine: {
        lineStyle: {
          color: 'white'  // Ensures axis line is visible
        }
      }
    },
    yAxis: {
      type: 'log',
      logBase: 2,
      min: 1,
      max: 100,
      // interval: 10,
      axisLine: {
        lineStyle: {
          color: 'lightgray'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted'
        }
      },
      axisLabel: {
        color: 'white', // Set Y-axis label color to white
      }
    },
    series: [
      {
        data: yAxisData,
        type: 'bar',
        itemStyle: {
          color: '#FF6347' // Tomato light red
        }
      }
    ]
  };

  return <div className='relative'>
    <ReactEcharts option={options} style={{ height: '40vh', width: '100%' }} />
  </div>;
};

export default Occupancy;