export default class Dashboard {
  $target = null
  $driverTable = null
  $driverTableSortInfo = null
  $driverInfoModal = null

  data = {
    drivers: [],
    orders: [],
    places: [],
  }
  driverData = []

  setState(data) {
    this.data = data
    this.render()
  }
  render() {

  }
}