import Cookies from 'js-cookie';

export class Utilities {
  xAxisArray(powerLength: number, centerFrequency: number, usableBandwidth: number): number[] {
    const startFrequency = centerFrequency / 1000000; //630
    const bandwidth = usableBandwidth / 1000000; //40
    const rangeBandwidth = bandwidth / 2; // 40 / 2 = 20
    const rangeStart = startFrequency - rangeBandwidth; // 630-20 = 610
    const frequencies = Array.from({ length: powerLength }, (_, idx) => Math.round((rangeStart + idx * (bandwidth / powerLength))));
    return frequencies;
  }

  calculateFrequencies(nfft: number, centerFrequency: number, sampleRate: number,): number[] {

    const cf = centerFrequency / 1000000;
    const fs = sampleRate / 1000000;

    // Calculate the FFT frequencies
    let freq = [];
    for (let i = 0; i < nfft; i++) {
      freq.push(i < nfft / 2 ? i / nfft * fs : (i / nfft - 1) * fs);
    }

    // Apply the fftshift
    freq = this.fftshift(freq);

    // Add the center frequency
    freq = freq.map((f: number) => f + cf);

    return freq;
  }

  // Function to perform fftshift
  fftshift(arr: number[]): number[] {
    const half = Math.floor(arr.length / 2);
    return arr.slice(half).concat(arr.slice(0, half));
  }

  calculateFreq(nfft: number, centerFrequency: number, sampleRate: number,): number[] {
    const cf = centerFrequency / 1000000;
    const fs = sampleRate / 1000000;
    let result = [];
    let start = fs / -2;
    let stop = fs / 2;
    let step = fs / nfft


    for (let i = start; i < stop; i += step) {
      result.push(i);
    }

    result = result.map(key => key + cf)
    return result;
  }

  getColorPalette(numColors: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
      const hue = (i * 360 / numColors) % 360;
      colors.push(`hsl(${hue}, 100%, 50%)`);
    }

    return colors;
  };



  chopFilteredData(data: any, occupancy: number, power: number): any[] {
    const groupedData = data.reduce((acc: any, record: any) => {
      if (!acc[record.cv_center_freq]) {
        acc[record.cv_center_freq] = [];
      }
      acc[record.cv_center_freq].push(record);
      return acc;
    }, {});

    // Step 2: Calculate occupancy percentage
    const occupancyPercentages = Object.keys(groupedData).reduce((acc: any, freq: any) => {
      const records = groupedData[freq];
      const total = records.length;
      const occupied = records.filter((record: any) => record.cv_occupied === 1).length;
      const occupancyPercentage = (occupied / total) * 100;
      acc[freq] = occupancyPercentage;
      return acc;
    }, {});

    // Step 3: Filter records with occupancy percentage greater than 97%
    const filteredData = data.filter((record: any) => {
      return occupancyPercentages[record.cv_center_freq] > occupancy &&
        record.cv_power_avg > power &&
        record.cv_peak_power > power;
    });

    return filteredData;
  }


  createTimeSlices(collectStart: string, collectEnd: string): Date[] {
    const timeSettings = Cookies.get("TimeSettings");

    const timeSlices = [];

    if (timeSettings === undefined) {
      for (let time = new Date(collectStart); time <= new Date(collectEnd); time.setMinutes(time.getMinutes() + 15)) {
        timeSlices.push(new Date(time));
      }
    }
    else {
      const timeSettingsObject = JSON.parse(timeSettings);
      const timeUnit = timeSettingsObject.unit;
      const intervalValue = timeSettingsObject.value;
      if (timeUnit === "minutes") {
        for (let time = new Date(collectStart); time <= new Date(collectEnd); time.setMinutes(time.getMinutes() + intervalValue)) {
          timeSlices.push(new Date(time));
        }
      }
      else if (timeUnit === "hour") {
        for (let time = new Date(collectStart); time <= new Date(collectEnd); time.setHours(time.getHours() + intervalValue)) {
          timeSlices.push(new Date(time));
        }
      }
    }

    const timeSlicesLastIndex = timeSlices.length - 1;
    const slicedTimeSlices = timeSlices.length > 0 && timeSlices.length === 1 ? timeSlices : timeSlices.slice(0, timeSlicesLastIndex);

    return slicedTimeSlices;
  }


  calculateEndTime = (startTime: string, settings: string | undefined) => {
    let endTime;
    if (settings === undefined) {
      const convertedStartTime = new Date(startTime);
      endTime = new Date(convertedStartTime.setMinutes(convertedStartTime.getMinutes() + 15)).toISOString();
    }
    else {
      const timeSettingsObject = JSON.parse(settings);
      const timeUnit = timeSettingsObject.unit;
      const intervalValue = timeSettingsObject.value;
      if (timeUnit === "minutes") {
        const convertedStartTime = new Date(startTime);
        endTime = new Date(convertedStartTime.setMinutes(convertedStartTime.getMinutes() + intervalValue)).toISOString();
      }
      else if (timeUnit === "hour") {
        const convertedStartTime = new Date(startTime);
        endTime = new Date(convertedStartTime.setHours(convertedStartTime.getHours() + intervalValue)).toISOString();
      }
    }

    return endTime;
  }


  formatUrlTime(time: string): string {
    const replacement = time.replace(/\.000/, '');
    const formattedDateTime = encodeURIComponent(replacement);
    return formattedDateTime;
  }



}

