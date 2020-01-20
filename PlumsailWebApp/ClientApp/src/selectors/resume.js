import moment from 'moment';
import _ from 'lodash';

const createResume = () => ({
  id: 0,
  name: '',
  placement: '',
  phone: '',
  email: '',
  experience: 0,
  isRelocate: false,
  position: '',
  createAt: moment().toISOString(false)
});

const normalizeMoment = value => {
  let normalizedValue = _.isNull(value) ? value : _.defaultTo(value, moment());
  if (!_.isNull(normalizedValue)) {
    normalizedValue = _.isObjectLike(normalizedValue) ? normalizedValue : moment(normalizedValue);
    if (!_.isFunction(normalizedValue.isValid) || !normalizedValue.isValid()) {
      normalizedValue = moment();
    }
  }
  return normalizedValue;
};

export default Object.freeze({
  createResume,
  normalizeMoment
});
