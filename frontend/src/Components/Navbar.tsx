import { Layout, Button } from 'antd';
import { LeftOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from "../assest/dgs.png";
const Navbar = ({ page }: any) => {
  const { Header } = Layout;
  const navigate = useNavigate();
  return (
    <>
      {page === "collections" ?
        <Header className="bg-gray-800 text-white flex justify-between items-center p-3">
          {/* <Button type="text" icon={<SettingOutlined />} className="text-white" onClick={() => navigate('/settings')} /> */}
          <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />

          {/* <div className="flex-grow"></div> */}
          <div className="flex justify-center items-center w-full " style={{ fontWeight: "bold", fontSize: "20px" }}>
            {"SIGBase\u2122 System"}
          </div>
          <Button type="text" icon={<CloseOutlined />} className="text-white" />
        </Header>
        :
        <Header className="bg-gray-800 text-white flex justify-between items-center p-3">
          <Button type="text" icon={<LeftOutlined />} className="text-white" onClick={() => navigate('/')} />
          <img src={logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
          {/* <div className="flex-grow"></div> */}
          <div className="flex justify-center items-center w-full " style={{ fontWeight: "bold", fontSize: "20px" }}>
            {"SIGBase\u2122 System"}
          </div>
          <Button type="text" icon={<CloseOutlined />} className="text-white" />
        </Header>

      }
    </>
  );
}

export default Navbar;
