const needle = require('needle');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const PARAMS = {
  websites: [

    {
      url: "https://vc.ru/",
      node: '.b-article h2 span, p'
    }
  ]
};

const Request = (websites) => new Promise((resolve, reject) => {
  needle.get(websites.url, function(err, res) {
    if(res) {
      resolve(ParseHTML(res.body, websites.node));
    } else {
      reject(err);
    }
  });
});

const ParseHTML = (data, selector) => {
  const $ = cheerio.load(data);
  const nodes = $(selector);
  
  let returnArr = [];

  for(let i = 0; i < nodes.length; i++) {
    let words = $(nodes[i]).text().toLowerCase().split(" ");
    for(let j = 0; j < words.length; j++) {
      const word = words[j].replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#»«$%&()*+,.\/:;<=>?@\[\]^_`{|}~\n0-9]/g, "");
      // const word = words[j].replace(/^[а-яА-ЯёЁa-zA-Z]/g, "");
      // const word = words[j];
      if(word.length > 2)
        returnArr.push(word);
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


const SortByValue = (obj) => {
  var sortable = [];
  for (var key in obj) {
      sortable.push([key, obj[key]]);
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  });

  return sortable;
}



Promise.all([Request(PARAMS.websites[0])]).then(function(values) {
  let d = [];
  for(let i = 0; i < values.length; i++) {
    d.push(...values[i]);
  }
  
  const Equal = FindEqual(d);
  const Sorted = SortByValue(Equal);
  console.log(Sorted);
});