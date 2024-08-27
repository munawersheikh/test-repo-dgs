import ReactEcharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { Switch } from 'antd';


const SpectralDisplay = ({ power, frequencies, times, index, minValue, maxValue }: any) => {


  const [zoomRange, setZoomRange] = useState({ start: 0, end: 100 });
  const [maxHoldData, setMaxHoldData] = useState<number[]>([]); // Specify the type here
  const [maxHoldEnabled, setMaxHoldEnabled] = useState(false);



  const roundedFrequencies = frequencies.map((value: number) => Math.round(value));
  const formattedFrequencies = frequencies.map((value: number) => value.toFixed(4));

  // Desired number of ticks on the x-axis
  const ticks = 10;

  // Calculate the interval dynamically
  const interval = Math.floor(roundedFrequencies.length / (ticks - 1)) - 1;


  useEffect(() => {
    if (maxHoldEnabled && power.length) {
      const newMaxHoldData = maxHoldData.length ? maxHoldData.slice() : new Array(power.length).fill(-Infinity);
      power.forEach((value: any, index: any) => {
        if (value > newMaxHoldData[index]) {
          newMaxHoldData[index] = value;
        }
      });
      setMaxHoldData(newMaxHoldData);
    }
  }, [power, maxHoldEnabled]);

  const getOption = () => {
    if (!power.length) return {};

    return {
      title: {
        text: `Spectral Display - ${times[index]}`,
        left: 'center',
        textStyle: {
          color: 'white',
          fontSize: 25,  // Adjusted font size for better visibility
          // fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
          label: {
            backgroundColor: '#283b56'
          }
        },
        formatter: (params: any) => {
          const param = params[0];
          return `Frequency: ${formattedFrequencies[param.dataIndex]} MHz<br>Power: ${param.value} dBm`;
        }
      },
      xAxis: {
        type: 'category',
        data: roundedFrequencies,
        axisLabel: {
          formatter: '{value} MHz',
          color: 'white',
          interval: interval // Show every 2nd label (adjust as needed)
        },
        axisLine: {
          lineStyle: {
            color: 'white',

          },
        },
        splitLine: {
          show: false,
        },

      },
      yAxis: {
        type: 'value',
        min: minValue,
        max: maxValue,
        axisLabel: {
          formatter: '{value} dBm',
          color: 'white'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.2)'
          },
        }
      },
      series: [
        {
          data: power,
          type: 'line',
          symbol: 'none',
          symbolSize: 5,
          showSymbol: true,
          lineStyle: {
            width: 3
          }
        },
        {
          data: maxHoldEnabled ? maxHoldData : [],
          type: 'line',
          symbol: 'none',
          symbolSize: 5,
          showSymbol: true,
          lineStyle: {
            color: 'rgba(144, 238, 144, 0.3)',// Light green with opacity
            width: 3
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
          start: zoomRange.start,
          end: zoomRange.end
        }
      ],
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: 'Zoom area',
              back: 'Reset zoom'
            }
          },
        }
      }
    };
  };
  return (
    <div>
      <Switch
        checked={maxHoldEnabled} onChange={() => setMaxHoldEnabled(!maxHoldEnabled)}
        checkedChildren="Max Hold Enabled"
        unCheckedChildren="Max Hold Disabled"
      />
      <ReactEcharts option={getOption()} style={{ height: '400px', width: '1450px' }} />
    </div>
  );
};

export default SpectralDisplay;
