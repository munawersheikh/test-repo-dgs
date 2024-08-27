
import { Button, Form, Select, Typography } from 'antd'
import Cookies from 'js-cookie';
import { TimeSettingType } from '../../Types/ProjectTypes';

const TimeSliceSettings = () => {


  const { Title } = Typography;
  const [form] = Form.useForm();

  const timeIntervalOptions: string[] = ['15 minutes', '30 minutes', '1 hour'];

  const onTimeIntervalFinish = (values: Record<string, string>) => {
    const value: number = values.selectTimeInterval ? parseInt(values.selectTimeInterval.split(" ")[0]) : 15;
    const unit: string = values.selectTimeInterval ? values.selectTimeInterval.split(" ")[1] : "minutes";
    const timeSettings: TimeSettingType = { value: value, unit: unit };
    const stringTimeSettings = JSON.stringify(timeSettings);
    Cookies.set("TimeSettings", stringTimeSettings);
    form.resetFields();
  };

  return (

    <div >
      <Form form={form} onFinish={onTimeIntervalFinish} >
        <Form.Item >
          <Title style={{ color: "white", fontSize: 25 }} >Time Slice Interval Settings</Title>
        </Form.Item>

        <Form.Item name="selectTimeInterval">
          <Select
            style={{ width: 200 }}
            allowClear={true}
            placeholder='Select Time Interval'
            options={timeIntervalOptions.map((item) => ({ label: item, value: item }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type='default' htmlType="submit" style={{ width: 200 }}>
            Set Interval
          </Button>
        </Form.Item>


      </Form>
    </div>

  )
}

export default TimeSliceSettings