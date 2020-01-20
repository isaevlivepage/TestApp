import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {connect} from 'dva';
import {Card, Row, Col, Button, Tooltip, Icon} from 'antd';

import ResumeTable from "@/pages/list/components/ResumeTable";
import CustomModal from '../../components/CustomModal/index';
import ResumeDetailModal from './components/ResumeDetailModal';

import resumeSelectors from '../../selectors/resume';

const {createResume} = resumeSelectors;

const Resumes = React.memo(({list, dispatch}) => {
  useEffect(() => {
    dispatch({type: 'resume/fetchList'});
  }, []);
  const INACTIVE = 0x00;
  const EDITABLE = 0x01;
  const REMOVABLE = 0x02;

  const [manageModeResume, setManageModeResume] = useState(INACTIVE);
  const [specialResumeId, setSpecialResumeId] = useState();

  const getResumeById = (id) => {
    return list.find(x => x.id === id);
  };

  const [specialResume, hasSpecialResume] = useMemo(() => {
    const resume = !_.isNil(specialResumeId)
      ? _.eq(specialResumeId, -1)
        ? createResume()
        : getResumeById(specialResumeId)
      : undefined;
    return [resume, !_.isNil(resume)];
  }, [specialResumeId]);

  // callback defines object and editing/etc manage mode
  const changeSpecialResumeId = useCallback((id = undefined, mode = INACTIVE) => {
    setSpecialResumeId(id);
    setManageModeResume(mode);
  });

  // callback defines object and enables editing manage mode
  const updateSpecialResumeId = useCallback((id = -1) => {
    changeSpecialResumeId(id, EDITABLE);
  });

  // callback defines object and enables removing manage mode
  const deleteSpecialResumeId = useCallback(id => {
    changeSpecialResumeId(id, REMOVABLE);
  });

  // callback resets defined object and editing/etc manage mode
  const cancelSpecialResumeId = useCallback(() => {
    changeSpecialResumeId();
  });


  // callback delete defined object
  const deleteSpecialResume = useCallback(async (id) => {
    await dispatch({type: 'resume/remove', payload: id});
    cancelSpecialResumeId();
  });

  const changeSpecialResume = useCallback(async (resume) => {
    await dispatch({ type: 'resume/save', payload: resume });
    cancelSpecialResumeId();
    return undefined;
  });

  const actionColumn = {
    title: 'Action',
    dataIndex: 'action',
    width: 90,
    fixed: 'right',
    render: (text, resume) => (
      <Row gutter={0} type="flex" align="bottom" justify="space-between">
        <Col span={12}>
          <Tooltip
            placement="bottomRight"
            title={'Edit'}
          >
            <Button
              type="link"
              onClick={() => updateSpecialResumeId(resume.id)}
            >
              <Icon type="edit" theme="filled"/>
            </Button>
          </Tooltip>
        </Col>
        <Col span={12}>
          <Tooltip
            placement="bottomRight"
            title={'Delete'}
          >
            <Button
              type="link"
              onClick={() => deleteSpecialResumeId(resume.id)}
            >
              <Icon type="delete" theme="filled"/>
            </Button>
          </Tooltip>
        </Col>
      </Row>
    ),
  };

  const buildTableTitle = () => {
    return (
      <Row gutter={16} type="flex" align="bottom" justify="space-between">
        <Col span={18}>
          <Button icon="plus" type="primary" onClick={() => updateSpecialResumeId()}>
            Add resume
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Card
        title={'Resume'}>
        <ResumeTable rows={list} title={buildTableTitle} actionColumn={actionColumn}/>
      </Card>

      <ResumeDetailModal
        visible={hasSpecialResume && Boolean(manageModeResume & EDITABLE)}
        editing={Boolean(manageModeResume & EDITABLE)}
        resume={specialResume}
        onOk={changeSpecialResume}
        onCancel={cancelSpecialResumeId}
      />

      <CustomModal
        title={'Delete'}
        visible={hasSpecialResume && Boolean(manageModeResume & REMOVABLE)}
        okText={'Delete'}
        okType="danger"
        onOk={() => deleteSpecialResume(specialResumeId)}
        onCancel={cancelSpecialResumeId}
      >
      </CustomModal>
    </div>
  );
});

function HookedResumes(props) {
  const { dispatch } = props;

  // load initial data
  useEffect(() => {
    _.attempt(async () => {
      await dispatch({type: 'resume/fetchAll'});
    });
  }, []);

  return <Resumes {...props}/>;
}

const ConnectedResumes = connect(
  ({
     resume,
   }) => ({
    list: resume.list
  })
)(HookedResumes);

export default Object.freeze(ConnectedResumes);
