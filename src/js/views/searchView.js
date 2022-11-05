class SearchView {
  _parentElement = document.querySelector('.search');

  // Get and return the Search field value.
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  // PUBLISHER-SUBSCRIBER PATTERN
  addHandlerRender(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
