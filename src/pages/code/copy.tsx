import { Card, Typography } from 'antd';

interface IProps {
  codes: Array<string>;
}

const { Paragraph } = Typography;

export default function Copy(props: IProps) {
  const { codes } = props;

  return (
    <Card
      bordered={false}
      title={
        <Paragraph style={{ margin: 0 }} copyable={{ text: codes.join('\n') }}>
          复制所有
        </Paragraph>
      }
    >
      {codes.map((code) => (
        <Paragraph key={code} copyable={{ text: code }}>
          {code}
        </Paragraph>
      ))}
    </Card>
  );
}
