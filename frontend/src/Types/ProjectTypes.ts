export type JobListDataType = {
  key: number;
  count: number;
  recId: number;
  jobRecId: number;
  jobName: string;
  centerFrequency: number;
  fftSize: number;
  fftAverage: number;
  nodeName: string;
  lla: string;
  sdrName: string;
  usableBw: number;
  highestFrequency: number;
  lowestFrequency: number;
  descriptionDetails: DescriptionDetails;
  timeSliceDetails: Date[];
};

export type DescriptionDetails = {
  collectStart: Date;
  collectStop: Date;
  nodeRecId: number;
  centerFrequency: number;
  sampleRate: number;
  sdrUseAgc: string;
  sdrGain: number;
}

export type TimeSettingType = {
  value: number | null;
  unit: string | null;
}

export type WaterFallRangeType = {
  low: number | null;
  high: number | null;
}

export type SpectralDataType = {
  count: number | null;
  jobRecId: number | null;
  startTime: Date | null;
  endTime: Date | null;
  maskStartTime: Date | null;
  maskEndTime: Date | null;
  threshold: number | null;
  bandwidth: number | null;
  frequency: number | null;
  operations: string[] | null;
}
