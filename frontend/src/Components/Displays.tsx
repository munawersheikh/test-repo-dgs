import { useEffect, useState, useRef } from 'react';
import SpectralDisplay from './Graphs/SpectralDisplay';
import { Select, Tooltip } from 'antd';
import Navbar from './Navbar';
import { Button, message } from 'antd';
import { CaretRightOutlined, FastBackwardOutlined, FastForwardOutlined, PauseOutlined } from "@ant-design/icons";
import { Utilities } from '../Utilities';
import * as d3 from 'd3';
import D3Waterfall from './Graphs/D3Waterfall';
import PsdRangeSettings from './Settings/PsdRangeSettings';
import { getPsdData } from '../Services';

const Displays = () => {
  const utils = new Utilities();
  const [spectralWaterfallData, setSpectralWaterfallData] = useState<any>({ psd: [], start_times: [] });
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalIdRef = useRef<any>(null);
  const storageData: any = localStorage.getItem("StorageData");
  const parsedStorageData = JSON.parse(storageData);
  const [powerData, setPowerData] = useState<number[][]>([]); // Define powerData as an array of number arrays
  const [currentIndex, setCurrentIndex] = useState(0);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);


  useEffect(() => {
    fetchPsdData();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalIdRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < spectralWaterfallData.psd.length - 1) {
            const newIndex = prevIndex + 1;
            if (spectralWaterfallData.psd[newIndex]) {
              setPowerData((prevPowerData) => {
                const newPowerData = [...prevPowerData];
                newPowerData.unshift(spectralWaterfallData.psd[newIndex]); // Add new data at the start
                newPowerData.pop(); // Remove the last element to maintain the length
                return newPowerData;
              });
            }
            return newIndex;
          } else {
            setIsPlaying(false);
            message.info('End of data.');
            clearInterval(intervalIdRef.current);
            return prevIndex;
          }
        });
      }, 1000);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isPlaying, spectralWaterfallData.psd]);



  const fetchPsdData = async () => {
    try {
      const fetchedData = await getPsdData({

        count: parsedStorageData.count,
        start_time: parsedStorageData.startTime,
        end_time: parsedStorageData.endTime,
        mask_start_time: parsedStorageData.startTime,
        mask_end_time: parsedStorageData.endTime,
        threshold: parsedStorageData.threshold,
        job_recid: parsedStorageData.jobRecId,
        operation: parsedStorageData.operations,

      });
      // const fetchedData = response.data[parsedStorageData.jobRecId] || { psd: [], start_times: [] };
      // const fetchedData = response.data || { psd: [], start_times: [] };
      if (fetchedData.psd.length === 0 || fetchedData.start_times.length === 0) {
        message.error(`No PSD data found on RecID: ${parsedStorageData.jobRecId}`);
      }

      // setSpectralWaterfallData(fetchedData);
      setSpectralWaterfallData(fetchedData || { psd: [], start_times: [] });

      if (fetchedData.psd && fetchedData.psd.length > 0) {
        const initialData = fetchedData.psd[0];
        setPowerData([initialData, ...Array.from({ length: 9 }, () => [])]);

        const allValues: number[] = fetchedData.psd.flat();

        const min: number = d3.min(allValues) ?? -Infinity;
        const max: number = d3.max(allValues) ?? Infinity;
        setMinValue(min)
        setMaxValue(max)
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('Failed to fetch data.');
    }
  };


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    if (currentIndex < spectralWaterfallData.psd.length - 1) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (spectralWaterfallData.psd[newIndex]) {
          setPowerData((prevPowerData) => {
            const newPowerData = [...prevPowerData];
            newPowerData.unshift(spectralWaterfallData.psd[newIndex]); // Add new data at the start
            newPowerData.pop(); // Remove the last element to maintain the length
            return newPowerData;
          });
        }
        return newIndex;
      });
    } else {
      message.info('End of data.');
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        if (spectralWaterfallData.psd[newIndex]) {
          setPowerData((prevPowerData) => {
            const newPowerData = [...prevPowerData];
            if (newPowerData.every(key => key.length > 0 && prevIndex > 9)) {
              newPowerData.push(spectralWaterfallData.psd[prevIndex - 10]);
            } else {
              newPowerData.push([]);
            }
            newPowerData.shift(); // Remove the first element to maintain the length
            return newPowerData;
          });
        }
        return newIndex;
      });
    } else {
      message.info('Already at the beginning.');
    }
  };

  const handleTime = (value: string) => {
    const newIndex = value ? spectralYAxisData.findIndex((time: string) => time === value) : 0;
    const difference = newIndex - currentIndex;
    setCurrentIndex(newIndex);

    setPowerData((prevPowerData) => {
      const newPowerData = [...prevPowerData];
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          newPowerData.unshift(spectralWaterfallData.psd[currentIndex + i + 1]);
          newPowerData.pop();
        }
      } else if (difference < 0) {
        for (let i = 0; i < -difference; i++) {
          if (newPowerData.every(key => key.length > 0 && currentIndex - i > 9)) {
            newPowerData.push(spectralWaterfallData.psd[currentIndex - i - 10]);
          } else {
            newPowerData.push([]);
          }
          newPowerData.shift();
        }
      }
      return newPowerData;
    });
  };

  const power: number[] = spectralWaterfallData.psd[currentIndex] || [];
  const spectralYAxisData: string[] = spectralWaterfallData.start_times || [];

  const frequencyArray: number[] = utils.calculateFreq(power.length, parsedStorageData?.frequency, parsedStorageData?.sampleRate)

  const waterfallYAxisData = Array.from({ length: 11 }, (_, i) => i);

  return (
    <>
      <div className='h-[10vh]'>
        <Navbar page="reports" />
      </div>
      <div className="main-h-screen bg-black flex">
        <div className="flex flex-col w-full p-5 space-y-5">

          <Select
            style={{ width: '100%' }}
            allowClear={true}
            placeholder="Select a start time"
            onChange={handleTime}
            options={spectralYAxisData.map((time: string, index: number) => ({ label: time, value: time }))}
          />

          <PsdRangeSettings
            spectralWaterfallData={spectralWaterfallData}
            setMinValue={setMinValue}
            setMaxValue={setMaxValue}
          />

          <div className="bg-gray-800 text-white p-3 h-full rounded-lg">
            <SpectralDisplay
              power={power}
              frequencies={frequencyArray}
              times={spectralYAxisData}
              index={currentIndex}
              minValue={minValue}
              maxValue={maxValue}
            />
          </div>
          <div className="bg-gray-800 text-white p-3 h-full rounded-lg" style={{ textAlign: 'center' }}>
            <Tooltip title="Rewind">
              <Button icon={<FastBackwardOutlined />} onClick={handleRewind} style={{ width: 100 }} />
            </Tooltip>
            <Tooltip title={isPlaying ? "Pause" : "Play"}>
              <Button icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />} onClick={handlePlayPause} style={{ width: 100 }} />
            </Tooltip>
            <Tooltip title="Fast Forward">
              <Button icon={<FastForwardOutlined />} onClick={handleFastForward} style={{ width: 100 }} />
            </Tooltip>
          </div>
          <div className="bg-gray-800 text-white p-3 h-full rounded-lg">
            <D3Waterfall
              powerData={powerData}
              waterfallXAxisData={frequencyArray}
              waterfallYAxisData={waterfallYAxisData}
              minValue={minValue}
              maxValue={maxValue}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Displays;
