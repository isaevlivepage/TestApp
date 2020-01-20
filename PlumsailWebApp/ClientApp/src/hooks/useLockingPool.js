import { useCallback, useReducer } from 'react';
import _ from 'lodash';

const initialState = { isLocked: false, lockedKeys: [], lockingPool: 0 };

function reducer(state, action) {
  let isLocked;
  let lockedKeys;
  let lockingPool;
  switch (action.type) {
    case 'lock':
      if (!_.isNil(action.payload) && _.includes(state.lockedKeys, action.payload)) {
        return state;
      }

      if (!_.isNil(action.payload) && !_.includes(state.lockedKeys, action.payload)) {
        lockedKeys = [...state.lockedKeys, action.payload];
      } else {
        lockedKeys = [...state.lockedKeys];
      }

      lockingPool = state.lockingPool + 1;
      isLocked = _.gt(lockingPool, 0);

      return { isLocked, lockedKeys, lockingPool };
    case 'unlock':
      if (_.lte(state.lockingPool, 0)) {
        return state;
      }

      if (!_.isNil(action.payload) && !_.includes(state.lockedKeys, action.payload)) {
        return state;
      }

      if (!_.isNil(action.payload) && _.includes(state.lockedKeys, action.payload)) {
        lockedKeys = _.filter(state.lockedKeys, key => !_.isEqual(key, action.payload));
      } else {
        lockedKeys = [...state.lockedKeys];
      }

      lockingPool = state.lockingPool - 1;
      isLocked = _.gt(lockingPool, 0);

      return { isLocked, lockedKeys, lockingPool };
    default:
      throw new Error();
  }
}

function useLockingPool() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const lock = useCallback((key = undefined) => {
    dispatch({ type: 'lock', payload: key });
  }, []);

  const unlock = useCallback((key = undefined) => {
    dispatch({ type: 'unlock', payload: key });
  }, []);

  return [state.isLocked, lock, unlock];
}

export default useLockingPool;
