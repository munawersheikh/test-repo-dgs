import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Select } from 'antd';
import { Utilities } from '../../Utilities';


const ChannelPeakPower = ({ chopData }: any) => {
  const url = process.env.REACT_APP_API_PATH;
  const [selectedLegends, setSelectedLegends] = useState<string[]>([]);
  const [legends, setLegends] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const utils = new Utilities();
  useEffect(() => {
    const fetchData = async () => {
      try {

        const distinctCV: any = Array.from(new Set(chopData.map((record: any) => record.cv_center_freq.toString())));
        setLegends(distinctCV);

        const timeCategories: any = Array.from(new Set(chopData.map((record: any) => echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', record.time_collected_timestamp, false))));
        setCategories(timeCategories);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [url]);

  const getOption = (): echarts.EChartsOption => {
    const colors = utils.getColorPalette(legends.length);
    const series: any = legends.map((legend, index) => {
      const filteredData = chopData.filter((record: any) => record.cv_center_freq.toString() === legend);
      const seriesData = categories.map((time) => {
        const record = filteredData.find((r: any) => echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', r.time_collected_timestamp, false) === time);
        return record ? record.cv_peak_power : null;
      });

      return {
        name: legend,
        type: 'line',
        data: selectedLegends.length === 0 || selectedLegends.includes(legend) ? seriesData : [],
        itemStyle: {
          color: colors[index]
        },
        // symbol: 'none',  // Remove dots on points
        lineStyle: {
          width: 3.5  // Increase line thickness
        },
      };
    });

    return {
      title: {
        text: 'Channel Peak Power',
        left: 10,
        textStyle: {
          color: 'white',
        },
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          return `${params.seriesName}: ${params.value.toFixed(2)}`;
        }
      },
      legend: {
        show: false, // Hide the legend
        data: legends,
      },
      grid: {
        bottom: 95
      },
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ],
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          saveAsImage: {
            pixelRatio: 2
          }
        }
      },
      xAxis: {
        type: 'category',
        silent: false,
        data: categories,
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        },
        axisLabel: {
          color: 'white',
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: 'white',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'white',
        },
        axisLine: {
          lineStyle: {
            color: 'white',
          },
        },
      },
      series,
    };
  };

  const handleLegendSelect = (value: string[]) => {
    setSelectedLegends(value);
  };

  return (
    <div className='relative'>
      <Select
        className='absolute top-[-4px] right-0 z-10'
        mode="multiple"
        allowClear={true}
        placeholder="Select a frequency"
        onChange={handleLegendSelect}
        style={{ justifyContent: 'end', width: '60%' }}
      >
        {legends.map((legend) => (
          <Select.Option key={legend} value={legend}>
            {(Number(legend) / 1000000).toFixed(2)}
          </Select.Option>
        ))}
      </Select>
      <ReactECharts
        option={getOption()}
        style={{ height: '50vh', width: '100%' }}
      />
    </div>
  );
};

export default ChannelPeakPower;











