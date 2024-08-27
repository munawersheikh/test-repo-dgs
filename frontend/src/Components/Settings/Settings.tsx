import React from 'react';
import Navbar from '../Navbar';
import { Typography } from 'antd';
import TimeSliceSettings from './TimeSliceSettings';
import AliasNodeSettings from './AliasNodeSettings'; // Import the new component

const Settings = () => {
  const { Title } = Typography;
  return (
    <>
      <div className='h-[10vh]'>
        <Navbar page={'settings'} />
      </div>
      <div className='h-[190vh] '>
        <Title style={{ textAlign: "center" }}>Settings</Title>
        <hr />
        <TimeSliceSettings />
        <AliasNodeSettings /> {/* Include the new component */}
      </div >
    </>
  )
}

export default Settings;
