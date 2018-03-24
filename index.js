const needle = require('needle');
const Promise = require('bluebird');
const cheerio = require('cheerio');


const TARGETS = [
  {
    url: "https://vc.ru/",
    node: '.b-article h2 span, p'
  },
  {
    url: "https://tjournal.ru/",
    node: '.b-article h2 span, p'
  },
  // { 
  //   url: "https://meduza.io/",
  //   node: 'html'
  // },
  // {
  //   url: "http://www.the-village.ru/",
  //   node: '.widget-news-block'
  // },
  // {
  //   url: "https://www.rbc.ru/",
  //   node: '.main, .l-col-center__inner, span'
  // }
];


const EXСEPTIONS_LIST = [
  'часов', 
  'для', 
  'что', 
  'почему', 
  'как', 
  'млн', 
  'млрд',
  'они',
  'чем',
  'чтобы',
  'теперь',
  'том',
  'после',
  'из-за',
  'еще',
  'ещё',
  'есть',
  'мар',
  'фото',
  'видео',
  'the',
  'новости',
  'дня',
  'рбк',
  'которые',
  'можно'
];



function Request(websites) { 
  return new Promise((resolve, reject) => {
    needle.get(websites.url, function(err, res) {
      if(res) {
        resolve(ParseHTML(res.body, websites.node));
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

function ParseHTML(data, selector) {
  const $ = cheerio.load(data);
  const nodes = $(selector);
  
  let returnArr = [];

  for(let i = 0; i < nodes.length; i++) {
    let words = $(nodes[i]).text().toLowerCase().split(" ");
    for(let j = 0; j < words.length; j++) {
      const word = words[j].replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#»«$%&()*+,.\/:;<=>?@\[\]^_`{|}~\n0-9]/g, "");
      
      if(checkExteption(word, EXСEPTIONS_LIST)) {
        break;
      }

      if(word === "травле") {
        console.log(word);
      }

      if(word.length > 2) {
        returnArr.push(word);
      }

    }
  }

  return returnArr;
};

const FindEqual = (arr) => {
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


function SortByValue(obj) {
  var sortable = [];
  for (var key in obj) {
    sortable.push([key, obj[key]]);
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  });

  return sortable;
}

function BeautifulList(arr) {
  const Spread = SpreadArrays(arr);
  const Equal = FindEqual(Spread);
  const Sorted = SortByValue(Equal);
  return Sorted;
}

function SpreadArrays(arr) {
  let tempArr = [];
  
  for(let i = 0; i < arr.length; i++) {
    tempArr.push(...arr[i]);
  }

  return tempArr;
};

const Req = () => new Promise((resolve, reject) => {
  let sites = [];
  for(let i = 0; i < TARGETS.length; i++) {
    sites.push(Request(TARGETS[i]));
    console.log(TARGETS[i].url)
    if((i + 1) === TARGETS.length) {
      console.log('Loading...')
      Promise.all(sites).then(values => {
        resolve(values);
      });
    }
  }
})

Req()
  .then((res) => {
    console.log(BeautifulList(res));
    console.log('OK')
  })
  .catch((err) => {
    console.log(err);
  })


