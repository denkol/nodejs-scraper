const config = {
  WORD_FILTER_REGEXP: /[\u2000-\u206F\u2E00-\u2E7F\\'!"#»«$%&()*+,.\/:;<=>?@\[\]^_`{|}~\n0-9]/g,
  TARGETS: [
    {
      url: "https://vc.ru/",
      node: '.b-article h2 span, p'
    },
    {
      url: "https://tjournal.ru/",
      node: '.b-article h2 span, p'
    }
  ],
  EXСEPTIONS_LIST: [
    'часов', 
    'для', 
    'что', 
    'это',
    'его',
    'кто',
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
    'можно',
    'from',
    'for',
    'and',
    'with',
    'his'
  ],
};

module.exports = config;