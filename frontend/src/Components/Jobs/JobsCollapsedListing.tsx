import { Radio } from "antd";

const JobsCollapsedListing = ({ details, type, selectedTimeSlice, setSelectedTimeSlice, spectralGraphData, setSpectralGraphData }: any) => {

  if (!details) return null;

  const handleRadioChange = (e: any) => {
    const newSpectralgraphData = { ...spectralGraphData };
    const selectedTime = e.target.value;
    newSpectralgraphData.endTime = new Date(selectedTime);
    newSpectralgraphData.maskEndTime = new Date(selectedTime);
    setSelectedTimeSlice(selectedTime);
    setSpectralGraphData(newSpectralgraphData);
  };

  if (type === 'DescriptionDetails') {
    return (
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-4 w-4/6" style={{ padding: '10px' }}>
          <p className="whitespace-nowrap"><strong>Collect Start:</strong> {details.collectStart}</p>
          <p className="whitespace-nowrap"><strong>Collect Stop:</strong> {details.collectStop}</p>
          <p className="whitespace-nowrap"><strong>Node RECID:</strong> {details.nodeRecId}</p>
          <p className="whitespace-nowrap"><strong>Center Frequency:</strong> {details.centerFrequency}</p>
          <p className="whitespace-nowrap"><strong>Sample Rate:</strong> {details.sampleRate}</p>
          <p className="whitespace-nowrap"><strong>SDR Use AGC:</strong> {details.sdrUseAgc}</p>
          <p className="whitespace-nowrap"><strong>SDR Gain:</strong> {details.sdrGain}</p>
        </div>

      </div>
    );
  } else if (type === 'TimeSliceDetails') {
    return (
      <div style={{ padding: '10px' }}>
        <Radio.Group onChange={handleRadioChange} value={selectedTimeSlice}>
          {details.map((time: Date, index: number) => (
            <p key={index}>
              <Radio value={time.toISOString()}>
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

export default JobsCollapsedListing;
