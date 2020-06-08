import {getDeliveryMenuPrice, getDeliveryDistance} from '../utils/allFuncs';

const driverOrders = require('./mock/driverOrders.json');
const places = require('./mock/places');

test('배달 완료된 매출', () => {

  const res = getDeliveryMenuPrice(driverOrders);
  expect(res).toBe(129000);

});

test('오늘 이동한 거리', () => {
  const res = getDeliveryDistance(driverOrders, [58, 58], places);
  expect(res).toBe(140);
});