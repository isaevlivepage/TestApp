import React from 'react';
import { Table, Empty } from 'antd';
import _ from "lodash";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Placement",
    dataIndex: "placement",
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Experience",
    dataIndex: "experience",
  },
  {
    title: "IsRelocate",
    dataIndex: "isRelocate",
    render: (text, resume) => text.toString()
  },
  {
    title: "Position",
    dataIndex: "position",
  },
  {
    title: "CreateAt",
    dataIndex: "createAt",
  }
];

export default function ResumeTable({ rows, title, actionColumn }) {

  const cols = [
    ...columns,
    actionColumn
  ];

  return (
    _.isArray(rows)
      ? <Table
          columns={cols}
          dataSource={rows}
          title={title}
          rowKey={'id'}
          pagination={
            (rows.length > 10
              ? true
              : false)
          }
        />
      : <Empty/>)
}
