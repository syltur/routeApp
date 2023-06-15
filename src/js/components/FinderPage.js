import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';


class FinderPage {
  constructor(element){
    const thisFinder = this;

    thisFinder.element = element;

    thisFinder.stage = 'drawing';

    thisFinder.render(element);
    thisFinder.getElements();

    thisFinder.initActions();
    
    thisFinder.grid = [];
    for(let row = 0; row < 10; row++) {
      thisFinder.grid[row] = [];
      for(let col = 0; col < 10; col++) {
        thisFinder.grid[row][col] = false;
      }
    }

    thisFinder.clickedGridOrderX = [];
    thisFinder.clickedGridOrderY = [];

    thisFinder.start = [];
    thisFinder.finish = [];
    thisFinder.clickedDivs = [];

    //STAGES
    // 1. drawing
    // 2. drawStartFinish
    // 3. compute


  }



  render(element){
    const thisFinder = this;

    

    /* generate HTML based on template */
    const generatedHTML = templates.finderPage();
    /* create element using utils.createElementFromHTML */
    thisFinder.element = utils.createDOMFromHTML(generatedHTML);
    /* find menu container */
    const finderContainer = document.querySelector(select.containerOf.finderPage);
    /* add element to menu */
    if(thisFinder.stage === 'drawing'){

      finderContainer.appendChild(thisFinder.element);


      thisFinder.dom = {
        wrapper: element,
        gridContainer: document.querySelector(select.containerOf.gridContainer),
        buttonWrapper: document.querySelector(select.containerOf.buttonWrapper),
      };



      thisFinder.initGrid();
    }
    
  }

  getElements(){
    const thisFinder = this;

    thisFinder.startButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStart);
    thisFinder.startFinishButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonStartFinish);
    thisFinder.computeButton = thisFinder.dom.wrapper.querySelector(classNames.finder.buttonCompute);

    thisFinder.stageOne = document.querySelector(classNames.finder.stageOne);
    thisFinder.stageTwo = document.querySelector(classNames.finder.stageTwo);
    thisFinder.stageThree = document.querySelector(classNames.finder.stageThree);

    thisFinder.previouslyClickedElem = '';

    


  }

  changeStage(newStage) {
    const thisFinder = this;
    thisFinder.stage = newStage;
  }

  initGrid(){
    const thisFinder = this;
    const container = thisFinder.dom.gridContainer;

    function makeRows(rows, cols) {
      container.style.setProperty(settings.gridRows, rows);
      container.style.setProperty(settings.gridCols, cols);
      for (rows = 0; rows < 10; rows++) {
        for(cols = 0; cols < 10; cols++){
          let cell = document.createElement('div');
          //cell.innerText = (c + 1);
          container.appendChild(cell).className = classNames.finder.gridItem;
          container.appendChild(cell).setAttribute('data-row', rows  );
          container.appendChild(cell).setAttribute('data-col', cols  );
        }
      }
    }
    
    makeRows(10, 10);

  }


  initActions(){
    const thisFinder = this;

    const startButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonStart);
    const startFinishButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonStartFinish);
    const computeButton = thisFinder.dom.wrapper.querySelector(select.finder.buttonCompute);

    window.addEventListener('scroll', utils.reveal);
    utils.reveal();

      
    thisFinder.dom.buttonWrapper.addEventListener('click', function(event) {
      event.preventDefault();

      const clickedElement = event.target;
      
      if(clickedElement.classList.contains(classNames.finder.buttonActive ) && thisFinder.stage === 'drawing'){
        event.preventDefault();

        const gridValues = Object.values(thisFinder.grid)
          .map(col => Object.values(col))
          .flat();

        if(gridValues.filter(x => x === true).length < 3){
          // eslint-disable-next-line
          Swal.fire({
            title: 'Error!',
            text: 'Path needs to be at least 3 fields long.',
            icon: 'error',
            confirmButtonText: 'OK'
          });


        } else {

          thisFinder.lastClicked.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
          thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
          thisFinder.dom.wrapper.querySelector(classNames.finder.stageOne).classList.remove(classNames.finder.buttonActive);
          thisFinder.dom.wrapper.querySelector(classNames.finder.stageTwo).classList.add(classNames.finder.buttonActive);
          thisFinder.changeStage('drawStartFinish');
          startButton.classList.remove(classNames.finder.buttonActive);
          startFinishButton.classList.add(classNames.finder.buttonActive);
          for(let grid of thisFinder.dom.gridContainer.children){
            grid.classList.remove(classNames.finder.gridItemClickable);
          }
        }
      } if(clickedElement.classList.contains(classNames.finder.buttonActive ) && thisFinder.stage === 'drawStartFinish') {
        event.preventDefault();

        const gridValues = Object.values(thisFinder.grid)
          .map(col => Object.values(col))
          .flat();

        if(!gridValues.includes('Goal')){
          // eslint-disable-next-line
          Swal.fire({
            title: 'Error!',
            text: 'Please choose START and FINISH first.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
      
          startFinishButton.classList.remove(classNames.finder.buttonActive);
          computeButton.classList.add(classNames.finder.buttonActive);
          thisFinder.dom.wrapper.querySelector(classNames.finder.stageTwo).classList.remove(classNames.finder.buttonActive);
          thisFinder.dom.wrapper.querySelector(classNames.finder.stageThree).classList.add(classNames.finder.buttonActive);
          thisFinder.colorPath(thisFinder.findShortestPath(thisFinder.start, thisFinder.grid));

          // eslint-disable-next-line
        Swal.fire({
            title: '<b>SUMMARY<b>',
            text:  'FASTEST ROUTE: ' + thisFinder.path.length + ' fields.',
            footer: 'Thank You for using Pathfinder.',
            icon: 'info',
            showCloseButton: true,
            showConfirmButton: false,


          });
          thisFinder.changeStage('compute');

        }
      } 
      
      
      if (clickedElement.classList.contains(classNames.finder.buttonActive ) && thisFinder.stage === 'compute'){
        event.preventDefault();

        computeButton.classList.remove(classNames.finder.buttonActive);
        startButton.classList.add(classNames.finder.buttonActive);
        thisFinder.cleanUp();
        
        thisFinder.dom.wrapper.querySelector(classNames.finder.stageThree).classList.remove(classNames.finder.buttonActive);
        thisFinder.dom.wrapper.querySelector(classNames.finder.stageOne).classList.add(classNames.finder.buttonActive);
        thisFinder.changeStage('drawing');
      }

    });

    thisFinder.dom.gridContainer.addEventListener('click', function(event) {

      event.preventDefault();

      const clickedElement = event.target;

      if(clickedElement.classList.contains(classNames.finder.gridItem) && thisFinder.stage === 'drawing'){
        thisFinder.markField(clickedElement);
        thisFinder.markClicable(clickedElement);

      

      } else if (thisFinder.stage === 'drawStartFinish') {
        if(clickedElement.classList.contains(classNames.finder.gridItemClicked)){
          thisFinder.startFinish(clickedElement);
        }
      }
    });
    
  } 




  cleanUp(){
    const thisFinder = this;

    for(let grid of thisFinder.dom.gridContainer.children)
      grid.classList.remove(classNames.finder.finish, classNames.finder.gridItemStart, classNames.finder.path, classNames.finder.gridItemClicked, classNames.finder.gridItemClickable);
    thisFinder.previouslyClickedElem = '';
    thisFinder.grid = [];
    for(let row = 0; row < 10; row++) {
      thisFinder.grid[row] = [];
      for(let col = 0; col < 10; col++) {
        thisFinder.grid[row][col] = false;
      }
      thisFinder.changeStage('drawing');
    }

    thisFinder.clickedGridOrderX = [];
    thisFinder.clickedGridOrderY = [];  
    thisFinder.start = [];
    thisFinder.finish = [];
  }

  markField(clickedElement){
    const thisFinder = this;

    if(thisFinder.stage === 'drawing' ){

      const clickedField = {
        row: parseInt(clickedElement.getAttribute('data-row')),
        col: parseInt(clickedElement.getAttribute('data-col')),

      };


      //CHECK if item is marked, and if it's last marked item

      if(thisFinder.grid[clickedField.row][clickedField.col]) {

        if(clickedField.row === thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 1] && thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 1] === clickedField.col ){

          thisFinder.grid[clickedField.row][clickedField.col] = false;
          clickedElement.classList.remove(classNames.finder.gridItemLastClicked);

          thisFinder.clickedGridOrderX.pop();
          thisFinder.clickedGridOrderY.pop();

          //change last clicked item after removing last from array

          thisFinder.previouslyClickedElem = thisFinder.dom.gridContainer.querySelector('[data-col="' + thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 1] + '"]' + '[data-row="' + thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 1] + '"]' );

          if(thisFinder.previouslyClickedElem !== null){
            thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemLastClicked);
          }
        }
      }

      else {
        const gridValues = Object.values(thisFinder.grid)
          .map(col => Object.values(col))
          .flat();

        if(gridValues.includes(true)) {
          const edgeFields = [];
          if(clickedField.col > 0) edgeFields.push(thisFinder.grid[clickedField.row][clickedField.col-1]); //get field on the left value
          if(clickedField.col < 9) edgeFields.push(thisFinder.grid[clickedField.row][clickedField.col+1]); //get field on the right value
          if(clickedField.row > 0) edgeFields.push(thisFinder.grid[clickedField.row-1][clickedField.col]); //get field on the top value
          if(clickedField.row < 9) edgeFields.push(thisFinder.grid[clickedField.row+1][clickedField.col]); //get field on the bottom value

          if(!edgeFields.includes(true)){
            // eslint-disable-next-line
            Swal.fire({
              title: 'Error!',
              text: 'A new field should touch at least one that is already selected!',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            
            return;
          }
        }
      
        thisFinder.grid[clickedField.row][clickedField.col] = true;
        clickedElement.classList.add(classNames.finder.gridItemLastClicked);

        thisFinder.clickedDivs.push(clickedElement);
        //console.log(thisFinder.clickedDivs);

        if(clickedElement.classList.contains(classNames.finder.gridItemClickable)){
          clickedElement.classList.replace(classNames.finder.gridItemClickable, classNames.finder.gridItemLastClicked);

        }
        
        thisFinder.lastClicked = clickedElement;
        //add cords to array for defining last, second last etc

        thisFinder.clickedGridOrderX.push(clickedField.row);
        thisFinder.clickedGridOrderY.push(clickedField.col);
        

        thisFinder.previouslyClickedElem = thisFinder.dom.gridContainer.querySelector('[data-col="' + thisFinder.clickedGridOrderY[thisFinder.clickedGridOrderY.length - 2] + '"]' + '[data-row="' + thisFinder.clickedGridOrderX[thisFinder.clickedGridOrderX.length - 2] + '"]' );

        if (thisFinder.previouslyClickedElem !== null){
          thisFinder.previouslyClickedElem.classList.replace(classNames.finder.gridItemLastClicked, classNames.finder.gridItemClicked);
        }
      }
    } else {
      return;
    }
  }

  markClicable(){

    const thisFinder = this;

    const grid = thisFinder.dom.gridContainer.querySelectorAll('.grid-item');

    //console.log(grid);

    for(let field of grid){
      
      const clickedField = {
        row: parseInt(field.getAttribute('data-row')),
        col: parseInt(field.getAttribute('data-col')),

      };

      //check for inner fields        
      if(clickedField.col > 0 && clickedField.col < 9 && clickedField.row > 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row - 1][clickedField.col] === true || 
          thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);
        }  else {
          field.classList.remove(classNames.finder.gridItemClickable);
        }
    
      }
    
      //check for left top corner
      if(clickedField.col === 0 && clickedField.col < 9 && clickedField.row === 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);

        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

      //check for right top corner
      if(clickedField.col > 0 && clickedField.col === 9 && clickedField.row === 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);

        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

      //check for right bottom corner
      if(clickedField.col > 0 && clickedField.col === 9 && clickedField.row > 0 && clickedField.row === 9) {
        if(thisFinder.grid[clickedField.row -1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);

        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

      //check for left bottom corner
      if(clickedField.col === 0 && clickedField.col < 9 && clickedField.row > 0 && clickedField.row === 9) {
        if(thisFinder.grid[clickedField.row - 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);

        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }
      //check for first column
      if(clickedField.col === 0 && clickedField.col < 9 && clickedField.row > 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row - 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);
        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

      //check for last column
      if(clickedField.col > 0 && clickedField.col === 9 && clickedField.row > 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row - 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);
        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }
      //check for first row
      if(clickedField.col > 0 && clickedField.col < 9 && clickedField.row === 0 && clickedField.row < 9) {
        if(thisFinder.grid[clickedField.row + 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);
        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

      //check for last row
      if(clickedField.col > 0 && clickedField.col < 9 && clickedField.row > 0 && clickedField.row === 9) {
        if(thisFinder.grid[clickedField.row - 1][clickedField.col] === true ||
          thisFinder.grid[clickedField.row][clickedField.col - 1] === true ||
          thisFinder.grid[clickedField.row][clickedField.col + 1] === true){
            
          if(!field.classList.contains(classNames.finder.gridItemClicked) && !field.classList.contains(classNames.finder.gridItemLastClicked))  
            field.classList.add(classNames.finder.gridItemClickable);
        }  else {
          
          field.classList.remove(classNames.finder.gridItemClickable);
        }
      }

    }
  }

  startFinish(clickedElement){
    const thisFinder = this;

    const clickedField = {
      row: parseInt(clickedElement.getAttribute('data-row') ),
      col: parseInt(clickedElement.getAttribute('data-col') ),

    };

    
    const gridValues = Object.values(thisFinder.grid)
      .map(col => Object.values(col))
      .flat();

    if(!gridValues.includes('Start')){
      thisFinder.grid[clickedField.row][clickedField.col] = 'Start';
      thisFinder.start.push(clickedField.row, clickedField.col);
      clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemStart);
    }

    if(clickedElement.classList.contains(classNames.finder.gridItemClicked) && !gridValues.includes('Goal') && thisFinder.grid[clickedField.row][clickedField.col] !== 'Start'){
      thisFinder.grid[clickedField.row][clickedField.col] = 'Goal';
      thisFinder.finish.push(clickedField.row, clickedField.col);
      clickedElement.classList.replace(classNames.finder.gridItemClicked, classNames.finder.gridItemFinish);

    }
  }

  findShortestPath(startCoordinates, grid){
    const thisFinder = this;

    //start location

    const distanceFromTop = parseInt(startCoordinates[0]);
    const distanceFromLeft = parseInt(startCoordinates[1]);

    // Each location will store it's coordinates
    // and the shortest path required to arrive there

    let location = {
      distanceFromTop: distanceFromTop,
      distanceFromLeft: distanceFromLeft,
      path: [],
      status: 'Start'
    };


    // initialize the queue with the start location already inside

    let queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0){
      //take the first location off the queue
      let currentLocation = queue.shift();

      //Explore up
      thisFinder.newLocation = thisFinder.exploreInDirection(currentLocation, 'North', grid);

      if (thisFinder.newLocation.status === 'Goal') {

        return thisFinder.newLocation.path;
      } else if (thisFinder.newLocation.status === 'Valid') {
        queue.push(thisFinder.newLocation);
      }

      // Explore right
      thisFinder.newLocation = thisFinder.exploreInDirection(currentLocation, 'East', grid);

      if (thisFinder.newLocation.status === 'Goal') {
        return thisFinder.newLocation.path;

      } else if (thisFinder.newLocation.status === 'Valid') {
        queue.push(thisFinder.newLocation);
      }

      //Explore down
      thisFinder.newLocation = thisFinder.exploreInDirection(currentLocation, 'South', grid);

      if (thisFinder.newLocation.status === 'Goal') {
        return thisFinder.newLocation.path;

      }else if (thisFinder.newLocation.status === 'Valid') {
        queue.push(thisFinder.newLocation);
      }

      //Explore right
      thisFinder.newLocation = thisFinder.exploreInDirection(currentLocation, 'West', grid);

      if (thisFinder.newLocation.status === 'Goal') {
        return thisFinder.newLocation.path;

      } else if (thisFinder.newLocation.status === 'Valid') {
        queue.push(thisFinder.newLocation);
      }
    }

    // No valid path found
    return false;
  }

  locationStatus(location, grid) {
    const gridSize = 10;
    const dft = location.distanceFromTop;
    const dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
    location.distanceFromLeft >= gridSize ||
    location.distanceFromTop < 0 ||
    location.distanceFromTop >= gridSize) {

      //location is not on the grid -- return false
      return false;

    } else if (grid[dft][dfl] === 'Goal'){
      return 'Goal';

    } else if (grid[dft][dfl] !== true ) {
      // location is either an obstacle or has been visited
      return false;

    } else {
      return 'Valid';
    }
  }

  
  exploreInDirection(currentLocation, direction, grid) {

    const thisFinder = this;
    let newPath = currentLocation.path.slice();
    newPath.push(direction);

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    if (direction === 'North') {
      dft -= 1;
    } else if (direction === 'East') {
      dfl += 1;
    } else if (direction === 'South') {
      dft += 1;
    } else if (direction === 'West') {
      dfl -= 1;
    }

    let newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown'
    };
    newLocation.status = thisFinder.locationStatus(newLocation, grid);

    if(newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }
    return newLocation;
  }

  colorPath(path){
    
    const thisFinder = this;
    const pathArray = path;
    thisFinder.path = pathArray;

    thisFinder.currentElement = thisFinder.start;

    pathArray.forEach(colorFunction);

    function colorFunction(element) {
      const toColor = thisFinder.dom.gridContainer.querySelector('[data-col="' + thisFinder.start[1] + '"]' + '[data-row="' + thisFinder.start[0] + '"]' );
      toColor.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);

      if(element === 'North'){
        const row = parseInt(thisFinder.currentElement[0] - 1);
        const col = parseInt(thisFinder.currentElement[1]);
        const toColor = thisFinder.dom.gridContainer.querySelector('[data-col="' + col + '"]' + '[data-row="' + row + '"]' );

        toColor.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        thisFinder.currentElement = [row, col];

      } else if(element === 'South') {
        const row = parseInt(thisFinder.currentElement[0] + 1);
        const col = parseInt(thisFinder.currentElement[1]);
        const toColor = thisFinder.dom.gridContainer.querySelector('[data-col="' + col + '"]' + '[data-row="' + row + '"]' );

        toColor.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        thisFinder.currentElement = [row, col];

      } else if(element === 'East') {
        const row = parseInt(thisFinder.currentElement[0]);
        const col = parseInt(thisFinder.currentElement[1] + 1 );
        const toColor = thisFinder.dom.gridContainer.querySelector('[data-col="' + col + '"]' + '[data-row="' + row + '"]' );
        
        toColor.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        thisFinder.currentElement = [row, col];

      } else if(element === 'West') {
        const row = parseInt(thisFinder.currentElement[0]);
        const col = parseInt(thisFinder.currentElement[1] - 1);
        const toColor = thisFinder.dom.gridContainer.querySelector('[data-col="' + col + '"]' + '[data-row="' + row + '"]' );

        toColor.classList.replace(classNames.finder.gridItemClicked, classNames.finder.path);
        thisFinder.currentElement = [row, col];
      }
    }
  }
}

export default FinderPage;