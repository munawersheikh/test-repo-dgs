import { Button, Form, Input, Typography } from 'antd'
import Cookies from 'js-cookie';



const WaterfallSettings = () => {
  const { Title } = Typography;
  const [form] = Form.useForm();

  const onSetDivisionFinish = (values: Record<string, string>) => {
    const numberOfDivisions: number = values.divisions ? parseInt(values.divisions) : 2;
    const divisionsSetting = { divisions: numberOfDivisions };
    const stringDivisionsSetting = JSON.stringify(divisionsSetting);
    Cookies.set("WaterfallColorDivisionSetting", stringDivisionsSetting);
    form.resetFields();
  };
  return (
    <div>
      <Form form={form} onFinish={onSetDivisionFinish}>

        <Form.Item >
          <Title style={{ color: "white", fontSize: 25 }} >Waterfall Color Divisions Settings</Title>
        </Form.Item>

        <Form.Item name="divisions" >
          <Input placeholder='Enter number of divisions' style={{ width: 200 }} />
        </Form.Item>

        <Form.Item>
          <Button type='default' htmlType="submit" style={{ width: 200 }}>
            Set Divisions
          </Button>
        </Form.Item>


      </Form>
    </div>
  );

}

export default WaterfallSettings