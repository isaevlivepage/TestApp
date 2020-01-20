import React, { forwardRef } from 'react';
import { Slider, InputNumber } from 'antd';
import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
const SliderWithInput = ({ ...rest }, ref) => {
  const { onChange, value } = rest;

  const sliderTooltipFormatter = val => parseInt(String(val * 100), 10);

  const inputFormatter = val => `${parseInt(String(val * 100), 10)}%`;

  return (
    <div className={styles.SliderWithInput}>
      <Slider
        className={styles.Slider}
        tipFormatter={sliderTooltipFormatter}
        min={0}
        max={1}
        step={0.01}
        onChange={onChange}
        value={value}
      />
      <InputNumber
        className={styles.Input}
        formatter={inputFormatter}
        min={0}
        max={1}
        step={0.01}
        {...rest}
      />
    </div>
  );
};

export default forwardRef(SliderWithInput);
