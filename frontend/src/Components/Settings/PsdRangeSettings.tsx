import { Button, Form, Input, Typography } from 'antd';
import * as d3 from 'd3';


const PsdRangeSettings = ({ spectralWaterfallData, setMinValue, setMaxValue }: any) => {
  const { Title } = Typography;
  const [form] = Form.useForm();

  const allValues: number[] = spectralWaterfallData.psd.flat();

  const min: number = d3.min(allValues) ?? -Infinity;
  const max: number = d3.max(allValues) ?? Infinity;




  const validateMinimumValue = (rule: any, value: any) => {
    if (value < min) {
      return Promise.reject(new Error(`Minimum value cannot be less than ${min}`));
    }
    if (value > max) {
      return Promise.reject(new Error(`Minimum value cannot be greater than ${max}`));
    }
    return Promise.resolve();
  };

  const validateMaximumValue = (rule: any, value: any) => {
    if (value < min) {
      return Promise.reject(new Error(`Maximum value cannot be less than ${min}`));
    }
    if (value > max) {
      return Promise.reject(new Error(`Maximum value cannot be greater than ${max}`));
    }
    return Promise.resolve();
  };

  const validateRange = (rule: any, value: any) => {
    const minimumValue = form.getFieldValue('minimumValue');
    if (minimumValue !== undefined && value <= minimumValue) {
      return Promise.reject(new Error('Maximum value must be greater than minimum value'));
    }
    return Promise.resolve();
  };

  const onSave = (values: Record<string, string>) => {
    const minimum: number = values.minimumValue ? parseInt(values.minimumValue) : min;
    const maximum: number = values.maximumValue ? parseInt(values.maximumValue) : max;
    setMinValue(minimum)
    setMaxValue(maximum)
    form.resetFields();
  };

  return (
    <div>
      <Form form={form} onFinish={onSave}>
        {/* <Form.Item>
          <Title style={{ color: "white", fontSize: 25 }}>PSD Range Settings</Title>
        </Form.Item> */}

        <Form.Item
          name="minimumValue"
          rules={[
            { validator: validateMinimumValue }
          ]}
        >
          <Input placeholder={`Enter minimum value between ${min} and ${max}`} />
        </Form.Item>

        <Form.Item
          name="maximumValue"
          rules={[
            { validator: validateMaximumValue },
            { validator: validateRange }
          ]}
        >
          <Input placeholder={`Enter maximum value between ${min} and ${max}`} />
        </Form.Item>

        <Form.Item>
          <Button type="default" htmlType="submit" style={{ width: 200 }}>
            Apply
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default PsdRangeSettings;
