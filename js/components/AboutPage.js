import {select, templates} from '../settings.js';
import utils from '../utils.js';


class AboutPage {
  constructor(element){
    const thisAbout = this;

    thisAbout.render(element);    
    thisAbout.initActions();

  }



  render(element){
    const thisAbout = this;

    /* generate HTML based on template */
    const generatedHTML = templates.aboutPage();
    /* create element using utils.createElementFromHTML */
    thisAbout.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const aboutContainer = document.querySelector(select.containerOf.aboutPage);
    /* add element to menu */
    aboutContainer.appendChild(thisAbout.element);


    thisAbout.dom = {};
    thisAbout.dom.wrapper = element;
    
  }

  initActions() {

    window.addEventListener('scroll', utils.reveal);
    utils.reveal();

  }
}

export default AboutPage;