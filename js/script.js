{
  'use strict';
    
  class about{
    constructor(){
      const thisPage = this;

      thisPage.initActions();
    }
    initActions(){
      const menuLinks = document.querySelectorAll('.list a'),
        aboutInnerWrapper = document.querySelector('.about-inner-wrapper');
      for (let menuLink of menuLinks){
        menuLink.addEventListener('click', function(){
          aboutInnerWrapper.classList.add('active');
        });
      }
    }
  }
  const app1 = new about();
  console.log(app1);

  class finder{
    constructor(){

    }
  }
  const app2 = new finder();
  console.log(app2);
}