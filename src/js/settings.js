export const select = {
  templateOf: {
    aboutPage: '#template-about-page',
    finderPage: '#template-finder-page',

  },
  containerOf: {
    pages: '#pages',
    aboutPage: '.about-page-wrapper',
    finderPage: '.finder-page-wrapper',
    gridContainer: '.grid-container',
    buttonWrapper: '.button-wrapper'

  },
  nav: {
    links: '.navigation-bar a',
  },

  finder: {
    buttonStopDrawing: 'finder-start',
    buttonStart: '.finder-start',
    buttonStartFinish: '.finder-start-finish',
    buttonCompute: '.finder-compute',
  }
};

export const classNames = {
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  },
  finder: {
    gridItem: 'grid-item',
    gridItemClicked: 'grid-item-clicked',
    gridItemLastClicked: 'grid-item-last-clicked',
    gridItemStart: 'grid-item-start',
    gridItemFinish: 'grid-item-finish',
    gridItemClickable: 'grid-item-clickable',
    buttonStart: '.finder-start',
    buttonStartFinish: '.finder-start-finish',
    buttonCompute: 'finder-compute',
    buttonActive: 'button-active',
    start: 'grid-item-start',
    finish: 'grid-item-finish',
    path: 'grid-item-path',
    stageOne: '.stage-one',
    stageTwo: '.stage-two',
    stageThree: '.stage-three',
  },
};

export const settings = {
  gridRows: '--grid-rows',
  gridCols: '--grid-cols',

  db: {
    url: '//' + window.location.hostname + (window.location.hostname=='localhost' ? ':3131' : ''),
    
  },
};

export const templates = {
  aboutPage: Handlebars.compile(document.querySelector(select.templateOf.aboutPage).innerHTML),
  finderPage: Handlebars.compile(document.querySelector(select.templateOf.finderPage).innerHTML),

};

export default settings;