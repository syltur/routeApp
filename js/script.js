{
  'use strict';
    
  class menu{
    constructor(){
      const thisPage = this;

      thisPage.initActions();
    }
    initActions(){
      const menuLinks = document.querySelectorAll('.menu ul li a');
      for (let menuLink of menuLinks){
        menuLink.addEventListener('click', function(event){
          event.preventDefault();
          const subpages = document.querySelectorAll('.subpage');
          const clickedElement = event.target;
          const clickedElementId = clickedElement.getAttribute('id');
          for(let subpage of subpages){
            if (subpage.getAttribute('id') === clickedElementId) {
              subpage.classList.add('active');
            }
          }
        });
      }
    }
  }
  const app = new menu();
  console.log(app);
}