import { getDeliveryMenuPrice, getDeliveryDistance, sortByField } from '../utils/allFuncs';

const driverOrders = require('./mock/driverOrders.json');
const places = require('./mock/places');
const drivers = require('./mock/drivers')

test('배달 완료된 매출', () => {

  const res = getDeliveryMenuPrice(driverOrders);
  expect(res).toBe(129000);

});

test('오늘 이동한 거리', () => {
  const res = getDeliveryDistance(driverOrders, [58, 58], places);
  expect(res).toBe(140);
});

test('드라이버 이름 오름차순 정렬', () => {
  const res =  sortByField(drivers, 'name')[0].name;
  expect(res).toBe('강다인')
});