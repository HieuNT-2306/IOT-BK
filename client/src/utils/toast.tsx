import {ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

export const toastSuccess = (content: string) => {
  message.success({
    content,
    icon: <CheckCircleOutlined color='#25fa25' />,
  });
};

export const toastError = (content: string) => {
  message.error({
    content,
    icon: <ExclamationCircleOutlined color='#f03a2e' />,
  });
};

export const toastWarning = (content: string) => {
  message.warning({
    content,
    // duration: 10000000,
    // icon: <IconTickMessage />,
  });
};