import React, { useEffect, useState, useCallback, forwardRef } from 'react';
import { Button, InputNumber } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './Index.less';

// eslint-disable-next-line no-unused-vars
const InputNumberWithButton = ({ className, bordered = false, ...rest }, ref) => {
  const { onChange, value, min = -Infinity, max = Infinity, step = 1, disabled, maxDisable } = rest;

  const [currentValue, setCurrentValue] = useState(value);
  const [isIncrease, setIsIncrease] = useState(false);
  const [isDecrease, setIsDecrease] = useState(false);

  const [disabledMin, setDisabledMin] = useState(disabled);
  const [disabledMax, setDisabledMax] = useState(disabled);
  const [disabledInput, setDisabledInput] = useState(disabled);

  const updateValue = useCallback(
    _.debounce(rawValue => {
      if (_.isFunction(onChange)) {
        onChange(rawValue);
      }
    }, 500),
    []
  );

  // Используем локальное значение и
  // вызываем обработчик с задержкой,
  // т.к. getFieldDecorator не успевает
  // выполнить ре-рендер с новым значением
  const changeValue = useCallback(rawValue => {
    setCurrentValue(rawValue);
    updateValue(rawValue);
  }, []);

  const adjustValue = useCallback(
    _.debounce(rawValue => {
      changeValue(rawValue);
    }, 100),
    []
  );

  const doIncrease = useCallback(() => {
    setIsIncrease(true);
    setIsDecrease(false);
  }, []);

  const doDecrease = useCallback(() => {
    setIsIncrease(false);
    setIsDecrease(true);
  }, []);

  const doDiscontinue = useCallback(() => {
    setIsIncrease(false);
    setIsDecrease(false);
  }, []);

  const doChange = useCallback(rawValue => {
    doDiscontinue();
    changeValue(rawValue);
  }, []);

  useEffect(() => {
    if (!_.isEqual(currentValue, value)) {
      setCurrentValue(value);
    }
  }, [value]);

  useEffect(() => {
    setDisabledInput(disabled);
  }, [disabled]);

  useEffect(() => {
    if (isIncrease && _.lt(currentValue, max)) {
      const increaseValue = Math.min(currentValue + _.defaultTo(_.toNumber(step), 1), max);
      adjustValue(increaseValue);
    } else if (isDecrease && _.gt(currentValue, min)) {
      const decreaseValue = Math.max(currentValue - _.defaultTo(_.toNumber(step), 1), min);
      adjustValue(decreaseValue);
    }

    if (_.lte(currentValue, min)) {
      setDisabledMin(true);
    } else {
      setDisabledMin(false);
    }

    if (_.gte(currentValue, max)) {
      setDisabledMax(true);
    } else {
      setDisabledMax(false);
    }
  }, [isIncrease, isDecrease, currentValue, min, max, step]);

  useEffect(() => {
    return () => {
      doDiscontinue();
    };
  }, []);

  return (
    <div
      className={classnames(
        styles.InputNumberWithButton,
        bordered ? styles.bordered : undefined,
        className
      )}
    >
      <Button
        disabled={disabledMin || disabledInput}
        className={styles.ButtonMinus}
        icon="minus"
        onMouseDown={doDecrease}
        onMouseUp={doDiscontinue}
        onMouseLeave={doDiscontinue}
      />

      <InputNumber
        {...rest}
        ref={ref}
        className={styles.Input}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        disabled={disabledInput}
        onChange={doChange}
      />

      <Button
        disabled={disabledMax || disabledInput || maxDisable}
        className={styles.ButtonPlus}
        icon="plus"
        onMouseDown={doIncrease}
        onMouseUp={doDiscontinue}
        onMouseLeave={doDiscontinue}
      />
    </div>
  );
};

export default forwardRef(InputNumberWithButton);
