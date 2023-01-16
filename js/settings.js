export const select = {
  temlateOf: {
    finder: '#template-finder',
  },
  containerOf: {
    pages: '.pages',
    home: '.home-wrapper',
    finder: '.finder-wrapper',
    hero: '#hero',
  },
  nav: {
    links: '.navbar a',
  },
  finder: {
    grid: '.finder',
    field: '.field',
    button: '.btn',
  },
};

export const classNames = {
  pages: {
    active: '.subpage-active',
  },
  finder: {
    field: '.field',
    active: '.active',
    extremePoint: 'extreme-point',
    startPoint: 'start-point',
    finishPoint: 'finish-point',
    edgeField: 'edge-field',
    checkedField: 'checked-field'
  },
};

export const settings = {
  db: {
    url:
      '//' +
      window.location.hostname +
      (window.location.hostname == 'localhost' ? ':3131' : ''),
  },
};

export const templates = {
  finder: Handlebars.compile(
    document.querySelector(select.temlateOf.finder).innerHTML
  ),
};
