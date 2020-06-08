import { validateAllocatedOrders } from './utils/validator.js';
import Table from './Table.js';
import DriverInfoModal from './DriverInfoModal.js';
import { getDeliveryMenuPrice, getDeliveryDistance } from './utils/allFuncs.js';

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
    this.createDriverTable($target);
    this.createModals($target);
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

  createDriverTable ($target) {
    const driverTableHeaders = [
      '이름',
      '첫 배달 접수 시간',
      '배달 완료된 매출',
      '오늘 이동한 거리',
      '이후 배달 일정',
    ];

    function handleHeaderClick (index) {
      alert(driverTableHeaders[index]);
    }

    const $container = document.createElement('div');
    $container.className = 'display-flex justify-end';
    this.$driverTableSortInfo = $container;

    this.renderSortInfo(driverTableHeaders[0], false);

    this.$driverTable = new Table($target);
    this.$driverTable.createTableHeaders(driverTableHeaders, handleHeaderClick);

  }

  createModals ($target) {
    this.$driverInfoModal = new DriverInfoModal($target);
  }

  createTextArea ($target) {
    const $textArea = document.createElement('TEXTAREA', { id: 'result' });
    $target.appendChild($textArea);
  }


  aggregateDriverData () {
    const aggregateDriverData = [];

    this.data.drivers.forEach(driver => {
      const driverOrders = this.data.orders
        .filter(order => order.driverId === driver.id);
      const firstOrderedAt = driverOrders.length ? driverOrders[0].orderedAt : '';
      const todayDeliveryMenuPrice = getDeliveryMenuPrice(driverOrders);
      const todayDeliveryDistance = getDeliveryDistance(driverOrders, driver.position, this.data.places);
      const driverInfo = {
        id: driver.id,
        name: driver.name,
        firstOrderedAt,
        todayDeliveryMenuPrice,
        todayDeliveryDistance,
        reservedOrders: [],
        orders: [],
      };
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

  renderSortInfo (header, isDescending) {
    const sort = isDescending ? '내림차순' : '오름차순';
    this.$driverTableSortInfo.innerHTML = `
      <span>정렬: ${ header }(${ sort })</span>
    `;
  }

  render () {
    function handleDriverClick (item) {
      this.$driverInfoModal.setState({
        visible: true,
        places: this.data.places,
        driver: item,
      });
    }

    this.$driverTable.render(this.driverData, item => {
      const reservedOrderCount = item.reservedOrders.length;
      return `
        <tr>
            <td>${ item.name }</td>
            <td>${ item.firstOrderedAt }</td>
            <td>${ item.todayDeliveryMenuPrice }</td>
            <td>${ item.todayDeliveryDistance }</td>
            <td>${ reservedOrderCount > 0
        ? `${ reservedOrderCount }개 오더 수행 예정`
        : `이후 배달 일정이 없습니다.` }
            </td>
        </tr>
      `;
    }, handleDriverClick.bind(this));
  }
}