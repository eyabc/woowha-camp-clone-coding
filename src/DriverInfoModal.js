import Table from './Table.js';

export default class DriverInfoModal {
  $modal = null;
  $driverInfo = null;
  $orderTable = null;

  data = null;

  constructor ($target) {
    this.$target = $target;

    const $modal = document.createElement('div');
    $modal.className = 'modal hidden';
    $modal.addEventListener('click', evt => {
      if (evt.target.classList.contains('modal'))
        this.close();
    });
    this.$modal = $modal;
    $target.appendChild($modal);

    const $container = document.createElement('div');
    $container.className = 'container';
    $modal.appendChild($container);

    this.createHeader($container);
    this.createDriverInfo($container);
    this.createOrderTable($container);
  }

  close () {
    this.setState({
      visible: false,
    });
  }

  createHeader ($target) {
    const $header = document.createElement('header');
    $header.className = 'header';
    $header.innerHTML = `
      <h2>드라이버 상세</h2>
      <button class="close">x</button>      
    `;
    $header.querySelector('.close')
      .addEventListener('click', () => this.close());
    $target.appendChild($header);
  }

  createDriverInfo ($target) {
    const $driverInfo = document.createElement('div');
    $driverInfo.className = 'content-wrapper half';
    this.$driverInfo = $driverInfo;

    $target.appendChild($driverInfo);
  }

  createOrderTable ($target) {
    const $contentWrapper = document.createElement('section');
    $contentWrapper.className = 'content-wrapper';

    this.$orderTable = new Table($contentWrapper);

    this.$orderTable.createTableHeaders([
      '주문 접수',
      '식당 도착',
      '배달 완료',
      '상점명',
      '상점 좌표',
      '배달지 좌표',
      '가격',
      '상태',
    ]);
    $target.appendChild($contentWrapper);
  }

  setState (data) {
    this.data = data;
    this.render();
  }

  render () {
    if (this.data.visible) {

      const driver = this.data.driver;

      this.$driverInfo.innerHTML = `
        <h3>${ driver.name }</h3>
        <table>
            <tbody>
              <tr>
              <th>이동거리(예정포함)</th>
            <td>${ driver.todayDeliveryDistance }</td>
            </tr>
              <tr>
                <th>배달 매출(예정 포함)</th>
                <td>${ driver.todayDeliveryMenuPrice }</td>
              </tr>
            </tbody>
        </table>
      `;
      const orders = [
        ...driver.orders,
        ...driver.reservedOrders,
      ];
      this.$orderTable.render(orders, item => {
        return `
          <tr>
            <td>${item.orderedAt}</td>
            <td>${item.pickedUpAt ?? ''}</td>
            <td>${item.deliveredAt ?? ''}</td>
            <td>${item.placeName ?? ''}</td>
            <td>${item.placePosition ? item.placePosition.join(', ') : ''}</td>
            <td>${item.deliveryPosition.join(', ')}</td>
            <td>${item.price}</td>
            <td></td>
          </tr>
        `
      });

      this.$modal.classList.toggle('hidden', false);
    } else {
      this.$modal.classList.toggle('hidden', true);
    }
  }
}
