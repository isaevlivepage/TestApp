import React, { useState, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Spin } from 'antd';

import CustomModal from '../../../components/CustomModal';
import ResumeDetailForm from './ResumeDetailForm';

const WorkerDetailModal = React.memo(
  ({
    wrapClassName,
    visible = false,
    editing = false,
    resume,
    onOk = _.noop,
    onCancel = _.noop,
  }) => {
    const key = useMemo(() => _.get(resume, 'ID'), [resume]);
    const isCreated = useMemo(() => _.gt(_.get(resume, 'ID'), 0), [resume]);

    const [formIsSubmitted, setFormIsSubmitted] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);
    const changeHasErrors = useCallback(invalid => {
      setHasErrors(invalid);
    }, []);

    return (
      <CustomModal
        wrapClassName={wrapClassName}
        title={
          isCreated
            ? 'Update'
            : 'Add'
        }
        visible={visible}
        okText={'Save'}
        okButtonProps={{
          disabled: hasErrors || formIsSubmitted,
          form: 'resume_form',
          htmlType: 'submit',
        }}
        cancelButtonProps={{ disabled: formIsSubmitted }}
        onCancel={onCancel}
      >
        <div key={key}>
          <Spin spinning={formIsSubmitted}>
            <ResumeDetailForm
              id="resume_form"
              editing={editing}
              resume={resume}
              onChange={onOk}
              onError={changeHasErrors}
              setFormIsSubmitted={setFormIsSubmitted}
            />
          </Spin>
        </div>
      </CustomModal>
    );
  }
);

export default WorkerDetailModal;
