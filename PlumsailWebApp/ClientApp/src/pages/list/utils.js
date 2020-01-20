import { message } from 'antd';
import _ from 'lodash';

// function getBase64(img, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

export function getBase64(file) {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', error => reject(error));
    reader.readAsDataURL(file);
  });
}

export function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!');
  }
  return isJpgOrPng && isLt5M;
}

export const formLayoutFactory = (layout = undefined) => {
  const formLayout = _.defaultTo(layout, 'vertical');
  const formItemLayout = _.eq(formLayout, 'horizontal')
    ? {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      }
    : null;
  const switchItemLayout = _.eq(formLayout, 'horizontal')
    ? {
        labelCol: { span: 18 },
        wrapperCol: { span: 6 },
      }
    : null;
  const buttonItemLayout = _.eq(formLayout, 'horizontal')
    ? {
        wrapperCol: { span: 16, offset: 8 },
      }
    : null;
  return { formLayout, formItemLayout, switchItemLayout, buttonItemLayout };
};
