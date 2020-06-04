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

  constructor ($target) {
    this.$target = $target;
    this.createHeader($target);
    this.createAllocationButton($target);
    this.createTextArea($target);
  }

  createHeader ($target) {
    const $h1 = document.createElement('h1');
    $h1.innerText = '드라이버 현황 페이지';

    $target.appendChild($h1);
  }

  createAllocationButton ($target) {

    function handleAllocateClick () {

      // TODO: 배차 로직 구현 부분
      const getNextDriver = (driverData => {
        let i = 0;
        return () => driverData[i++ % driverData.length];
      })(this.driverData);


      // Example) 순차 배차
      this.data.orders
        .filter(order => !order.driverId)
        .forEach(order => {
          const driver = getNextDriver();
          driver.reservedOrders.push(order);
        });

      /*
      * 채점용 코드입니다. 여기부터
      * */

      const checkOrders = validateAllocatedOrders(this.driverData, this.data.orders);
      if (!checkOrders) {
        alert('모든 주문이 하나씩 배차되어야 합니다.');
        return;
      }

      let textArea = document.getElementsByTagName('TEXTAREA')[0];
      const driverDataJson = JSON.stringify(this.driverData);
      textArea.value = driverDataJson;
      textArea.select();
      document.execCommand('copy');
      console.log(textArea.value);

      this.render();
      /*
      * 여기까지 코드를 수정하지 마세요 */
      alert('배차 결과 예상 무료 제공 매출은 000000원 입니다.');

    };

    const $container = document.createElement('section');
    $container.className = 'display-flex justify-end';

    const $buttonAllocate = document.createElement('button');
    $buttonAllocate.innerText = '배차하기';
    $buttonAllocate.addEventListener('click', handleAllocateClick.bind(this));
    $container.appendChild($buttonAllocate);

    $target.appendChild($container);
  }

  createTextArea ($target) {
    const $textArea = document.createElement('TEXTAREA', { id: 'result' });
    $target.appendChild($textArea);
  }

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