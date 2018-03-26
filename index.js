const needle = require('needle');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const config = require('./config.js');

const TARGETS = config.TARGETS;
const EXСEPTIONS_LIST = config.EXСEPTIONS_LIST;
const WORD_FILTER_REGEXP = config.WORD_FILTER_REGEXP;


function request(target) { 
  return new Promise((resolve, reject) => {
    needle.get(target.url, function(err, res) {
      if(res) {
        resolve(parseHTML(res.body, target.node));
      } else {
        reject(err);
      }
    });
  });
};


function checkExteption(word, exArr) {
  for(let i = 0; i < exArr.length; i++) {
    if(word === exArr[i]) {
      return true;
    }
  }
  return false;
}

function parseHTML(data, selector) {
  const $ = cheerio.load(data);
  const nodes = $(selector);
  
  let returnArr = [];

  for(let i = 0; i < nodes.length; i++) {
    let words = $(nodes[i]).text().toLowerCase().split(" ");
    for(let j = 0; j < words.length; j++) {
      const word = words[j].replace(WORD_FILTER_REGEXP, "");
      
      if(checkExteption(word, EXСEPTIONS_LIST)) {
        break;
      }

      if(word.length > 2) {
        returnArr.push(word);
      }
    }
  }

  return returnArr;
};

function findEqual(arr) {
  let pareObj = {};
  
  for(let i = 0; i < arr.length; i++) {
    let word = arr[i];
    let counter = 1;
    for(let j = 0; j < arr.length; j++) {
      if(word === arr[j]) {
        pareObj[word] = counter++;
      }
    }
  }

  return pareObj;
};


function sortByValue(obj) {
  var sortable = [];

  for (var key in obj) {
    sortable.push([key, obj[key]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  return sortable;
}

function beautifulList(arr) {
  const spread = spreadArrays(arr);
  const equal = findEqual(spread);
  const sorted = sortByValue(equal);

  return sorted;
}

function spreadArrays(arr) {
  let tempArr = [];
  
  for(let i = 0; i < arr.length; i++) {
    tempArr.push(...arr[i]);
  }

  return tempArr;
};


const combineRequests = () => new Promise((resolve, reject) => {
  let sites = [];
  let ms = 0;

  for(let i = 0; i < TARGETS.length; i++) {
    sites.push(request(TARGETS[i]));
    console.log(TARGETS[i].url);

    if((i + 1) === TARGETS.length) {
      
      console.log('Loading...');
    
      let timer = setInterval(() => ms += 100, 100);
      
      Promise.all(sites).then(values => {
        clearInterval(timer);
        resolve({values, ms});
      });

    }
  }
})

combineRequests()
  .then((res) => {
    console.log(beautifulList(res.values));
    console.log(`Done. (${res.ms/1000} sec)`);
  })
  .catch((err) => {
    console.log(err);
  });


