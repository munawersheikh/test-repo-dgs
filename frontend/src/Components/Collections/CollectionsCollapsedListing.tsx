import { Radio } from "antd";
import { useState } from "react";
import Cookies from 'js-cookie';
import { Utilities } from "../../Utilities";

const CollectionsCollapsedListing = ({ details, type, selectedTimeSlice, setSelectedTimeSlice, storageData, setStorageData, record }: any) => {

  const utils = new Utilities();
  const timeSettings = Cookies.get("TimeSettings");


  const handleRadioChange = (e: any) => {

    const selectedTime = e.target.value;
    const endTime = utils.calculateEndTime(selectedTime, timeSettings);
    setSelectedTimeSlice(selectedTime);
    const newStorageData = { ...storageData };
    newStorageData.count = 1;
    newStorageData.jobRecId = record.descriptionDetails.recId;
    newStorageData.startTime = selectedTime;
    newStorageData.endTime = endTime;
    newStorageData.maskStartTime = selectedTime;
    newStorageData.maskEndTime = endTime;
    newStorageData.threshold = 200;
    newStorageData.sdrGain = record.descriptionDetails.sdrGain;;
    newStorageData.bandwidth = record.bandwidth;
    newStorageData.frequency = record.centerFrequency;
    newStorageData.sampleRate = record.descriptionDetails.sampleRate;
    newStorageData.operations = "psd";
    setStorageData(newStorageData)
  }



  if (type === 'DescriptionDetails') {
    return (
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 " style={{ padding: '10px', gap: "15px" }}>
          <p className="whitespace-nowrap"><strong>Collect Start:</strong> {details.collectStart}</p>
          <p className="whitespace-nowrap"><strong>Collect Stop:</strong> {details.collectStop}</p>
          <p className="whitespace-nowrap"><strong>RECID:</strong> {details.recId}</p>
          {/* <p className="whitespace-nowrap"><strong>Node RECID:</strong> {details.nodeRecId}</p> */}
          <p className="whitespace-nowrap"><strong>Bandwidth:</strong> {`${(details.bandwidth / 1000000).toFixed(4)}  MHz`}</p>
          {/* <p className="whitespace-nowrap"><strong>Center Frequency:</strong> {details.centerFrequency}</p> */}
          <p className="whitespace-nowrap"><strong>Sample Rate:</strong> {`${(details.sampleRate / 1000000).toFixed(4)} MSPS`}</p>
          <p className="whitespace-nowrap"><strong>SDR Use AGC:</strong> {details.sdrUseAgc}</p>
          <p className="whitespace-nowrap"><strong>SDR Gain:</strong> {`${details.sdrGain} dB`}</p>
          <p className="whitespace-nowrap"><strong>PSD:</strong> {details.psd}</p>
          <p className="whitespace-nowrap"><strong>CHOP:</strong> {details.chop}</p>
          <p className="whitespace-nowrap"><strong>LMR Decode:</strong> {details.lmrDecode}</p>
          <p className="whitespace-nowrap"><strong>LTE Decode:</strong> {details.lteDecode}</p>
          <p className="whitespace-nowrap"><strong>Location Data:</strong> {details.locationData}</p>
        </div>

      </div>


    );
  } else if (type === 'TimeSliceDetails') {
    return (
      <div style={{ padding: '10px' }}>
        <Radio.Group value={selectedTimeSlice} onChange={handleRadioChange}>
          {details.map((time: Date, index: number) => (
            <p key={index}>
              <Radio value={time.toISOString()} >
                {` Time Slice ${index + 1}: ${time.toISOString()}`}
              </Radio>
            </p>
          ))}
        </Radio.Group>
      </div>
    );
  }
  return null;
};

export default CollectionsCollapsedListing;
