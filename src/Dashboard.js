import { validateAllocatedOrders } from './utils/validator.js';

export default class Dashboard {
  $target = null;
  $driverTable = null;
  $driverTableSortInfo = null;
  $driverInfoModal = null;

  data = {
    drivers: [],
    orders: [],
    places: [],
  };
  driverData = [];


  aggregateDriverData () {
    const aggregateDriverData = [];

    this.data.drivers.forEach(driver => {
      const driverInfo = {
        id: driver.id,
        name: driver.name,
        firstOrderedAt: '',
        todayDeliveryMenuPrice: 0,
        todayDeliveryDistance: 0,
        reservedOrders: [],
        orders: [],
      };
      const driverOrders = this.data.orders
        .filter(order => order.driverId === driver.id);
      driverInfo.orders = driverOrders;

      aggregateDriverData.push(driverInfo);
    });
    this.driverData = aggregateDriverData;
  }

  setState (data) {
    this.data = data;
    this.aggregateDriverData();
    this.render();
  }

  render () {

  }
}