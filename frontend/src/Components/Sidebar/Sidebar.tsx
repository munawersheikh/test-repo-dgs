import { useState } from 'react';
import { Button } from 'antd';
import { WifiOutlined, SettingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import TimeSelectionSidebar from './TimeSelectionSidebar';
import SiteSelectionSidebar from './SiteSelectionSidebar';

const Sidebar = () => {

  const [isSiteOpen, setIsSiteOpen] = useState<boolean>(false);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDateTimeIconClick = () => {
    setIsDateTimeOpen(!isDateTimeOpen)
    setIsSiteOpen(false)
  }

  const onSiteIconClick = () => {
    setIsSiteOpen(!isSiteOpen)
    setIsDateTimeOpen(false)
  }

  return (
    <div className={`sidebar ${isSiteOpen || isDateTimeOpen ? 'open' : ''}`}>
      <div className="sidebar-header" >
        <div onClick={onDateTimeIconClick} style={{ backgroundColor: isDateTimeOpen ? 'blue' : "" }}>
          <ClockCircleOutlined className='sidebar-icon' />
        </div>
        <div onClick={onSiteIconClick} style={{ backgroundColor: isSiteOpen ? 'blue' : "" }}>
          <WifiOutlined className='sidebar-icon' />
        </div>
        <div onClick={() => navigate('/settings')}>
          <SettingOutlined className="sidebar-icon" />
        </div>
      </div>
      {isDateTimeOpen && (
        <div className='sidebar-content'>
          <div className="sidebar-top">
            <TimeSelectionSidebar />
          </div>
          <div className="sidebar-bottom">
            <Button type="default">Update & Add</Button>
            <Button type="default">Update & Replace</Button>
            <p className="sidebar-note">*Must select Date/Time to update</p>
          </div>
        </div>
      )
      }

      {isSiteOpen && (
        <div className='sidebar-content'>
          <div className="sidebar-top">
            <SiteSelectionSidebar />
          </div>
          <div className="sidebar-bottom">
            <Button className='w-full' type="default">Update & Add</Button>
            <Button className='w-full' type="default">Update & Replace</Button>
            <p className="sidebar-note">*Must select Date/Time to update</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
