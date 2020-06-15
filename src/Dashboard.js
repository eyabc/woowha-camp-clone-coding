import { validateAllocatedOrders } from './utils/validator.js';
import Table from './Table.js';
import DriverInfoModal from './DriverInfoModal.js';
import {
  getDeliveryMenuPrice,
  getDeliveryDistance,
  sortByField,
  getLSSortBase,
  setLSSortBase,
  getPlaceById,
} from './utils/allFuncs.js';

import { driverTableHeaders } from './utils/const.js';


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

  sortBase = {};

  constructor ($target) {
    this.$target = $target;
    this.sortBase = getLSSortBase();
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
          driver.reservedOrders.push(this.setPlaceOfOrder(order));
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

  setSortBase (data) {
    this.sortBase = data;
    this.renderSortInfo();
  }

  createDriverTable ($target) {

    function handleHeaderClick (index, header) {
      const { field, isDescending } = setLSSortBase(header);
      const sorted = sortByField(this.driverData, driverTableHeaders[field], isDescending);

      this.setDriverData(sorted);
      this.setSortBase({ field, isDescending });
    }

    const $container = document.createElement('div');
    $container.className = 'display-flex justify-end';
    this.$driverTableSortInfo = $container;

    this.renderSortInfo(this.sortBase.field, this.sortBase.isDescending);
    $target.appendChild($container);

    this.$driverTable = new Table($target);
    this.$driverTable.createTableHeaders(Object.keys(driverTableHeaders), handleHeaderClick.bind(this));

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
      driverInfo.orders = driverOrders.map(order => this.setPlaceOfOrder(order));

      aggregateDriverData.push(driverInfo);
    });
    this.driverData = sortByField(aggregateDriverData, driverTableHeaders[this.sortBase.field], this.sortBase.isDescending)
  }

  setPlaceOfOrder (order) {
    const placeInfo = getPlaceById(this.data.places, order.placeId);
    order.placeName = placeInfo.name;
    order.placePosition = placeInfo.position;
    order.status = order.pickedUpAt.length ?
      order.deliveredAt.length ? '배달 완료' : '배달 중'
      : '배달 예정';
    return order;
  }

  renderSortInfo () {
    const { field, isDescending } = this.sortBase;
    const sort = isDescending ? '내림차순' : '오름차순';
    this.$driverTableSortInfo.innerHTML = `
            <span>정렬: ${ field }(${ sort })</span>
        `;
  }

  setState (data) {
    this.data = data;
    this.aggregateDriverData();
    this.render();
  }


  setDriverData (driverData) {
    this.driverData = driverData;
    this.render();
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