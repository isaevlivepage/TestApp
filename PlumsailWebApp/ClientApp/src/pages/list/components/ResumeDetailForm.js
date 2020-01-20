import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {
  Row,
  Col,
  Icon,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  notification,
  Switch
} from 'antd';
import _ from 'lodash';

import resumeSelectors from '../../../selectors/resume';
import InputNumberWithButton from '../../../components/CustomFormElems/InputNumberWithButton/Index';
import useLockingPool from '../../../hooks/useLockingPool';
import {formLayoutFactory, getBase64, beforeUpload} from '../utils';
import styles from './ResumeDetailForm.less';
import customStyles from './custom.less';

const { normalizeMoment } = resumeSelectors;
const { Item } = Form;
const { Option } = Select;

const positions = ["developer", "manager", "designer"];

const ResumeDetailForm = Form.create({
  name: 'resume',
})(
  ({
     id,
     form,
     editing = false,
     resume = _.stubObject(),
     onChange = _.noop,
     onError = _.noop,
     setFormIsSubmitted,
   }) => {
    const containerRef = useRef(null);
    const {getFieldDecorator, getFieldsError} = form;
    const [isLocked, lock, unlock] = useLockingPool();

    const [photo, setPhoto] = useState(!_.isEmpty(resume.photoBase64) ? resume.photoBase64 : '');
    const onUploadPhoto = useCallback(async data => {
      const url = await getBase64(data.file.originFileObj);
      setPhoto(url);
      // eslint-disable-next-line
      resume.PhotoBase64 = url;
      unlock('form_uploading');
    }, []);

    const hasErrors = useMemo(() => {
      const fieldsError = getFieldsError();
      return _.keys(fieldsError).some(field => fieldsError[field]);
    });

    const doSubmit = useCallback(async event => {
      event.preventDefault();
      setFormIsSubmitted(true);
      if (isLocked || !editing) {
        return;
      }

      lock('form_apply');
      await form.validateFieldsAndScroll(async (errors, partialResume) => {
        if (!_.isNil(errors) && !_.isEmpty(errors)) {
          notification.error({message: 'Error'});
          unlock('form_apply');
          setFormIsSubmitted(false);
          return;
        }

        // подставляем фотографию
        if (!_.isEmpty(partialResume.photoBase64) && _.isObject(partialResume.photoBase64)) {
          // eslint-disable-next-line
          partialResume.photoBase64 = await getBase64(partialResume.photoBase64.originFileObj);
        }

        onChange(_.assign(resume, partialResume));
        unlock('form_apply');
      });
    });

    useEffect(() => {
      if (hasErrors) {
        onError(true, getFieldsError());
      } else {
        onError(false, null);
      }
    }, [hasErrors]);

    useEffect(() => {
      return () => {
        // при закрытии формы сброс блокировок кнопок модального окна
        setFormIsSubmitted(false);
      };
    }, []);

    const {formLayout, formItemLayout} = formLayoutFactory();
    return (
      <div ref={containerRef}>
        <Form
          id={id}
          className={customStyles.form}
          onSubmit={doSubmit}
          layout={formLayout}
          labelAlign="right"
          hideRequiredMark
        >
          <div className={customStyles['content-wrap']}>
            <Row>
              <Item>
                {getFieldDecorator('photoBase64', {
                  valuePropName: 'fileList',
                  getValueFromEvent: data => {
                    if (Array.isArray(data)) {
                      return [0];
                    }
                    if (data === undefined) {
                      return data;
                    }
                    return data.file;
                  },
                  getValueProps: data => {
                    if (_.isArray(data) && !_.isEmpty(data)) {
                      return data[0];
                    }
                    if (data === undefined) {
                      return data;
                    }
                    return data.file;
                  },
                })(
                  <Upload
                    className={styles['photo-upload']}
                    disabled={isLocked || !editing}
                    name="Photo"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={onUploadPhoto}
                  >
                    <div
                      className={styles['photo-frame']}
                      style={{
                        backgroundImage: !_.isEmpty(photo) ? `url(${photo})` : 'none',
                      }}
                    >
                      <div className={styles['photo-frame-downline']}>
                        <Icon type="camera" theme="filled"/>
                      </div>
                    </div>
                  </Upload>
                )}
              </Item>
            </Row>
            <Row>
              <Item
                label={'Name'}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: 'Is required',
                    },
                  ],
                  initialValue: resume.name,
                })(<Input disabled={!editing}/>)}
              </Item>
            </Row>
            <Row>
              <Item
                label={'Placement'}
                colon={false}
                {...formItemLayout}
              >
                {getFieldDecorator('placement', {
                  rules: [
                    {
                      required: true,
                      message: 'Is required',
                    },
                  ],
                  initialValue: resume.placement,
                })(<Input disabled={!editing}/>)}
              </Item>
            </Row>
            <Row>
              <Col span={12}>
                <Item
                  label={'Experience'}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('experience', {
                    initialValue: resume.experience,
                  })(
                    <InputNumberWithButton
                      min={0}
                      max={99}
                      disabled={!editing}
                      bordered
                    />
                  )}
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  label={'Position'}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('position', {
                    rules: [
                      {
                        required: true,
                        message: 'Is required',
                      },
                    ],
                    initialValue: resume.position,
                  })(
                    <Select
                      disabled={!editing}
                      getPopupContainer={triggerNode =>
                        _.defaultTo(containerRef.current, triggerNode)
                      }
                      defaultActiveFirstOption
                    >
                      {_.map(positions, position => (
                        <Option key={position} value={position}>
                          {position}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item
                  key="createAt"
                  label={'CreateAt'}
                  colon={false}
                >
                  {getFieldDecorator('dtAccept', {
                    initialValue: normalizeMoment(resume.createAt),
                    normalize: value => normalizeMoment(value),
                  })(<DatePicker format="L" disabled={!editing}/>)}
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  label={'Is relocate'}
                  colon={false}
                  labelAlign="left"
                  style={{marginBottom: 0}}
                >
                  {getFieldDecorator('isRelocate', {
                    initialValue: resume.isRelocate,
                    valuePropName: 'checked',
                    normalize(value) {
                      return Boolean(value);
                    },
                  })(<Switch disabled={!editing}/>)}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Item
                  label={'Phone'}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('Phone', {
                    initialValue: resume.phone,
                  })(
                    <Input
                      suffix={<Icon type="phone" theme="filled"/>}
                      disabled={!editing}
                    />
                  )}
                </Item>
              </Col>
              <Col span={12}>
                <Item
                  label={'EMail'}
                  colon={false}
                  {...formItemLayout}
                >
                  {getFieldDecorator('email', {
                    initialValue: resume.email,
                  })(
                    <Input
                      suffix={<Icon type="mail" theme="filled"/>}
                      disabled={!editing}
                    />
                  )}
                </Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
);

export default ResumeDetailForm;
