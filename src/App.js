import * as Data from './Data.js'
import Dashboard from './Dashboard.js'
import { sortByField } from './utils/allFuncs.js';

export default class App {
  $target = null
  $dashboard = null

  constructor($target) {
    this.$target = $target

    this.$dashboard = new Dashboard($target)

    this.fetchData();
  }

  fetchData() {
    const drivers = sortByField(Data.fetchDrivers(), 'name');
    const orders = Data.fetchOrders();
    const places = Data.fetchPlaces();

    this.$dashboard.setState({
      drivers, orders, places
    })
  }
}