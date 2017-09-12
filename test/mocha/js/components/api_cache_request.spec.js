'use strict';
define([
  'jquery',
  'underscore',
  'js/components/api_cache_request',
  'js/components/api_request',
  'js/components/api_query'
], function ($, _, RequestCache, ApiRequest, ApiQuery) {

  var buildRequest = function (options) {
    options = options || {};
    options.target = (options.target) ? options.target : 'search/query';

    var f = function () {
      var fl = 'title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract';
      return _.shuffle(fl.split(',')).join(',');
    };

    var q = function () {
      return 'bibcode:' + _.random(2000, 2017) +
        'J....' + _.random(100, 200) + '..124M';
    };

    var request = new ApiRequest({
      target: options.target,
      query: new ApiQuery({
        q: options.q || q(),
        fl: options.f || f()
      })
    });

    return request;
  };

  var buildResponse = function () {

  };

  describe('API Request Cache', function () {
    var cache;

    beforeEach(function () {
      cache = new RequestCache();
    });

    afterEach(function () {
      cache.destroy();
      cache = null;
    });

    it('instantiates', function () {
      expect(cache).to.be.instanceOf(RequestCache);
    });







    it('properly validates request', function () {
      var request = buildRequest({ target: 'test' });

      expect(cache.put(request)).to.be.false;
      expect(cache.put(null)).to.be.false;
      expect(cache.put([])).to.be.false;

      request = new ApiRequest({ target: 'search/query' });
      expect(cache.put(request)).to.be.false;
      request = new ApiRequest({
        target: 'search/query',
        query: new ApiQuery({
          q: 'bibcode:*'
        })
      });
      expect(cache.put(request)).to.be.false;
      request = buildRequest({ target: 'search/query' });
      expect(cache.put(request)).to.not.be.false;
    });

    it('properly puts in cache', function (done) {

      var fields = function () {
        var f = 'title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract';
        return _.shuffle(f.split(',')).join(',');
      };

      var q = function () {
        return 'bibcode:' + _.random(2000, 2017) +
          'J....' + _.random(100, 200) + '..124M';
      };

      var promises = [];

      _.times(30, function () {
        var request = buildRequest({
          q: q(),
          f: fields()
        });

        promises.push(cache.get(request));
      });

      $.when.apply($, promises).then(function () {
        console.log('sdlfkj');
        done();
      });
    });

    it('cleans up after it dies', function () {
      expect(cache._cycleInterval).is.not.equal(null);
      cache.destroy();
      expect(cache._cycleInterval).is.equal(null);
    });
  });
});

// {
//   "query": {
//   "q": [
//     "identifier:2014AJ....147..124M"
//   ],
//     "fl": [
//     "bibcode"
//   ]
// },
//   "target": "search/query",
//   "options": {}
// }
//
// {
//   "target": "metrics",
//   "query": {
//   "bibcodes": [
//     "2014AJ....147..124M"
//   ]
// },
//   "options": {
//   "type": "POST",
//     "contentType": "application/json"
// }
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "citations(bibcode:2014AJ....147..124M)"
//   ],
//     "fl": [
//     "title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract"
//   ],
//     "rows": [
//     25
//   ],
//     "start": [
//     0
//   ],
//     "sort": [
//     "date desc"
//   ]
// }
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "references(bibcode:2014AJ....147..124M)"
//   ],
//     "fl": [
//     "title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract"
//   ],
//     "rows": [
//     25
//   ],
//     "start": [
//     0
//   ],
//     "sort": [
//     "first_author asc"
//   ]
// }
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "trending(bibcode:2014AJ....147..124M)-bibcode:2014AJ....147..124M"
//   ],
//     "fl": [
//     "title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract"
//   ],
//     "rows": [
//     25
//   ],
//     "start": [
//     0
//   ],
//     "sort": [
//     "date desc"
//   ]
// }
// }
// {
//   "target": "graphics/2014AJ....147..124M",
//   "query": {}
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "bibcode:2014AJ....147..124M"
//   ],
//     "fl": [
//     "title"
//   ]
// }
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "bibcode:2014AJ....147..124M"
//   ],
//     "fl": [
//     "links_data,[citations],keyword,property,first_author,year,issn,isbn,title,aff,abstract,bibcode,pub,volume,author,issue,pubdate,doi,page"
//   ],
//     "rows": [
//     1
//   ]
// }
// }
// {
//   "target": "search/query",
//   "query": {
//   "q": [
//     "bibcode:2014AJ....147..124M"
//   ],
//     "fl": [
//     "links_data,[citations],property,bibcode,first_author,year,page,pub,pubdate,title,volume,doi,issue,issn"
//   ]
// }
// }
// {
//   "target": "graphics/2014AJ....147..124M",
//   "query": {}
// }
// {
//   "target": "recommender/2014AJ....147..124M"
// }

