import { classNames } from '../settings.js';

class HomePage {
  constructor() {
    const thisPage = this;
    thisPage.initActions();
  }
  
  initActions() {
    const links = document.querySelectorAll('.menu-link');
    const subpages = document.querySelectorAll('.subpage');
    
    for (let link of links) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        for (let subpage of subpages) {
          subpage.classList.remove(classNames.pages.active);
        }
        const selector =`.subpage.${link.getAttribute('data-page')}`;
        const subpage = document.querySelector(selector);
        subpage.classList.add(classNames.pages.active);
      });
    }
  }
}

export default HomePage;