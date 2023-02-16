import {select, classNames} from './settings.js';
import AboutPage from './components/AboutPage.js';
import FinderPage from './components/FinderPage.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash = window.location.hash.replace('#', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      } 
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        //console.log(thisApp.link);

        /*  get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash*/
        window.location.hash = '#/' + id;

      });
    }
    
  },

  initAbout: function(){
    const thisApp = this;

    const aboutElement  = document.querySelector(select.containerOf.aboutPage);

    thisApp.aboutPage = new AboutPage(aboutElement);
    //console.log(bookingElement);

  },

  initFinder: function(){
    const thisApp = this;

    const finderElement  = document.querySelector(select.containerOf.finderPage);

    thisApp.aboutPage = new FinderPage(finderElement);
    //console.log(bookingElement);

  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages. remove from non-matching */

    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links. remove from non-matching */

    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#/' + pageId
      );
    }
    //console.log(pageId);
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initAbout();
    thisApp.initFinder();
    
  },
};
  
  

app.init();

