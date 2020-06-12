const getMillisecondTime = (timeArr) => {
  const Y = new Date().getFullYear();
  const M = new Date().getMonth() + 1;
  const D = new Date().getDate();

  return timeArr.map(time => +new Date(`${ Y }-${ M }-${ D } ${ time }`));
};

const booleanValidPrice = (orderedAt, deliveredAt) => {
  // 1000ms(1초) * 60(1분) * 60(1시간)
  const oneHour = 1000 * 60 * 60;
  return deliveredAt - orderedAt <= oneHour;
};

const getDeliveryMenuPrice = (driverOrders) => {
  return driverOrders.reduce((sum, order) => {
    if (order.deliveredAt.length === 0) return sum;
    const [orderedAt, deliveredAt] = getMillisecondTime([order.orderedAt, order.deliveredAt]);
    const check = booleanValidPrice(orderedAt, deliveredAt);
    return sum + (check * order.price);
  }, 0);
};

const getPlaceById = (places, placeId) => places.find(place => place.id === placeId);

const getDist = (A, B) => Math.abs(A[0] - B[0]) + Math.abs(A[1] - B[1]);

const getDeliveryDistance = (driverOrders, driverPosData, places) => {

  return driverOrders.reduce(([driverPos, sum], order) => {

    const { placeId, deliveryPosition, pickedUpAt, deliveredAt } = order;
    const place = getPlaceById(places, placeId);

    const placePos = place.position,
      deliveryPos = deliveryPosition;

    const driverToPlace = pickedUpAt.length,
      placeToDelivery = deliveredAt.length;

    if (driverToPlace) {
      sum += getDist(driverPos, placePos);

      if (placeToDelivery)
        return [deliveryPos, sum + getDist(placePos, deliveryPos)];

      return [driverPosData, sum + getDist(placePos, driverPosData)];
    }
    return [driverPos, sum + getDist(driverPosData, driverPos)];
  }, [[56, 56], 0])[1];
};

const sortByField = (drivers, field, isDescending) => {
  const toggle = isDescending ? -1 : 1;
  const newDrivers = [...drivers];
  const Infinity = '24590000000000000000000';

  newDrivers.sort((a, b) => {
    let A = a[field], B = b[field];
    if (!isDescending) {
      if (!A) A = Infinity;
      if (!B) B = Infinity;
    }
    return (A > B ? 1 : A < B ? -1 : 0) * toggle;
  });
  return newDrivers;
};

const getLSSortBase = () => {
  let res = JSON.parse(localStorage.getItem('sortBase'));
  if (!res) {
    res = { field: '이름', isDescending: false };
    localStorage.setItem('sortBase', JSON.stringify(res));
  }
  return res;
};

const setLSSortBase = (newField) => {
  const { field, isDescending } = getLSSortBase();
  let res;
  res = field === newField ?
    { field, isDescending: !isDescending }
    : { field: newField, isDescending: false };

  localStorage.setItem('sortBase',JSON.stringify(res));
  return res;
};


export { getDeliveryMenuPrice, getDeliveryDistance, sortByField, getLSSortBase, setLSSortBase };