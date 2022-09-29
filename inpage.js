/**
 * Chainable Vanilla JavaScript plugin: INPAGE.
 * 
 * Create a page menu generation plugin that builds an in-page menu for all H2 level headings.
 *  - should provide anchor links that jump to the heading
 *  - should be able to be set on a specific element or default to the whole document
 *  - be careful with ID handling.
 * 
 * Useful resources:
 *  - https://developer.mozilla.org/en-US/docs/Web/API/Element
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference 
 * 
 * 
 * Your plugin should have the following usage and options:
 * --------------------------
 * Usage:
 *
 *  $("#menudiv").inpage(); //defaults
 *
 *  $("#menudiv").inpage({ 
 *      source : element 
 *  });
 *
 * --------------------------
 * Target of the function should be where the menu will be inserted.
 * 
 * Options:
 *  source (HTMLElement) default: null. If given, will only pull headings from within this element.       
 *
 * @param {JSON} options
 */


// YOUR PLUGIN CODE HERE.

/* 
* Create a submenu panel
* Should take whatever the user assigns as the base to build the menu
* In this case is the contentMenu class div
*/

var INPG = {};

INPG.headings = [];

INPG.target;

INPG.anchorName;

Element.prototype.inpage = function (options=null) {
//Element.prototype.createMenu = function (targetId, sourceId=null) {
    INPG.el = this;

    INPG.options = options;
    
    INPG.target = document.getElementById(INPG.el.getAttribute("id"));
    if (options != null) {
      var source = options.source;
      INPG.headings = source.querySelectorAll("h2");
    } else {
      INPG.headings = document.querySelectorAll("h2");
    };
  
    INPG.utils.init();
}

INPG.utils = {
  init: function() {
    if(INPG.headings.length > 0) {
      INPG.utils.createMenu();
    };
  },

  createMenu: function() {
    var menuList = document.createElement("ol");
    for(var i=0; i < INPG.headings.length; i++) {
      
      if(INPG.headings[i].id) {
        INPG.anchorName = INPG.headings[i].id;
      } else {
        INPG.anchorName = INPG.headings[i].firstChild.nodeValue.toString().replace(/ /g,"_");
      };

      INPG.headings[i].setAttribute("id", INPG.anchorName);
      var headingText = INPG.headings[i].firstChild.nodeValue;
      //INPG.headings[i].firstChild.nodeValue = (i+1) + ". " + headingText;
      var menuLink = document.createElement("a");
      menuLink.setAttribute("href", "#" + INPG.anchorName);
      menuLink.appendChild(document.createTextNode(headingText));
      var listItem = document.createElement("li");
      listItem.appendChild(menuLink);
      menuList.appendChild(listItem);
    };

    INPG.target.appendChild(menuList);
  
    INPG.utils.scrollIndicator();

    INPG.utils.offsetHeightContent();
  },

  scrollIndicator: function() {
    var scroll = 0;
    const windowHeight = window.innerHeight;
    
    window.addEventListener('scroll', function() {
      scroll = window.scrollY;
      INPG.headings.forEach(function(section, i) {
        if (section.offsetTop <  scroll + windowHeight/2 && scroll < section.offsetTop + windowHeight/2) {
          INPG.utils.resetSroll();
          document.querySelectorAll('[href="#'+ section.id +'"]').forEach(el => {
            el.parentElement.classList.add('active')});
          //INPG.target.children[0].children[i].classList.add('active');
        };
      });
    });
    
    INPG.target.querySelectorAll('li').forEach(function(item, i) {
      item.addEventListener('click', function() {
        INPG.utils.resetSroll();
        window.scrollTo({
          top: i * windowHeight,
          behavior: 'smooth'
        });
      });
    });
  },

  resetSroll: function() {
    INPG.headings.forEach(function(section, i) {
      document.querySelectorAll('[href="#'+ section.id +'"]').forEach(el => {
      el.parentElement.classList.remove('active')});
    });
  },

  offsetHeightContent: function() {
    if (!INPG.options) {
      return;
    }
    var currentTarget = INPG.target;
    var height = INPG.options.source.offsetHeight;
    var scroll = 0;
    window.addEventListener('scroll', function() {
      scroll = window.scrollY;
      if (height < scroll) {
        currentTarget.style.position = "relative";
      } else {
        currentTarget.style.position = "fixed";
      }
    });
  },
};