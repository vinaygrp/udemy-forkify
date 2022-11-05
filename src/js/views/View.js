import icons from 'url:../../img/icons.svg';

// GOing to be used as parent class
export default class View {
  _data;

  /**
   * Renders the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. Recipe)
   * @param {boolean} [render=true] If false create markup strings instead of rendering to the DOM
   * @returns {undefined | string} only in case of error which renders the error
   * @this {Object} View instance
   * @author Vinay Gupta
   * @todo Finish implmenetation
   */
  render(data, render = true) {
    // Guard Clause
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // console.error('ERROR');
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update the existing item in the DOM without reloading
   * @param {Array} data
   * @returns
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];

      // Update changed if TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  /**
   * renderSpinner: adds spinner to the sections that is being fetched.
   */
  renderSpinner = function () {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  /**
   * renderError: Rendering error on the UI
   * @param {String} message if the message is undefined then Static message will take over.
   */
  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * renderMessage: will render the UI elements in frontend.
   * @param {String} message
   */
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Documentation protected method _clear()
   * This clears the HTML elements in the sections.
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
