import React from 'react';
import { Collapse } from 'antd';

const CollapseC = ({ items }) => {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <Collapse 
      items={items}
      defaultActiveKey={items.length > 0 ? [items[0].key] : []}
      onChange={onChange}
      bordered={false}
      className="custom-collapse"
    />
  );
};

export default CollapseC;