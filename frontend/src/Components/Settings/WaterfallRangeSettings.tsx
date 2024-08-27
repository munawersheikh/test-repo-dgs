import { Button, Form, Input } from 'antd'
import Cookies from 'js-cookie';
import { WaterFallRangeType } from '../../Types/ProjectTypes';

const WaterfallRangeSettings = () => {

  const [form] = Form.useForm();

  const onColorRangeFinish = (values: Record<string, string>) => {
    const lowRange: number = values.lowRange ? parseInt(values.lowRange) : 1;
    const highRange: number = values.highRange ? parseInt(values.highRange) : 10;
    const rangeSettings: WaterFallRangeType = { low: lowRange, high: highRange };
    const strigRangeSettings = JSON.stringify(rangeSettings);
    Cookies.set("WaterfallRangeSettings", strigRangeSettings);
    form.resetFields();
  };

  return (
    <div>
      <Form form={form} onFinish={onColorRangeFinish}>

        <Form.Item >
          <label style={{ color: "white", fontSize: 25 }} >Waterfall Color Range Settings</label>
        </Form.Item>

        <Form.Item label="Lowest Value" name="lowRange" >
          <Input placeholder='Enter Lowest Value' style={{ width: 200 }} />
        </Form.Item>

        <Form.Item label="Highest Value" name="highRange">
          <Input placeholder='Enter Highest Value' style={{ width: 200 }} />
        </Form.Item>

        <Form.Item>
          <Button type='default' htmlType="submit" style={{ width: 200 }}>
            Set Range
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}

export default WaterfallRangeSettings