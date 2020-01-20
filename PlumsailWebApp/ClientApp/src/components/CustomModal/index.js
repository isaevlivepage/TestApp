import React from 'react';
import { Row, Col, Modal, Button } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import customStyles from '../../utils/custom.less';

const CustomModal = React.memo(
  ({
    wrapClassName,
    title = undefined,
    footer = undefined,
    loading = false,
    visible = false,
    centered = false,
    maskClosable = true,
    destroyOnClose = true,
    width = 400,
    okType = 'primary',
    okText = 'Ok',
    okGhost = false,
    okHidden = false,
    okButtonProps = { disabled: false, form: undefined, htmlType: 'button' },
    cancelType = 'primary',
    cancelText = 'Cancel',
    cancelGhost = true,
    cancelHidden = false,
    cancelButtonProps = { disabled: false, form: undefined, htmlType: 'button' },
    onOk = _.noop,
    onCancel = _.noop,
    children,
  }) => {
    return (
      <Modal
        wrapClassName={classnames(customStyles.modal, wrapClassName)}
        title={title}
        width={width}
        visible={visible}
        footer={
          _.isUndefined(footer) ? (
            <Row gutter={16} type="flex" align="bottom" justify="space-between">
              {!cancelHidden && (
                <Col span={okHidden ? 24 : 12}>
                  <Button
                    key="back"
                    type={cancelType}
                    ghost={cancelGhost}
                    block
                    onClick={onCancel}
                    {...cancelButtonProps}
                  >
                    {cancelText}
                  </Button>
                </Col>
              )}
              {!okHidden && (
                <Col span={cancelHidden ? 24 : 12}>
                  <Button
                    key="submit"
                    type={okType}
                    ghost={okGhost}
                    block
                    loading={loading}
                    onClick={onOk}
                    {...okButtonProps}
                  >
                    {okText}
                  </Button>
                </Col>
              )}
            </Row>
          ) : null
        }
        onOk={onOk}
        onCancel={onCancel}
        centered={centered}
        maskClosable={maskClosable}
        destroyOnClose={destroyOnClose}
      >
        {children}
      </Modal>
    );
  }
);
export default CustomModal;
