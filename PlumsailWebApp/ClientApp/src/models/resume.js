import services from '@/services/resume';
import _ from 'lodash';

const { queryList, queryItem, insertItem, updateItem, removeItem } = services;

export default {
  state: {
    list: [],
    current: {},
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetch({ payload: id }, { call, put }) {
      const response = yield call(queryItem);
      yield put({
        type: 'save',
        payload: _.isObject(response) ? response : {},
      });
    },
    *save({ payload: item}, { call, put }) {

      const id = _.defaultTo(_.toNumber(_.get(item, 'id')), 0);
      let response;

      if (_.eq(id, 0)) {
        response = yield call(insertItem, item);
        if (!_.isEmpty(response)) {
          yield put({ type: 'insert', payload: response });
        }
      } else {
        response = yield call(updateItem, item);
        if (!_.isEmpty(response)) {
          yield put({ type: 'update', payload: response });
        }
      }
    },
    *remove({ payload: id }, { call, put }) {
      const response = yield call(removeItem, id);
      if (response) {
        yield put({ type: 'delete', payload: id });
      }
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
    update(state, { payload: item }) {
      const list = _.map(state.list, item =>
        !_.eq(_.toNumber(item.id), _.toNumber(item.id)) ? item : item
      );
      return {
        ...state,
        list,
      };
    },
    insert(state, { payload: item }) {
      return { ...state, list: [...state.list, item] };
    },
    delete(state, { payload: id }) {
      const list = _.filter(state.list, item => !_.eq(_.toNumber(item.id), _.toNumber(id)));
      return {
        ...state,
        list,
      };
    },
  },
};
