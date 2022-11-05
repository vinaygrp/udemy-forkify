import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // PUBLISHER-SUBSCRIBER PATTERN
  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // Event delegation
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      //   console.log('gotopage:', goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    // Scenarios:
    // Page 1, and there are other pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkUpPreviewNext(currPage);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkUpPreviewPrev(currPage);
    }

    // Other pages
    if (currPage < numPages) {
      return (
        this._generateMarkUpPreviewNext(currPage) +
        this._generateMarkUpPreviewPrev(currPage)
      );
    }

    // Page 1, and there are NO other page
    return '';
  }

  _generateMarkUpPreviewPrev(page) {
    return `
      <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
    `;
  }

  _generateMarkUpPreviewNext(page) {
    return `
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }
}

export default new PaginationView();
