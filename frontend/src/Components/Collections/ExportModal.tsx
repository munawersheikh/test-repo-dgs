import { useState } from 'react';
import { Typography, Modal, Radio, Select, message } from 'antd';
import { getPsdData, getChopData } from '../../Services'; // Import service methods
import { Utilities } from '../../Utilities';


const ExportModal = ({ isExportModalVisible, setIsExportModalVisible, storageData }: any) => {
  const utils = new Utilities();
  const { Title } = Typography;
  const [selectedExport, setSelectedExport] = useState<string>("PSD");
  const [selectedRadio, setSelectedRadio] = useState<string>("json");
  const [power, setPower] = useState<number>(-90);
  const [occupancy, setOccupancy] = useState<number>(5);
  const exportDataItems = ["PSD", "CHOP", "LMR", "LTE", "Location Data"];
  const exportFormats = ["JSON", "CSV", "XML"];
  const powerOptions = [-90, -80, -70];
  const occupancyOptions = [5, 10];

  const metaData = {
    jobRecId: storageData.jobRecId,
    centerFrequency: `${(storageData.frequency / 1000000).toFixed(4)} MHz`,
    usableBandwidth: `${(storageData.bandwidth / 1000000).toFixed(4)} MHz`,
    sampleRate: `${(storageData.sampleRate / 1000000).toFixed(4)} MSPS`,
    sdrGain: `${storageData.sdrGain} dB`,
    startTime: storageData.startTime,
    endTime: storageData.endTime,
  }



  const handleExport = async () => {
    const format = selectedRadio;

    if (selectedExport === "PSD") {
      try {
        const params = {
          count: storageData.count,
          start_time: storageData.startTime,
          end_time: storageData.endTime,
          mask_start_time: storageData.startTime,
          mask_end_time: storageData.endTime,
          threshold: storageData.threshold,
          job_recid: storageData.jobRecId,
          operation: storageData.operations,
        };

        const data = await getPsdData(params); // Use the service method to fetch PSD data
        const psdData = data;



        if (psdData.psd.length === 0 || psdData.start_times.length === 0) {
          message.error(`No PSD data found on RecID: ${storageData.jobRecId}`);
        }
        const content = format === "json" ? generateJSON(psdData, selectedExport, metaData) : (format === "csv" ? generateCSV(psdData, selectedExport, metaData) : generateXML(psdData, selectedExport, metaData));
        downloadCSV(content, `psd_data.${format}`, format);
      } catch (error) {
        console.error('Error exporting PSD data:', error);
      }
    }

    if (selectedExport === "CHOP") {
      try {
        const data = await getChopData(storageData.jobRecId, storageData.startTime, storageData.endTime); // Use the service method to fetch CHOP data
        if (!data) {
          message.error('No CHOP data found.');
          return;
        }
        const content = format === "json" ? generateJSON(data, selectedExport, metaData) : (format === "csv" ? generateCSV(data, selectedExport, metaData) : generateXML(data, selectedExport, metaData));
        downloadCSV(content, `chop_data.${format}`, format);
      } catch (error) {
        console.error('Error exporting CHOP data:', error);
      }
    }

    // Reset selections and close the modal
    setSelectedExport("PSD");
    setSelectedRadio("json");
    setPower(-90);
    setOccupancy(5);
    setIsExportModalVisible(false);
  };

  const generateCSV = (data: any, type: string, metaData: any) => {
    let csvRows = [];

    // Adding metaData as two columns in each row (Key, Value)
    // csvRows.push("key, values");
    for (const [key, value] of Object.entries(metaData)) {
      csvRows.push(`${key},${value}`);
    }

    // Adding an empty row to separate metadata from the actual data
    csvRows.push("");

    let csvHeader = "Serial No.";
    if (type === "PSD") {
      csvHeader += ",Start_Time,PSD_Value";
      csvRows.push(csvHeader);
      csvRows = csvRows.concat(
        data.start_times.map((time: string, index: number) => `${index + 1},${time},${data.psd[index].filter((value: number) => value > power)}`)
      );
    } else if (type === "CHOP") {
      csvHeader += `,${Object.keys(data[0]).join(",")}`;
      csvRows.push(csvHeader);
      const filteredData = utils.chopFilteredData(data, occupancy, power);
      csvRows = csvRows.concat(
        filteredData.map((value: any, index: number) => {
          const values = Object.values(value).map(keyValue => keyValue);
          return `${index + 1},${values.join(',')}`;
        })
      );
    }

    return csvRows.join("\n");
  };



  const generateXML = (data: any, type: string, metaData: any) => {
    let xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';

    // Convert meta object to XML string
    let metaXML = `<MetaData>\n${Object.entries(metaData)
      .map(([key, value]) => `<${key}>${value}</${key}>`)
      .join('\n')}\n</MetaData>`;


    let xmlRows = [];

    if (type === "PSD") {
      xmlRows = data.start_times.map((time: string, index: any) =>
        `<Record>
          <SerialNo>${index + 1}</SerialNo>
          <Start_Time>${time}</Start_Time>
          <PSD_Value>${data.psd[index].filter((value: number) => value > power)}</PSD_Value>
        </Record>`
      );
    } else if (type === "CHOP") {
      const filteredData = utils.chopFilteredData(data, occupancy, power);
      xmlRows = filteredData.map((value: any, index: number) => {
        const recordXML = Object.entries(value).map(([key, val]) =>
          `<${key}>${val}</${key}>`
        ).join('');

        return `<Record>
                  <SerialNo>${index + 1}</SerialNo>
                  ${recordXML}
                </Record>`;
      });
    }

    // Concatenate all parts together properly
    return `${xmlHeader}\n<ExportedData>\n${metaXML}\n<Records>\n${xmlRows.join('\n')}\n</Records>\n</ExportedData>`;
  };


  const generateJSON = (data: any, type: string, metaData: any) => {
    let jsonObject = {};
    let jsonData = [];

    if (type === "PSD") {
      jsonData = data.start_times.map((time: string, index: any) => ({
        SerialNo: index + 1,
        Start_Time: time,
        PSD_Value: data.psd[index].filter((value: number) => value > power)
      }));
    } else if (type === "CHOP") {
      const filteredData = utils.chopFilteredData(data, occupancy, power);
      jsonData = filteredData.map((value: any, index: number) => ({
        SerialNo: index + 1,
        ...value
      }));
    }

    jsonObject = { metaData, data: jsonData };

    return JSON.stringify(jsonObject, null, 2);
  };

  const downloadCSV = (content: string, filename: string, format: string) => {
    const blob = new Blob([content], { type: format === "json" ? 'application/json;charset=utf-8;' : (format === "csv" ? 'text/csv;charset=utf-8;' : 'application/xml;charset=utf-8;') });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = () => {
    setSelectedExport("PSD");
    setSelectedRadio("json");
    setPower(-90);
    setOccupancy(5);
    setIsExportModalVisible(false);
  };

  const handlePowerSelection = (value: number) => {
    setPower(value);
  };

  const handleOccupancySelection = (value: number) => {
    setOccupancy(value);
  };

  return (
    <Modal
      title="Export"
      visible={isExportModalVisible}
      onOk={handleExport}
      onCancel={handleCancel}
      width={600}
      okText="Export"
      okButtonProps={{ disabled: selectedExport === null }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <div style={{ marginBottom: 16 }}>
        <hr />
        <Title level={5}>Data Export</Title>
        <Radio.Group value={selectedExport} onChange={(e) => setSelectedExport(e.target.value)}>
          {exportDataItems.map((item: string, index: number) => (
            <Radio
              key={index}
              value={item}
              disabled={!(item === "PSD" || item === "CHOP")} // Enable only "PSD" and "CHOP"
            >
              {item}
            </Radio>))}
        </Radio.Group>
      </div>
      <hr />
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Format Type</Title>
        <Radio.Group value={selectedRadio} onChange={(e) => setSelectedRadio(e.target.value)}>
          {exportFormats.map((item: string, index: number) => (
            <Radio
              key={index}
              value={item.toLowerCase()}
              disabled={selectedExport === "PSD" && item.toLowerCase() !== "json"} // Disable if PSD is selected and not JSON
            >
              {item}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <hr />
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Modifiers</Title>

        <label>Power Greater Than</label>
        <br />
        <Select
          style={{ width: "15%" }}
          value={power}
          onChange={handlePowerSelection}
          options={powerOptions.map((key: number) => ({ label: `${key} dB`, value: key }))}
          disabled={selectedExport === "PSD"}
        />

        <br />
        <br />

        <label>Occupancy Greater Than</label>
        <br />
        <Select
          style={{ width: "15%" }}
          value={occupancy}
          onChange={handleOccupancySelection}
          options={occupancyOptions.map((key: number) => ({ label: `${key}% `, value: key }))}
          disabled={selectedExport === "PSD"}
        />

      </div>
      {/* <div>
        <p>File Size Estimate: 635 MB</p>
      </div> */}
    </Modal>
  );
};

export default ExportModal;
