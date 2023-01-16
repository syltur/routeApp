import { select } from './settings.js';
import HomePage from './components/HomePage.js';
import Finder from './components/Finder.js';


const app = {
  initHomePage: function (element) {
    const thisApp = this;
    thisApp.element = element;

    thisApp.homePage = new HomePage;
  },

  initFinder: function (element) {
    const thisApp = this;
    thisApp.element = element;

    const finderElement = document.querySelector(select.containerOf.finder);
    thisApp.finder = new Finder(finderElement);
  },
  
  init: function (element) {
    const thisApp = this;
    thisApp.initHomePage(element);
  },

  init: function (element) {
    const thisApp = this;
    thisApp.initFinder(element);
  },
};

app.init();
