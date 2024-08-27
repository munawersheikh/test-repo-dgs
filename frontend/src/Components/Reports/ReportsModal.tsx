import React from 'react';
import { Modal } from 'antd';
import NewReport from './ModalOptions/NewReport';
import NewReportExisitngParams from './ModalOptions/NewReportExisitngParams';


const ReportsModal = ({ isModalVisible, setIsModalVisible, selectedReportOption }: any) => {
  return (
    <div style={{ color: "white" }}>
      <Modal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        footer={null} // Removes the default footer buttons
      >
        {selectedReportOption === "New" ? <NewReport setIsModalVisible={setIsModalVisible} /> : <></>}
        {selectedReportOption === "New with existing params" ? <NewReportExisitngParams setIsModalVisible={setIsModalVisible} /> : <></>}
      
      </Modal>
    </div>
  );
};

export default ReportsModal;
