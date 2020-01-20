import { useCallback } from 'react';
import _ from 'lodash';

function useDebounceCallback(callback, wait = undefined, deps = []) {
  const nWait = _.defaultTo(_.toNumber(wait), 300);
  return useCallback(_.debounce(callback, nWait), [nWait, ...deps]);
}

export default useDebounceCallback;
