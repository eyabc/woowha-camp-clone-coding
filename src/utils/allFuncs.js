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

const getPlaceById = (places, placeId) => {
  return places.find(place => place.id === placeId);
};

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

export { getDeliveryMenuPrice, getDeliveryDistance };