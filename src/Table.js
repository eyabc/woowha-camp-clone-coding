export default class Table {

  $target = null;
  $table = null;
  $thead = null;
  $tbody = null;

  constructor ($target) {
    this.$target = $target;

    const $table = document.createElement('table');
    this.$table = $table;
    this.$target.appendChild($table);

    const $thead = document.createElement('thead');
    this.$thead = $thead;
    $table.appendChild($thead);

    const $tbody = document.createElement('tbody');
    this.$tbody = $tbody;
    $table.appendChild($tbody);
  }

  createTableHeaders (headers, onClickHeader) {
    this.$thead.innerHTML = `
        <tr class="${ onClickHeader ? 'clickable' : '' }">
                ${ headers.map((header, index) =>
                    `<th data-index="${ index }">${ header }</th>`).join('') }
        </tr>
        `;

    if (onClickHeader) {
      this.$thead.addEventListener('click', evt => {
        const index = Number.parseInt(evt.target.dataset.index, 10);
        const field = evt.target.innerText;
        onClickHeader(index, field);
      });
    }
  }

  render (data, renderer, onClickRow) {
    this.$tbody.innerHTML = data.map(renderer).join('\n');
    if (onClickRow) {
      this.$tbody.querySelectorAll('tr')
        .forEach((tr, i) => {
          tr.classList.add('clickable');
          tr.addEventListener('click', () => onClickRow(data[i]));
        });
    }
  }
}