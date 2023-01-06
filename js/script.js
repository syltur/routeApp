{
  'use strict';

  class Menu {
    constructor() {
      const thisPage = this;
      thisPage.initActions();
    }
  
    initActions() {
      const links = document.querySelectorAll('.menu-link');
      const subpages = document.querySelectorAll('.subpage');

      for(let link of links){
        link.addEventListener('click', function(event) {
          event.preventDefault();
          for (let subpage of subpages) {
            if (subpage.classList.contains(event.target.classList)) {
              subpage.classList.add('active');
            } else {
              subpage.classList.remove('active');
            }
          }
        });
      }
    }
  }
  
  const app = new Menu();
  console.log(app);
}