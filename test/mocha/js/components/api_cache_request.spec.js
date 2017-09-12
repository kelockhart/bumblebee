'use strict';
define([
  'jquery',
  'underscore',
  'js/components/api_cache_request',
  'js/components/api_request',
  'js/components/api_response',
  'js/components/api_query'
], function ($, _, RequestCache, ApiRequest, ApiResponse, ApiQuery) {

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

  var buildResponse = function (numDocs) {
    var sample = function (arr) {
      var out = [];
      _(_.range(_.random(1, arr.length - 1)))
        .reduce(function (res) {
          var ran;
          while ((ran = _.random(0, arr.length - 1)) && res.indexOf(ran) > -1) {}
          res.push(ran);
          return res;
        }, [])
        .forEach(function (i) {
          out.push(arr[i]);
        });
      return out;
    };

    var docs = function (n) {
      n = n || 25;
      return _.map(_.range(n), function () {
        return {
          "pubdate": "2014-05-00",
          "abstract": "Not Available John P. Huchra passed away in 2010, before the errors resulting in the need for this erratum were discovered.",
          "links_data": sample([
            "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
            "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}"
          ]),
          "pub": "The Astronomical Journal",
          "citation_count": _.random(0, 3000),
          "volume": "147",
          "doi": [
            "10.1088/0004-6256/147/5/124"
          ],
          "id": "2066283",
          "page": [
            "124"
          ],
          "bibcode": "2014AJ....147..124M",
          "author": sample([
            "Masters, Karen L.",
            "Springob, Christopher M.",
            "Huchra, John P."
          ]),
          "aff": [
            "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
            "Department of Physics and Astronomy, Washington State University, Pullman, WA 99164, USA; Naval Research Laboratory, Remote Sensing Division Code 7213, 4555 Overlook Avenue, SW, Washington, DC 20375, USA",
            "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA"
          ],
          "pub_raw": "The Astronomical Journal, Volume 147, Issue 5, article id. 124, <NUMPAGES>3</NUMPAGES> pp. (2014).",
          "title": [
            "Erratum: \"2MTF. I. The Tully-Fisher Relation in the Two Micron All Sky Survey J, H, and K Bands\" <A href=\"/abs/2008AJ....135.1738M\">(2008, AJ, 135, 1738)</A>"
          ],
          "property": sample([
            "OPENACCESS",
            "REFEREED",
            "PUB_OPENACCESS",
            "NONARTICLE"
          ]),
          "[citations]": {
            "num_references": _.random(0, 3000),
            "num_citations": _.random(0, 3000)
          }
        }
      });
    };

    var response = new ApiResponse({
      response: {
        numFound: _.random(25, 5000),
        docs: docs(numDocs || _.random(1, 30))
      },
      responseHeader: {
        params: {
          "q": "author:\"huchra, john\"",
          "hl": "true",
          "hl.maxAnalyzedChars": "150000",
          "hl.requireFieldMatch": "true",
          "fl": "title,abstract,bibcode,author,keyword,id,citation_count,[citations],pub,aff,volume,pubdate,doi,pub_raw,page,links_data,property",
          "hl.q": "author:\"huchra, john\"",
          "hl.usePhraseHighlighter": "true",
          "start": "0",
          "sort": "date desc, bibcode desc",
          "hl.fl": "title,abstract,body,ack",
          "rows": "25",
          "wt": "json"
        }
      }
    });

    return response;
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

    it('does stuff', function () {
      console.log(buildResponse().toJSON());
    });

  });
});

//
//
//     it('properly validates request', function () {
//       var request = buildRequest({ target: 'test' });
//
//       expect(cache.put(request)).to.be.false;
//       expect(cache.put(null)).to.be.false;
//       expect(cache.put([])).to.be.false;
//
//       request = new ApiRequest({ target: 'search/query' });
//       expect(cache.put(request)).to.be.false;
//       request = new ApiRequest({
//         target: 'search/query',
//         query: new ApiQuery({
//           q: 'bibcode:*'
//         })
//       });
//       expect(cache.put(request)).to.be.false;
//       request = buildRequest({ target: 'search/query' });
//       expect(cache.put(request)).to.not.be.false;
//     });
//
//     it('properly puts in cache', function (done) {
//
//       var fields = function () {
//         var f = 'title,bibcode,author,keyword,pub,aff,volume,year,links_data,[citations],property,pubdate,abstract';
//         return _.shuffle(f.split(',')).join(',');
//       };
//
//       var q = function () {
//         return 'bibcode:' + _.random(2000, 2017) +
//           'J....' + _.random(100, 200) + '..124M';
//       };
//
//       var promises = [];
//
//       _.times(30, function () {
//         var request = buildRequest({
//           q: q(),
//           f: fields()
//         });
//
//         promises.push(cache.get(request));
//       });
//
//       $.when.apply($, promises).then(function () {
//         console.log('sdlfkj');
//         done();
//       });
//     });
//
//     it('cleans up after it dies', function () {
//       expect(cache._cycleInterval).is.not.equal(null);
//       cache.destroy();
//       expect(cache._cycleInterval).is.equal(null);
//     });
//   });
// });

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

// {
//   "responseHeader": {
//   "status": 0,
//     "QTime": 424,
//     "params": {
//     "q": "author:\"huchra, john\"",
//       "hl": "true",
//       "hl.maxAnalyzedChars": "150000",
//       "hl.requireFieldMatch": "true",
//       "fl": "title,abstract,bibcode,author,keyword,id,citation_count,[citations],pub,aff,volume,pubdate,doi,pub_raw,page,links_data,property",
//       "hl.q": "author:\"huchra, john\"",
//       "hl.usePhraseHighlighter": "true",
//       "start": "0",
//       "sort": "date desc, bibcode desc",
//       "hl.fl": "title,abstract,body,ack",
//       "rows": "25",
//       "wt": "json"
//   }
// },
//   "response": {
//   "numFound": 732,
//     "start": 0,
//     "docs": [
//     {
//       "pubdate": "2014-05-00",
//       "abstract": "Not Available John P. Huchra passed away in 2010, before the errors resulting in the need for this erratum were discovered.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}"
//       ],
//       "pub": "The Astronomical Journal",
//       "citation_count": 3,
//       "volume": "147",
//       "doi": [
//         "10.1088/0004-6256/147/5/124"
//       ],
//       "id": "2066283",
//       "page": [
//         "124"
//       ],
//       "bibcode": "2014AJ....147..124M",
//       "author": [
//         "Masters, Karen L.",
//         "Springob, Christopher M.",
//         "Huchra, John P."
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Department of Physics and Astronomy, Washington State University, Pullman, WA 99164, USA; Naval Research Laboratory, Remote Sensing Division Code 7213, 4555 Overlook Avenue, SW, Washington, DC 20375, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 147, Issue 5, article id. 124, <NUMPAGES>3</NUMPAGES> pp. (2014).",
//       "title": [
//         "Erratum: \"2MTF. I. The Tully-Fisher Relation in the Two Micron All Sky Survey J, H, and K Bands\" <A href=\"/abs/2008AJ....135.1738M\">(2008, AJ, 135, 1738)</A>"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "PUB_OPENACCESS",
//         "NONARTICLE"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 3
//       }
//     },
//     {
//       "pubdate": "2012-11-00",
//       "abstract": "The \"Cosmic Evolution Survey\" (COSMOS) enables the study of the spectral energy distributions (SEDs) of active galactic nuclei (AGNs) because of the deep coverage and rich sampling of frequencies from X-ray to radio. Here we present an SED catalog of 413 X-ray (XMM-Newton)-selected type 1 (emission line FWHM 〉 2000 km s<SUP>-1</SUP>) AGNs with Magellan, SDSS, or VLT spectrum. The SEDs are corrected for Galactic extinction, broad emission line contributions, constrained variability, and host galaxy contribution. We present the mean SED and the dispersion SEDs after the above corrections in the rest-frame 1.4 GHz to 40 keV, and show examples of the variety of SEDs encountered. In the near-infrared to optical (rest frame ~8 μm-4000 Å), the photometry is complete for the whole sample and the mean SED is derived from detections only. Reddening and host galaxy contamination could account for a large fraction of the observed SED variety. The SEDs are all available online.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"9\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"424\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"MAST References (HST, GALEX)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"spires\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 42,
//       "id": "1951577",
//       "bibcode": "2012ApJ...759....6E",
//       "author": [
//         "Elvis, M.",
//         "Hao, H.",
//         "Civano, F.",
//         "Brusa, M.",
//         "Salvato, M.",
//         "Bongiorno, A.",
//         "Capak, P.",
//         "Zamorani, G.",
//         "Comastri, A.",
//         "Jahnke, K.",
//         "Lusso, E.",
//         "Mainieri, V.",
//         "Trump, J. R.",
//         "Ho, L. C.",
//         "Aussel, H.",
//         "Cappelluti, N.",
//         "Cisternas, M.",
//         "Frayer, D.",
//         "Gilli, R.",
//         "Hasinger, G.",
//         "Huchra, J. P.",
//         "Impey, C. D.",
//         "Koekemoer, A. M.",
//         "Lanzuisi, G.",
//         "Le Floc'h, E.",
//         "Lilly, S. J.",
//         "Liu, Y.",
//         "McCarthy, P.",
//         "McCracken, H. J.",
//         "Merloni, A.",
//         "Roeser, H. -J.",
//         "Sanders, D. B.",
//         "Sargent, M.",
//         "Scoville, N.",
//         "Schinnerer, E.",
//         "Schiminovich, D.",
//         "Silverman, J.",
//         "Taniguchi, Y.",
//         "Vignali, C.",
//         "Urry, C. M.",
//         "Zamojski, M. A.",
//         "Zatloukal, M."
//       ],
//       "aff": [
//         "Harvard Smithsonian Center for astrophysics, 60 Garden St., Cambridge, MA 02138, USA",
//         "Harvard Smithsonian Center for astrophysics, 60 Garden St., Cambridge, MA 02138, USA; SISSA, Via Bonomea 265, I-34136 Trieste, Italy;",
//         "Harvard Smithsonian Center for astrophysics, 60 Garden St., Cambridge, MA 02138, USA",
//         "Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany",
//         "Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany; IPP-Max-Planck-Institut for Plasma Physics, Boltzmann Strasse 2, D-85748, Garching bei München, Germany ; Excellence Cluster, Boltzmann Strasse 2, D-85748, Garching bei München, Germany",
//         "Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany; INAF-Osservatorio Astronomico di Roma, Via di Frascati 33, I-00040, Monteporzio Catone, Rome, Italy",
//         "California Institute of Technology, MC 105-24, 1200 East California Boulevard, Pasadena, CA 91125, USA",
//         "INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, I-40127 Bologna, Italy",
//         "INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, I-40127 Bologna, Italy",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany",
//         "European Southern Observatory, Karl-Schwarzschild-Strasse 2, D-85748, Garching bei München, Germany",
//         "Steward Observatory, University of Arizona, 933 North Cherry Avenue, Tucson, AZ 85721, USA ; UCO/Lick Observatory, University of California, Santa Cruz, CA 95064, USA",
//         "The Observatories of the Carnegie Institute for Science, Santa Barbara Street, Pasadena, CA 91101, USA",
//         "AIM Unité Mixte de Recherche CEA CNRS, Université Paris VII UMR n158, Paris, France",
//         "Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany; INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, I-40127 Bologna, Italy",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany; Instituto de Astrofísica de Canarias, E-38205, La Laguna, Tenerife, Spain",
//         "National Radio Astronomy Observatory, P.O. Box 2, Green Bank, WV 24944, USA",
//         "INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, I-40127 Bologna, Italy",
//         "Institute for Astronomy, University of Hawaii, 2680 Woodlawn Drive, Honolulu, HI 96822, USA",
//         "Harvard Smithsonian Center for astrophysics, 60 Garden St., Cambridge, MA 02138, USA; John P. Huchra has contributed to the work before his death in 2010 October.",
//         "Steward Observatory, University of Arizona, 933 North Cherry Avenue, Tucson, AZ 85721, USA",
//         "Space Telescope Science Institute, 3700 San Martin Drive, Baltimore, MD 21218, USA",
//         "Harvard Smithsonian Center for astrophysics, 60 Garden St., Cambridge, MA 02138, USA; Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany; INAF-IASF Roma, Via Fosso del Cavaliere 100, I-00133 Rome, Italy ; INAF-IASF Bologna, Via Gobetti 101, I-40129 Bologna, Italy",
//         "CEA-Saclay, Service d'Astrophysique, Orme des Merisiers, Bat. 709, F-91191 Gif-sur-Yvette, France",
//         "Institute of Astronomy, Swiss Federal Institute of Technology (ETH Hönggerberg), CH-8093, Zürich, Switzerland",
//         "Key Laboratory of Particle Astrophysics, Institute of High Energy Physics, Chinese Academy of Sciences, P.O. Box 918-3, Beijing 100049, China",
//         "The Observatories of the Carnegie Institute for Science, Santa Barbara Street, Pasadena, CA 91101, USA",
//         "Institut d'Astrophysique de Paris, UMR 7095 CNRS, Université Pierre et Marie Curie, 98 bis Boulevard Arago, F-75014 Paris, France",
//         "Max-Planck-Institut für Extraterrestrische Physik, Postfach 1312, D-85741, Garching bei München, Germany",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany",
//         "Institute for Astronomy, University of Hawaii, 2680 Woodlawn Drive, Honolulu, HI 96822, USA",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany; CEA-Saclay, Service d'Astrophysique, Orme des Merisiers, Bat. 709, F-91191 Gif-sur-Yvette, France",
//         "California Institute of Technology, MC 105-24, 1200 East California Boulevard, Pasadena, CA 91125, USA",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany",
//         "Department of Astronomy, Columbia University, MC2457, 550 W. 120 St., New York, NY 10027, USA",
//         "Institute for the Physics and Mathematics of the Universe (IPMU), University of Tokyo, Kashiwanoha 5-1-5, Kashiwa-shi, Chiba 277-8568, Japan",
//         "Research Center for Space and Cosmic Evolution, Ehime University, Bunkyo-cho 2-5, Matsuyama 790-8577, Japan",
//         "Dipartimento di Astronomia, Università degli Studi di Bologna, via Ranzani 1, I-40127 Bologna, Italy",
//         "Physics Department and Yale Center for Astronomy and Astrophysics, Yale University, New Haven, CT 06511, USA",
//         "Department of Astronomy, Columbia University, MC2457, 550 W. 120 St., New York, NY 10027, USA",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, Heidelberg, D-69117, Germany"
//       ],
//       "pub_raw": "The Astrophysical Journal, Volume 759, Issue 1, article id. 6, <NUMPAGES>20</NUMPAGES> pp. (2012).",
//       "pub": "The Astrophysical Journal",
//       "volume": "759",
//       "doi": [
//         "10.1088/0004-637X/759/1/6"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "galaxies: evolution",
//         "quasars: general",
//         "surveys",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "Spectral Energy Distributions of Type 1 Active Galactic Nuclei in the COSMOS Survey. I. The XMM-COSMOS Sample"
//       ],
//       "page": [
//         "6"
//       ],
//       "[citations]": {
//         "num_references": 110,
//         "num_citations": 42
//       }
//     },
//     {
//       "pubdate": "2012-06-00",
//       "abstract": "We obtained spectra of a total of 207 extended objects in M81 on the nights of 2006 May 3-5 and 2007 November 13 and 17 with Hectospec on the 6.5m MMT on Mt. Hopkins in Arizona. (5 data files).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "VizieR Online Data Catalog",
//       "citation_count": 0,
//       "volume": "513",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "id": "2001744",
//       "page": [
//         "92620"
//       ],
//       "bibcode": "2012yCat..51392620N",
//       "keyword": [
//         "Galaxies: nearby",
//         "Spectroscopy",
//         "Radial velocities"
//       ],
//       "author": [
//         "Nantais, J. B.",
//         "Huchra, J. P."
//       ],
//       "aff": [
//         "-",
//         "-"
//       ],
//       "pub_raw": "VizieR On-line Data Catalog: J/AJ/139/2620. Originally published in: 2010AJ....139.2620N",
//       "title": [
//         "VizieR Online Data Catalog: Spectroscopy of M81 globular clusters (Nantais+, 2010)"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2012-06-00",
//       "abstract": "We obtained spectra for 11000 galaxies that met the selection criteria, plus an additional 2898 galaxies beyond the catalog limits. Observations were carried out between 1997 September and 2011 January using a variety of facilities (Fred L. Whipple, 1.5m; Cerro Tololo 1.5m and 4m; McDonald, 2.1m; Hobby-Eberly, 9.2m). The majority of the spectra obtained for this survey were acquired at the Fred L. Whipple Observatory (FLWO) 1.5m telescope, which mostly targeted galaxies in the northern hemisphere. In the southern hemisphere, we relied heavily on observations by the 6dFGS project (Jones et al. 2009, Cat. VII/259) but also carried out our own observations using the Cerro Tololo Interamerican Observatory (CTIO) 1.5m telescope. (10 data files).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "VizieR Online Data Catalog",
//       "citation_count": 0,
//       "volume": "219",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "id": "2001505",
//       "page": [
//         "90026"
//       ],
//       "bibcode": "2012yCat..21990026H",
//       "keyword": [
//         "Galaxies: IR",
//         "Extinction",
//         "Photometry: infrared",
//         "Redshifts",
//         "Surveys",
//         "Galaxy catalogs"
//       ],
//       "author": [
//         "Huchra, J. P.",
//         "Macri, L. M.",
//         "Masters, K. L.",
//         "Jarrett, T. H.",
//         "Berlind, P.",
//         "Calkins, M.",
//         "Crook, A. C.",
//         "Cutri, R.",
//         "Erdogdu, P.",
//         "Falco, E.",
//         "George, T.",
//         "Hutcheson, C. M.",
//         "Lahav, O.",
//         "Mader, J.",
//         "Mink, J. D.",
//         "Martimbeau, N.",
//         "Schneider, S.",
//         "Skrutskie, M.",
//         "Tokarz, S.",
//         "Westover, M."
//       ],
//       "aff": [
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-"
//       ],
//       "pub_raw": "VizieR On-line Data Catalog: J/ApJS/199/26. Originally published in: 2012ApJS..199...26H",
//       "title": [
//         "VizieR Online Data Catalog: The 2MASS Redshift Survey (2MRS) (Huchra+, 2012)"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2012-04-00",
//       "abstract": "We present the results of the 2MASS Redshift Survey (2MRS), a ten-year project to map the full three-dimensional distribution of galaxies in the nearby universe. The Two Micron All Sky Survey (2MASS) was completed in 2003 and its final data products, including an extended source catalog (XSC), are available online. The 2MASS XSC contains nearly a million galaxies with K<SUB>s</SUB> 〈= 13.5 mag and is essentially complete and mostly unaffected by interstellar extinction and stellar confusion down to a galactic latitude of |b| = 5° for bright galaxies. Near-infrared wavelengths are sensitive to the old stellar populations that dominate galaxy masses, making 2MASS an excellent starting point to study the distribution of matter in the nearby universe. We selected a sample of 44,599 2MASS galaxies with K<SUB>s</SUB> 〈= 11.75 mag and |b| 〉= 5° (〉=8° toward the Galactic bulge) as the input catalog for our survey. We obtained spectroscopic observations for 11,000 galaxies and used previously obtained velocities for the remainder of the sample to generate a redshift catalog that is 97.6% complete to well-defined limits and covers 91% of the sky. This provides an unprecedented census of galaxy (baryonic mass) concentrations within 300 Mpc. Earlier versions of our survey have been used in a number of publications that have studied the bulk motion of the Local Group, mapped the density and peculiar velocity fields out to 50 h <SUP>-1</SUP> Mpc, detected galaxy groups, and estimated the values of several cosmological parameters. Additionally, we present morphological types for a nearly complete sub-sample of 20,860 galaxies with K<SUB>s</SUB> 〈= 11.25 mag and |b| 〉= 10°.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"43528\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"48916\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 228,
//       "id": "1953663",
//       "bibcode": "2012ApJS..199...26H",
//       "author": [
//         "Huchra, John P.",
//         "Macri, Lucas M.",
//         "Masters, Karen L.",
//         "Jarrett, Thomas H.",
//         "Berlind, Perry",
//         "Calkins, Michael",
//         "Crook, Aidan C.",
//         "Cutri, Roc",
//         "Erdoǧdu, Pirin",
//         "Falco, Emilio",
//         "George, Teddy",
//         "Hutcheson, Conrad M.",
//         "Lahav, Ofer",
//         "Mader, Jeff",
//         "Mink, Jessica D.",
//         "Martimbeau, Nathalie",
//         "Schneider, Stephen",
//         "Skrutskie, Michael",
//         "Tokarz, Susan",
//         "Westover, Michael"
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA ; This paper is mostly based on the text written by John Huchra before his death in 2010 October.;",
//         "George P. and Cynthia Woods Mitchell Institute for Fundamental Physics and Astronomy, Department of Physics and Astronomy, Texas A&M University, 4242 TAMU, College Station, TX 77843, USA",
//         "Institute for Cosmology and Gravitation, University of Portsmouth, Dennis Sciama Building, Burnaby Road, Portsmouth, PO1 3FX, UK ; SEPNet (South East Physics Network), UK",
//         "Infrared Processing and Analysis Center, California Institute of Technology, 770 S Wilson Ave., Pasadena, CA 91125, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Microsoft Corp., 1 Microsoft Way, Redmond, WA 98052, USA",
//         "SEPNet (South East Physics Network), UK",
//         "Department of Physics and Astronomy, University College London, London WC1E 6BT, UK",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Canada-France-Hawaii Telescope, 65-1238 Mamalahoa Hwy, Kamuela, HI 96743, USA",
//         "Kavli Institute for Particle Astrophysics and Cosmology, Stanford University, Stanford, CA 94309, USA",
//         "Department of Physics and Astronomy, University College London, London WC1E 6BT, UK",
//         "Keck Observatory, 65-1120 Mamalahoa Hwy, Kamuela, HI 96743, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Planétarium de Montréal, 1000 rue Saint-Jacques, Montréal, Québec H3C 1G7, Canada",
//         "Department of Astronomy, University of Massachusetts, Amherst, MA 01003, USA",
//         "Department of Astronomy, University of Virginia, Charlottesville, VA 22904, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "McKinsey & Co., 1420 Fifth Ave., Ste 3100, Seattle, WA 98101, USA"
//       ],
//       "pub_raw": "The Astrophysical Journal Supplement, Volume 199, Issue 2, article id. 26, <NUMPAGES>22</NUMPAGES> pp. (2012).",
//       "pub": "The Astrophysical Journal Supplement Series",
//       "volume": "199",
//       "doi": [
//         "10.1088/0067-0049/199/2/26"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "catalogs",
//         "galaxies: distances and redshifts",
//         "surveys",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "The 2MASS Redshift Survey—Description and Data Release"
//       ],
//       "page": [
//         "26"
//       ],
//       "[citations]": {
//         "num_references": 617,
//         "num_citations": 228
//       }
//     },
//     {
//       "pubdate": "2012-02-00",
//       "abstract": "A special set of observations that utilized exposure times six times longer than the main 2MASS survey measurements were conducted in the final year of 2MASS observatory operations. The 2MASS \"6x\" observations achieved sensitivities ~1 mag deeper than the main 2MASS survey, and covered approximately 590 deg2 of sky in 30 discrete regions. The 2MASS 6x Point Source Working Databases (6x-PSWDB and 6x-XSWDB) contain all detections extracted from the raw 6x imaging data during pipeline data reduction. The 6x WDB entries include reliable detections of astrophysical sources, as well as spurious detections of noise excursions, image artifacts and transient events such as meteor trails, cosmic rays and hot pixels. In addition, the WDBs may contain multiple, independent detections of objects scanned more than once during the 6x observations. The 2MASS 6x Point Source Catalogs (6x-PSC and 6x-XSC) is a subset of extractions in the 6x-PSWDB that have been identified to be high reliability source detections, with only one measurement of sources detected multiple times for uniformity. (1 data file).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "VizieR Online Data Catalog",
//       "citation_count": 75,
//       "volume": "2281",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "id": "2002041",
//       "page": [
//         "0"
//       ],
//       "bibcode": "2012yCat.2281....0C",
//       "keyword": [
//         "Infrared sources",
//         "Photometry: infrared",
//         "Surveys"
//       ],
//       "author": [
//         "Cutri, R. M.",
//         "Skrutskie, M. F.",
//         "van Dyk, S.",
//         "Beichman, C. A.",
//         "Carpenter, J. M.",
//         "Chester, T.",
//         "Cambresy, L.",
//         "Evans, T.",
//         "Fowler, J.",
//         "Gizis, J.",
//         "Howard, E.",
//         "Huchra, J.",
//         "Jarrett, T.",
//         "Kopan, E. L.",
//         "Kirkpatrick, J. D.",
//         "Light, R. M.",
//         "Marsh, K. A.",
//         "McCallon, H.",
//         "Schneider, S.",
//         "Stiening, R.",
//         "Sykes, M.",
//         "Weinberg, M.",
//         "Wheaton, W. A.",
//         "Wheelock, S.",
//         "Zacharias, N."
//       ],
//       "aff": [
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-"
//       ],
//       "pub_raw": "VizieR On-line Data Catalog: II/281.  Originally published in: 2012yCat.2281....0C",
//       "title": [
//         "VizieR Online Data Catalog: 2MASS 6X Point Source Working Database / Catalog (Cutri+ 2006)"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 75
//       }
//     },
//     {
//       "pubdate": "2011-12-00",
//       "abstract": "We perform aperture photometry and profile fitting on 419 globular cluster (GC) candidates with m<SUB>V</SUB> 〈= 23 mag identified in Hubble Space Telescope/Advanced Camera for Surveys BVI imaging, and estimate the effective radii of the clusters. We identify 85 previously known spectroscopically confirmed clusters, and newly identify 136 objects as good cluster candidates within the 3σ color and size ranges defined by the spectroscopically confirmed clusters, yielding a total of 221 probable GCs. The luminosity function peak for the 221 probable GCs with estimated total dereddening applied is V ~ (20.26 ± 0.13) mag, corresponding to a distance of ~3.7 ± 0.3 Mpc. The blue and red GC candidates, and the metal-rich and metal-poor spectroscopically confirmed clusters, respectively, are similar in half-light radius. Red confirmed clusters are about 6% larger in median half-light radius than blue confirmed clusters, and red and blue good GC candidates are nearly identical in half-light radius. The total population of confirmed and \"good\" candidates shows an increase in half-light radius as a function of galactocentric distance. Based on observations with the Hubble Space Telescope obtained at the Space Telescope Science Institute, operated by the Association of Universities for Research in Astronomy, Inc., under NASA contract NAS 5-26555. These observations are associated with Program GO-10250 and Program GO-10584.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"376\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"276\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 9,
//       "id": "1885955",
//       "bibcode": "2011AJ....142..183N",
//       "author": [
//         "Nantais, Julie B.",
//         "Huchra, John P.",
//         "Zezas, Andreas",
//         "Gazeas, Kosmas",
//         "Strader, Jay"
//       ],
//       "aff": [
//         "Departamento de Astronomía, Universidad de Concepción Av. Esteban Iturra s/n Barrio Universitario Casilla 160-C Concepcion, Chile",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA ; Also at Department of Physics, University of Crete, Heraklion, Greece. ; Also at Institute of Electronic Structure and LASER, Foundation for Research and Technology, Heraklion, Greece.",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 142, Issue 6, article id. 183, <NUMPAGES>14</NUMPAGES> pp. (2011).",
//       "pub": "The Astronomical Journal",
//       "volume": "142",
//       "doi": [
//         "10.1088/0004-6256/142/6/183"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "galaxies: individual: M81",
//         "galaxies: spiral",
//         "galaxies: star clusters: general",
//         "galaxies: stellar content",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "Hubble Space Telescope Photometry of Globular Clusters in M81"
//       ],
//       "page": [
//         "183"
//       ],
//       "[citations]": {
//         "num_references": 54,
//         "num_citations": 9
//       }
//     },
//     {
//       "pubdate": "2011-11-00",
//       "abstract": "Practical guide to X-ray astronomy for graduate students, professional astronomers and researchers. Presenting X-ray optics, basic detector physics and data analysis. It introduces the reduction and calibration of X-ray data, scientific analysis, archives, statistical issues and the particular problems of highly extended sources. The appendices provide reference material often required during data analysis. The handbook web page contains figures and tables: http://xrayastronomyhandbook.com/",
//       "citation_count": 1,
//       "id": "1908367",
//       "bibcode": "2011hxa..book.....A",
//       "author": [
//         "Arnaud, Keith",
//         "Smith, Randall",
//         "Siemiginowska, Aneta",
//         "Ellis, Richard",
//         "Huchra, John",
//         "Kahn, Steve",
//         "Rieke, George",
//         "Stetson, Peter B."
//       ],
//       "aff": [
//         "NASA Goddard Space Flight Center",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "NASA Goddard Space Flight Center",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "-",
//         "-"
//       ],
//       "pub_raw": "Handbook of X-ray Astronomy, by K. Arnaud, R. Smith, and A. Siemiginowska. ISBN: <ISBN>9780521883733</ISBN>. Cambridge, UK: Cambridge University Press, 2011.",
//       "title": [
//         "Handbook of X-ray Astronomy"
//       ],
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 1
//       }
//     },
//     {
//       "pubdate": "2011-06-00",
//       "abstract": "We perform a reconstruction of the cosmological large-scale flows in the nearby Universe using two complementary observational sets. The first, the SFI++ sample of Tully-Fisher (TF) measurements of galaxies, provides a direct probe of the flows. The second, the whole sky distribution of galaxies in the 2MASS (Two Micron All Sky Survey) redshift survey (2MRS), yields a prediction of the flows given the cosmological density parameter, Ω, and a biasing relation between mass and galaxies. We aim at an unbiased comparison between the peculiar velocity fields extracted from the two data sets and its implication on the cosmological parameters and the biasing relation. We expand the fields in a set of orthonormal basis functions, each representing a plausible realization of a cosmological velocity field smoothed in such a way as to give a nearly constant error on the derived SFI++ velocities. The statistical analysis is done on the coefficients of the modal expansion of the fields by means of the basis functions. Our analysis completely avoids the strong error covariance in the smoothed TF velocities by the use of orthonormal basis functions and employs elaborate mock data sets to extensively calibrate the errors in 2MRS predicted velocities. We relate the 2MRS galaxy distribution to the mass density field by a linear bias factor, b, and include a luminosity-dependent, ∝L<SUP>α</SUP>, galaxy weighting. We assess the agreement between the fields as a function of α and β=f(Ω)/b, where f is the growth factor of linear perturbations. The agreement is excellent with a reasonable χ<SUP>2</SUP> per degree of freedom. For α= 0, we derive 0.28 〈 β 〈 0.37 and 0.24 〈 β 〈 0.43, respectively, at the 68.3 per cent and 95.4 per cent confidence levels (CLs). For β= 0.33, we get α 〈 0.25 and α 〈 0.5, respectively, at the 68.3 per cent and 95.4 per cent CLs. We set a constraint on the fluctuation normalization, finding σ<SUB>8</SUB>= 0.66 ± 0.10, which is only 1.5σ deviant from Wilkinson Microwave Anisotropy Probe (WMAP) results. It is remarkable that σ<SUB>8</SUB> determined from this local cosmological test is close to the value derived from the cosmic microwave background, an indication of the precision of the standard model.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"4\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}"
//       ],
//       "citation_count": 69,
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "id": "1920223",
//       "bibcode": "2011MNRAS.413.2906D",
//       "author": [
//         "Davis, Marc",
//         "Nusser, Adi",
//         "Masters, Karen L.",
//         "Springob, Christopher",
//         "Huchra, John P.",
//         "Lemson, Gerard"
//       ],
//       "aff": [
//         "Departments of Astronomy & Physics, University of California, Berkeley, CA 94720, USA",
//         "Physics Department and the Asher Space Science Institute-Technion, Haifa 32000, Israel",
//         "Institute for Cosmology and Gravitation, University of Portsmouth, Dennis Sciama Building, Burnaby Road, Portsmouth PO1 3FX",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Max-Planck Institute of Astrophysics, Karl-Schwarzschild-Str. 1, 85741 Garching, Germany"
//       ],
//       "pub_raw": "Monthly Notices of the Royal Astronomical Society, Volume 413, Issue 4, pp. 2906-2922.",
//       "pub": "Monthly Notices of the Royal Astronomical Society",
//       "volume": "413",
//       "doi": [
//         "10.1111/j.1365-2966.2011.18362.x"
//       ],
//       "keyword": [
//         "cosmological parameters",
//         "dark matter",
//         "large-scale structure of Universe",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics",
//         "Astrophysics - Astrophysics of Galaxies",
//         "Astrophysics - High Energy Astrophysical Phenomena",
//         "High Energy Physics - Phenomenology"
//       ],
//       "title": [
//         "Local gravity versus local velocity: solutions for β and non-linear bias"
//       ],
//       "page": [
//         "2906"
//       ],
//       "[citations]": {
//         "num_references": 88,
//         "num_citations": 69
//       }
//     },
//     {
//       "pubdate": "2011-00-00",
//       "title": [
//         "Astronomical Publishing: Yesterday, Today and Tomorrow"
//       ],
//       "abstract": "Just in the last few years scientific publishing has moved rapidly away from the modes that served it well for over two centuries. As \"digital natives\" take over the field and rapid and open access comes to dominate the way we communicate, both scholarly journals and libraries need to adopt new business models to serve their communities. This is best done by identifying new \"added value\" such as databases, full text searching, full cross indexing while at the same time retaining the high quality of peer reviewed publication.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "Astrophysics and Space Science Proceedings",
//       "citation_count": 0,
//       "volume": "1",
//       "doi": [
//         "10.1007/978-1-4419-8369-5_2"
//       ],
//       "id": "1893399",
//       "page": [
//         "11"
//       ],
//       "bibcode": "2011ASSP...24...11H",
//       "author": [
//         "Huchra, John"
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics"
//       ],
//       "pub_raw": "Future Professional Communication in Astronomy II, Astrophysics and Space Science Proceedings, Volume 1. ISBN 978-1-4419-8368-8. Springer Science+Business Media, LLC, 2011, p. 11",
//       "property": [
//         "REFEREED",
//         "ARTICLE"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2011-01-00",
//       "title": [
//         "The Flow-field From Galaxy Groups In 2MASS"
//       ],
//       "abstract": "We present the first model of a flow-field in the nearby Universe (cz 〈 12,000 km/s) constructed from groups of galaxies identified in an all-sky flux-limited survey. The Two Micron All-Sky Redshift Survey (2MRS), upon which the model is based, represents the most complete survey of its class and, with near-IR fluxes, provides the optimal method for tracing baryonic matter in the nearby Universe. Peculiar velocities are reconstructed self-consistently with a density-field based upon groups identified in the 2MRS K<SUB>s</SUB>〈11.75 catalog. The model predicts infall toward Virgo, Perseus-Pisces, Hydra-Centaurus, Norma, Coma, Shapley and Hercules, and most notably predicts backside-infall into the Norma Cluster. We discuss the application of the model as a predictor of galaxy distances using only angular position and redshift measurements. By calibrating the model using measured distances to galaxies inside 3000 km/s, we show that, for a randomly-sampled 2MRS galaxy, improvement in the estimated distance over the application of Hubble's law is expected to be 30%, and considerably better in the proximity of clusters. We test the model using distance estimates from the SFI++ sample, and find evidence for improvement over the application of Hubble's law to galaxies inside 4000 km/s, although the performance varies depending on the location of the target. This work has been supported by NSF grant AST 0406906 and the Massachusetts Institute of Technology Bruno Rossi and Whiteman Fellowships.",
//       "pub": "American Astronomical Society Meeting Abstracts #217",
//       "citation_count": 0,
//       "volume": "217",
//       "id": "1878790",
//       "page": [
//         "150"
//       ],
//       "bibcode": "2011AAS...21715002C",
//       "author": [
//         "Crook, Aidan",
//         "Huchra, J.",
//         "Macri, L.",
//         "Masters, K.",
//         "Jarrett, T."
//       ],
//       "aff": [
//         "Microsoft",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "Texas A&M University",
//         "University of Portsmouth, United Kingdom",
//         "California Institute of Technology"
//       ],
//       "pub_raw": "American Astronomical Society, AAS Meeting #217, id.150.02; <ALTJOURNAL>Bulletin of the American Astronomical Society, Vol. 43, 2011</ALTJOURNAL>",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2010-09-00",
//       "abstract": "The Two Micron All-Sky Survey (2MASS) has provided a uniform photometric catalog to search for previously unknown red active galactic nuclei (AGN) and Quasi-Stellar Objects (QSOs). We have extended the search to the southern equatorial sky by obtaining spectra for 1182 AGN candidates using the six degree field (6dF) multifibre spectrograph on the UK Schmidt Telescope. These were scheduled as auxiliary targets for the 6dF Galaxy Redshift Survey. The candidates were selected using a single color cut of J-K<SUB>s</SUB>〉2 to K<SUB>s</SUB>〈~15.5 and a galactic latitude of |b|〉30°. 432 spectra were of sufficient quality to enable a reliable classification. 116 sources (~27%) were securely classified as type I AGN, 20 as probable type I AGN, and 57 as probable type II AGN. Most of them span the redshift range 0.05〈z〈0.5 and only 8 (~6%) were previously identified as AGN or QSOs. Our selection leads to a significantly higher AGN identification rate amongst local galaxies (〉20%) than in any previous (mostly blue-selected) galaxy survey. A small fraction of the type I AGN could have their optical colors reddened by optically thin dust with A<SUB>V</SUB>〈2mag relative to optically selected QSOs. A handful show evidence of excess far-infrared (IR) emission. The equivalent width (EW) and color distributions of the type I and II AGN are consistent with AGN unified models. In particular, the EW of the [Oiii] emission line weakly correlates with optical-near-IR color in each class of AGN, suggesting anisotropic obscuration of the AGN continuum. Overall, the optical properties of the 2MASS red AGN are not dramatically different from those of optically-selected QSOs. Our near-IR selection appears to detect the most near-IR luminous QSOs in the local universe to z~=0.6 and provides incentive to extend the search to deeper near-IR surveys.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "id": "1868893",
//       "bibcode": "2010PASA...27..302M",
//       "aff": [
//         "Infrared Processing and Analysis Center, Caltech 100-22, Pasadena, CA 91125, USA",
//         "Infrared Processing and Analysis Center, Caltech 100-22, Pasadena, CA 91125, USA",
//         "Australian National University, ACT 0200, Australia",
//         "Infrared Processing and Analysis Center, Caltech 100-22, Pasadena, CA 91125, USA; Vermont Academy, Saxtons River, VT 05154, USA",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA 02138, USA",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia"
//       ],
//       "pub_raw": "Publications of the Astronomical Society of Australia, Volume 27, Issue 3, pp. 302-320.",
//       "pub": "Publications of the Astronomical Society of Australia",
//       "volume": "27",
//       "doi": [
//         "10.1071/AS10001"
//       ],
//       "keyword": [
//         "galaxies: active",
//         "quasars: general",
//         "infrared: general",
//         "surveys",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics",
//         "Astrophysics - Astrophysics of Galaxies"
//       ],
//       "author": [
//         "Masci, Frank J.",
//         "Cutri, Roc M.",
//         "Francis, Paul J.",
//         "Nelson, Brant O.",
//         "Huchra, John P.",
//         "Heath Jones, D.",
//         "Colless, Matthew",
//         "Saunders, Will"
//       ],
//       "citation_count": 1,
//       "title": [
//         "The Southern 2MASS Active Galactic Nuclei Survey: Spectroscopic Follow-up with Six Degree Field"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "ARTICLE"
//       ],
//       "page": [
//         "302"
//       ],
//       "[citations]": {
//         "num_references": 58,
//         "num_citations": 1
//       }
//     },
//     {
//       "pubdate": "2010-06-00",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"5\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "Central Bureau Electronic Telegrams",
//       "citation_count": 0,
//       "volume": "2338",
//       "id": "1830501",
//       "page": [
//         "2"
//       ],
//       "bibcode": "2010CBET.2338....2N",
//       "author": [
//         "Nantais, J.",
//         "Huchra, J."
//       ],
//       "aff": [
//         "-",
//         "-"
//       ],
//       "pub_raw": "Central Bureau Electronic Telegrams, Vol. 2338, p. 2 (2010)",
//       "title": [
//         "Novae in M81: M81N 2010-06a, M81N 2010-06b, M81N 2010-06c, M81N 2010-06d."
//       ],
//       "property": [
//         "PRIVATE",
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2010-06-00",
//       "abstract": "We obtained spectra of 74 globular clusters (GCs) in M81. These GCs had been identified as candidates in a Hubble Space Telescope (HST) Advanced Camera for Surveys I-band survey. Sixty-eight of these 74 clusters lie within 7' of the M81 nucleus. Sixty-two of these clusters are newly spectroscopically confirmed, more than doubling the number of confirmed M81 GCs from 46 to 108. We determined metallicities for our 74 observed clusters using an empirical calibration based on Milky Way GCs. We combined our results with 34 M81 GC velocities and 33 metallicities from the literature and analyzed the kinematics and metallicity of the M81 GC system. The mean of the total sample of 107 metallicities is -1.06 ± 0.07, higher than either M31 or the Milky Way. We suspect that this high mean metallicity is due to an overrepresentation of metal-rich (MR) clusters in our sample created by the spatial limits of the HST I-band survey. The metallicity distribution shows marginal evidence for bimodality, with the mean metallicities of MR and metal-poor (MP) GCs similar to those of M31 and the Milky Way. The GC system as a whole, and the MP GCs alone, show evidence of a radial metallicity gradient. The M81 GC system as a whole shows strong evidence of rotation, with V <SUB> r </SUB> (deprojected) = 108 ± 22 km s<SUP>-1</SUP> overall. This result is likely biased toward high rotational velocity due to overrepresentation of MR inner clusters. The rotation patterns among GC subpopulations are roughly similar to those of the Milky Way: clusters at small projected radii and MR clusters rotate strongly, while clusters at large projected radii and MP clusters show weaker evidence of rotation. This study uses observations from the MMT Observatory, a joint facility of the Smithsonian Institution and the University of Arizona.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"186\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"194\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 14,
//       "id": "1821301",
//       "bibcode": "2010AJ....139.2620N",
//       "author": [
//         "Nantais, Julie B.",
//         "Huchra, John P."
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 139, Issue 6, pp. 2620-2638 (2010).",
//       "pub": "The Astronomical Journal",
//       "volume": "139",
//       "doi": [
//         "10.1088/0004-6256/139/6/2620"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "galaxies: individual: M81",
//         "galaxies: spiral",
//         "galaxies: star clusters: general",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "Spectroscopy of M81 Globular Clusters"
//       ],
//       "page": [
//         "2620"
//       ],
//       "[citations]": {
//         "num_references": 42,
//         "num_citations": 14
//       }
//     },
//     {
//       "pubdate": "2010-04-00",
//       "abstract": "We present a catalog of extended objects in the vicinity of M81 based on a set of 24 Hubble Space Telescope Advanced Camera for Surveys Wide Field Camera F814W (I-band) images. We have found 233 good globular cluster (GC) candidates; 92 candidate H II regions, OB associations, or diffuse open clusters; 489 probable background galaxies; and 1719 unclassified objects. We have color data from ground-based g- and r-band MMT Megacam images for 79 galaxies, 125 GC candidates, 7 H II regions, and 184 unclassified objects. The color-color diagram of GC candidates shows that most fall into the range 0.25 〈 g - r 〈 1.25 and 0.5 〈 r - I 〈 1.25, similar to the color range of Milky Way GCs. Unclassified objects are often blue, suggesting that many of them are likely to be H II regions and open clusters, although a few galaxies and GCs may be among them.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"2534\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"16\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 5,
//       "id": "1821045",
//       "bibcode": "2010AJ....139.1413N",
//       "author": [
//         "Nantais, Julie B.",
//         "Huchra, John P.",
//         "McLeod, Brian",
//         "Strader, Jay",
//         "Brodie, Jean P."
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "University of California Observatoires/Lick Observatory Santa Cruz, CA 95064, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 139, Issue 4, pp. 1413-1425 (2010).",
//       "pub": "The Astronomical Journal",
//       "volume": "139",
//       "doi": [
//         "10.1088/0004-6256/139/4/1413"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "galaxies: individual: M81",
//         "galaxies: spiral",
//         "galaxies: star clusters: general",
//         "galaxies: stellar content",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "Star Cluster Candidates in M81"
//       ],
//       "page": [
//         "1413"
//       ],
//       "[citations]": {
//         "num_references": 21,
//         "num_citations": 5
//       }
//     },
//     {
//       "pubdate": "2010-03-00",
//       "abstract": "We present new metallicity estimates for globular cluster (GC) candidates in the Sd spiral NGC 300, one of the nearest spiral galaxies outside the Local Group. We have obtained optical spectroscopy for 44 Sculptor Group GC candidates with the Boller and Chivens (B&C) spectrograph on the Baade Telescope at Las Campanas Observatory. There are two GCs in NGC 253 and 12 objects in NGC 300 with globular-cluster-like spectral features, nine of which have radial velocities above 0 km s<SUP>-1</SUP>. The remaining three, due to their radial velocities being below the expected 95% confidence limit for velocities of NGC 300 halo objects, are flagged as possible foreground stars. The non-cluster-like candidates included 13 stars, 15 galaxies, and an H II region. One GC, four galaxies, two stars, and the H II region from our sample were identified in archival Hubble Space Telescope images. For the GCs, we measure spectral indices and estimate metallicities using an empirical calibration based on Milky Way GCs. The GCs of NGC 300 appear similar to those of the Milky Way. Excluding possible stars and including clusters from the literature, the GC system (GCS) has a velocity dispersion of 68 km s<SUP>-1</SUP> and has no clear evidence of rotation. The mean metallicity for our full cluster sample plus one literature object is [Fe/H] = -0.94, lying above the relationship between mean GC metallicity and overall galaxy luminosity. Excluding the three low-velocity candidates, we obtain a mean [Fe/H] = -0.98, still higher than expected, raising the possibility of significant foreground star contamination even in this sample. Visual confirmation of genuine GCs using high-resolution space-based imagery could greatly reduce the potential problem of interlopers in small samples of GCSs in low-radial-velocity galaxies. Data for this project were obtained at the Baade 6.5 m telescope, Las Campanas Observatory, Chile. This publication makes use of data products from the Two Micron All Sky Survey, which is a joint project of the University of Massachusetts and the Infrared Processing and Analysis Center/California Institute of Technology, funded by the National Aeronautics and Space Administration and the National Science Foundation.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"7\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"76\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "id": "1821011",
//       "bibcode": "2010AJ....139.1178N",
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Physics and Astronomy Department, University of Western Ontario, 1151 Richmond Street, London, ON, Canada N6A 3K7",
//         "Cerro-Tololo Inter-American Observatory, National Optical Astronomy Observatory, Casilla 603, La Serena, Chile"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 139, Issue 3, pp. 1178-1189 (2010).",
//       "pub": "The Astronomical Journal",
//       "volume": "139",
//       "doi": [
//         "10.1088/0004-6256/139/3/1178"
//       ],
//       "keyword": [
//         "galaxies: individual: NGC 300",
//         "galaxies: spiral",
//         "galaxies: star clusters: general"
//       ],
//       "author": [
//         "Nantais, Julie B.",
//         "Huchra, John P.",
//         "Barmby, Pauline",
//         "Olsen, Knut A. G."
//       ],
//       "citation_count": 8,
//       "title": [
//         "Nearby Spiral Galaxy Globular Cluster Systems. II. Globular Cluster Metallicities in NGC 300"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "page": [
//         "1178"
//       ],
//       "[citations]": {
//         "num_references": 56,
//         "num_citations": 8
//       }
//     },
//     {
//       "pubdate": "2010-02-00",
//       "abstract": "The final redshift release of the 6dF Galaxy Survey (6dFGS) is a combined redshift and peculiar velocity survey over the southern sky (|b|〉10°). Its 136304 spectra have yielded 110256 new extragalactic redshifts and a new catalogue of 125071 galaxies making near-complete samples with limits in (K, H, J, rF, bJ) (12.65, 12.95, 13.75, 15.60, 16.75). The median redshift of the survey is 0.053. The catalog includes basic data for the galaxies in the 6dFGS with redshifts, using the best 6dFGS redshifts (Q=3 or 4) plus available redshifts from SDSS, 2dFGRS and ZCAT (124647 entries in all). It supersedes the previous DR2 version (Cat. VII/249). The URL of the 6dFGS data base is: http://www-wfau.roe.ac.uk/6dFGS (2 data files).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "VizieR Online Data Catalog",
//       "citation_count": 2,
//       "volume": "7259",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "id": "1876491",
//       "page": [
//         "0"
//       ],
//       "bibcode": "2010yCat.7259....0J",
//       "keyword": [
//         "Surveys",
//         "Galaxy catalogs",
//         "Redshifts",
//         "Galaxies: photometry"
//       ],
//       "author": [
//         "Jones, D. H.",
//         "Read, M. A.",
//         "Saunders, W.",
//         "Colless, M.",
//         "Jarrett, T.",
//         "Parker, Q. A.",
//         "Fairall, A. P.",
//         "Mauch, T.",
//         "Sadler, E. M.",
//         "Watson, F. G.",
//         "Burton, D.",
//         "Campbell, L. A.",
//         "Cass, P.",
//         "Croom, S. M.",
//         "Dawe, J.",
//         "Fiegert, K.",
//         "Frankcombe, L.",
//         "Hartley, M.",
//         "Huchra, J.",
//         "James, D.",
//         "Kirby, E.",
//         "Lahav, O.",
//         "Lucey, J.",
//         "Mamon, G. A.",
//         "Moore, L.",
//         "Peterson, B. A.",
//         "Prior, S.",
//         "Proust, D.",
//         "Russell, K.",
//         "Safouris, V.",
//         "Wakamatsu, K. -I.",
//         "Westra, E.",
//         "Williams, M."
//       ],
//       "aff": [
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-"
//       ],
//       "pub_raw": "VizieR On-line Data Catalog: VII/259.  Originally published in: 2009MNRAS.399..683J",
//       "title": [
//         "VizieR Online Data Catalog: 6dF galaxy survey final redshift release (Jones+, 2009)"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 2
//       }
//     },
//     {
//       "pubdate": "2010-02-00",
//       "abstract": "Basic data for the galaxies in the 6dFGS with redshifts, using the best 6dFGS redshifts (Q=3 or 4) plus available redshifts from SDSS, 2dFGRS and ZCAT (124646 entries in all). (1 data file).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "VizieR Online Data Catalog",
//       "citation_count": 0,
//       "volume": "739",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "id": "1876209",
//       "page": [
//         "90683"
//       ],
//       "bibcode": "2010yCat..73990683J",
//       "keyword": [
//         "Surveys",
//         "Galaxy catalogs",
//         "Redshifts",
//         "Magnitudes"
//       ],
//       "author": [
//         "Jones, D. H.",
//         "Read, M. A.",
//         "Saunders, W.",
//         "Colless, M.",
//         "Jarrett, T.",
//         "Parker, Q. A.",
//         "Fairall, A. P.",
//         "Mauch, T.",
//         "Sadler, E. M.",
//         "Watson, F. G.",
//         "Burton, D.",
//         "Campbell, L. A.",
//         "Cass, P.",
//         "Croom, S. M.",
//         "Dawe, J.",
//         "Fiegert, K.",
//         "Frankcombe, L.",
//         "Hartley, M.",
//         "Huchra, J.",
//         "James, D.",
//         "Kirby, E.",
//         "Lahav, O.",
//         "Lucey, J.",
//         "Mamon, G. A.",
//         "Moore, L.",
//         "Peterson, B. A.",
//         "Prior, S.",
//         "Proust, D.",
//         "Russell, K.",
//         "Safouris, V.",
//         "Wakamatsu, K. -I.",
//         "Westra, E.",
//         "Williams, M."
//       ],
//       "aff": [
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-",
//         "-"
//       ],
//       "pub_raw": "VizieR On-line Data Catalog: J/MNRAS/399/683. Originally published in: 2009MNRAS.399..683J",
//       "title": [
//         "VizieR Online Data Catalog: 6dF galaxy survey final redshift release (6dFGS) (Jones+, 2009)"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2010-02-00",
//       "title": [
//         "NGVS-S: A Comprehensive Spectroscopic Survey of Virgo"
//       ],
//       "abstract": "As the dominant mass concentration in the local Universe and the largest collection of galaxies within ~35 Mpc, the Virgo cluster has historically played a key role in studies of how galaxies evolve in dense environments. Closer to home, two of the most important Milky Way halo substructures, the Sagittarius (Sgr) stream and the Virgo Overdensity, are also in this region of sky. Building on deep CFHT/Megacam u^*g'r'i'z' imaging from the Next Generation Virgo Survey (NGVS), this proposal capitalizes on the wide field and multiplexing capabilities of MMT/Hectospec to carry out deep spectroscopic observations of the NGVS. Using 21 Hectospec pointings over two semesters, we will obtain spectra for dwarf galaxies, globular clusters, and foreground halo stars over 17 deg^2 around and between Virgo's four most massive ellipticals. The combination of Hectospec and CFHT will provide an unprecedented view of this uniquely important cluster, allowing us to: 1) Characterize the faint end of the galaxy luminosity function within the magnitude range over which current studies significantly disagree, 2) Conduct the first kinematic survey of intracluster GCs in any cluster, and constrain the mass profile and GC velocity ellipsoid in the Virgo subclusters, and 3) Determine the chemodynamical structure of the Sgr stream and Virgo Overdensity in the Milky Way halo.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "pub": "NOAO Proposal",
//       "citation_count": 0,
//       "id": "1866808",
//       "page": [
//         "445"
//       ],
//       "bibcode": "2010noao.prop..445P",
//       "author": [
//         "Peng, Eric",
//         "Ferrarese, Laura",
//         "Blakeslee, John",
//         "Cote, Patrick",
//         "Durrell, Patrick",
//         "Huchra, John",
//         "Mihos, Christopher",
//         "Beers, Timothy",
//         "Ball, Nick",
//         "Courteau, Stephane",
//         "Duc, Pierre-Alain",
//         "Jordan, Andres",
//         "Emsellem, Eric",
//         "Lancon, Ariane",
//         "Liu, Chengze",
//         "MacArthur, Lauren",
//         "McConnachie, Alan",
//         "McLaughlin, Dean",
//         "Puzia, Thomas",
//         "Caldwell, Nelson",
//         "Yanny, Brian"
//       ],
//       "aff": [
//         "Peking University",
//         "NRC-Herzberg Institute of Astrophysics",
//         "NRC-Herzberg Institute of Astrophysics",
//         "NRC-Herzberg Institute of Astrophysics",
//         "Youngstown State University",
//         "Harvard University",
//         "Case Western Reserve University",
//         "Michigan State University",
//         "NRC-Herzberg Institute of Astrophysics",
//         "Queens University",
//         "CEA-Saclay",
//         "Pontifica Catolica Universidad de Chile",
//         "CRA-Lyon",
//         "Observatoire astronomique de Strasbourg",
//         "Peking Universty",
//         "NRC-Herzberg Institute of Astrophysics",
//         "NRC-Herzberg Institute of Astrophysics",
//         "Keele University",
//         "NRC-Herzberg Institute of Astrophysics",
//         "Harvard-Smithsonian Center for Astrophysics",
//         "Fermi National Accelerator Laboratory"
//       ],
//       "pub_raw": "NOAO Proposal ID #2010A-0445",
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2010-02-00",
//       "abstract": "<BR /> Aims: We present the main results of an imaging survey of possible young massive clusters (YMC) in M 31 performed with the Wide Field and Planetary Camera 2 (WFPC2) on the Hubble Space Telescope (HST), with the aim of estimating their age and their mass. We obtained shallow (to B ̃ 25) photometry of individual stars in 19 clusters (of the 20 targets of the survey). We present the images and color magnitude diagrams (CMDs) of all of our targets. <BR /> Methods: Point spread function fitting photometry of individual stars was obtained for all the WFPC2 images of the target clusters, and the completeness of the final samples was estimated using extensive sets of artificial stars experiments. The reddening, age, and metallicity of the clusters were estimated by comparing the observed CMDs and luminosity functions (LFs) with theoretical models. Stellar masses were estimated by comparison with theoretical models in the log(Age) vs. absolute integrated magnitude plane, using ages estimated from our CMDs and integrated J, H, K magnitudes from 2MASS-6X. <BR /> Results: Nineteen of the twenty surveyed candidates were confirmed to be real star clusters, while one turned out to be a bright star. Three of the clusters were found not to be good YMC candidates from newly available integrated spectroscopy and were in fact found to be old from their CMD. Of the remaining sixteen clusters, fourteen have ages between 25 Myr and 280 Myr, two have older ages than 500 Myr (lower limits). By including ten other YMC with HST photometry from the literature, we assembled a sample of 25 clusters younger than 1 Gyr, with mass ranging from 0.6× 10^4 M<SUB>sun</SUB> to 6× 10^4 M<SUB>sun</SUB>, with an average of ̃3× 10^4 M<SUB>sun</SUB>. Our estimates of ages and masses well agree with recent independent studies based on integrated spectra. <BR /> Conclusions: The clusters considered here are confirmed to have masses significantly higher than Galactic open clusters (OC) in the same age range. Our analysis indicates that YMCs are relatively common in all the largest star-forming galaxies of the Local Group, while the lack of known YMC older than 20 Myr in the Milky Way may stem from selection effects. Based on observations made with the NASA/ESA Hubble Space Telescope, obtained at the Space Telescope Science Institute, which is operated by the Association of Universities for Research in Astronomy, Inc., under NASA contract NAS 5-26555. These observations are associated with program GO-10818 [P.I.: J.G. Cohen].Plaskett Fellow.Hubble Fellow.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"1\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"postscript\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"114\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "id": "1810944",
//       "bibcode": "2010A&A...511A..23P",
//       "aff": [
//         "INAF - Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy ; Università di Bologna, Dipartimento di Astronomia, via Ranzani 1, 40127 Bologna, Italy",
//         "Palomar Observatory, Mail Stop 105-24, California Institute of Technology, Pasadena, CA 91125, USA",
//         "Department of Physics and Astronomy, University of Western Ontario, London, ON, Canada N6A 3K7, Canada",
//         "UCO/Lick Observatory, University of California, Santa Cruz, CA 95064, USA; Instituto de Astrofisica de Canarias, La Laguna 38200, Canary Islands, Spain",
//         "INAF - Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy",
//         "UCO/Lick Observatory, University of California, Santa Cruz, CA 95064, USA",
//         "INAF - Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna",
//         "INAF - Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy",
//         "INAF - Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy",
//         "Department of Astronomy, University of Washington, Seattle, WA 98195, USA",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA",
//         "European Southern Observatory, Karl-Schwarzschild-Strasse 2, 85748 Garching bei München, Germany",
//         "Herzberg Institute of Astrophysics, 5071 West Saanich Road, Victoria, BC V9E 2E7, Canada",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA"
//       ],
//       "pub_raw": "Astronomy and Astrophysics, Volume 511, id.A23, <NUMPAGES>25</NUMPAGES> pp.",
//       "pub": "Astronomy and Astrophysics",
//       "volume": "511",
//       "doi": [
//         "10.1051/0004-6361/200913459"
//       ],
//       "keyword": [
//         "galaxies: star clusters",
//         "galaxies: individual: M 31",
//         "supergiants",
//         "stars: evolution",
//         "Astrophysics - Astrophysics of Galaxies"
//       ],
//       "author": [
//         "Perina, S.",
//         "Cohen, J. G.",
//         "Barmby, P.",
//         "Beasley, M. A.",
//         "Bellazzini, M.",
//         "Brodie, J. P.",
//         "Federici, L.",
//         "Fusi Pecci, F.",
//         "Galleti, S.",
//         "Hodge, P. W.",
//         "Huchra, J. P.",
//         "Kissler-Patig, M.",
//         "Puzia, T. H.",
//         "Strader, J."
//       ],
//       "citation_count": 25,
//       "title": [
//         "An HST/WFPC2 survey of bright young clusters in M 31. IV. Age and mass estimates"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "page": [
//         "A23"
//       ],
//       "[citations]": {
//         "num_references": 137,
//         "num_citations": 25
//       }
//     },
//     {
//       "pubdate": "2009-12-00",
//       "abstract": "Surface brightness profiles for 23 M31 star clusters were measured using images from the Wide Field Planetary Camera 2 on the Hubble Space Telescope, and fitted to two types of models to determine the clusters' structural properties. The clusters are primarily young (~10<SUP>8</SUP> yr) and massive (~10<SUP>4.5</SUP> M <SUB>sun</SUB>), with median half-light radius 7 pc and dissolution times of a few Gyr. The properties of the M31 clusters are comparable to those of clusters of similar age in the Magellanic Clouds. Simulated star clusters are used to derive a conversion from statistical measures of cluster size to half-light radius so that the extragalactic clusters can be compared to young massive clusters in the Milky Way. All three sets of star clusters fall approximately on the same age-size relation. The young M31 clusters are expected to dissolve within a few Gyr and will not survive to become old, globular clusters. However, they do appear to follow the same fundamental plane (FP) relations as old clusters; if confirmed with velocity dispersion measurements, this would be a strong indication that the star cluster FP reflects universal cluster formation conditions. Based on observations made with the NASA/ESA Hubble Space Telescope, obtained at the Space Telescope Science Institute, which is operated by the Association of Universities for Research in Astronomy, Inc., under NASA contract NAS 5-26555. These observations are associated with program GO-10818 (PI: J. Cohen) and GO-8296 (PI: P. Hodge).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"25\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"31\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"spires\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 32,
//       "id": "1760138",
//       "bibcode": "2009AJ....138.1667B",
//       "author": [
//         "Barmby, P.",
//         "Perina, S.",
//         "Bellazzini, M.",
//         "Cohen, J. G.",
//         "Hodge, P. W.",
//         "Huchra, J. P.",
//         "Kissler-Patig, M.",
//         "Puzia, T. H.",
//         "Strader, J."
//       ],
//       "aff": [
//         "Department of Physics and Astronomy, University of Western Ontario, London, ON N6A 3K7, Canada",
//         "INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy; Università di Bologna, Dipartimento di Astronomia, via Ranzani 1, 40127 Bologna, Italy",
//         "INAF-Osservatorio Astronomico di Bologna, via Ranzani 1, 40127 Bologna, Italy; Università di Bologna, Dipartimento di Astronomia, via Ranzani 1, 40127 Bologna, Italy",
//         "Palomar Observatory, Mail Stop 105-24, California Institute of Technology, Pasadena, CA 91125, USA",
//         "Department of Astronomy, University of Washington, Seattle, WA 98195, USA",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA 02138, USA",
//         "European Southern Observatory, Karl-Schwarzschild-Strasse 2, 85748 Garching bei München, Germany",
//         "Herzberg Institute of Astrophysics, 5071 West Saanich Road, Victoria, BC V9E 2E7, Canada",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA 02138, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 138, Issue 6, pp. 1667-1680 (2009).",
//       "pub": "The Astronomical Journal",
//       "volume": "138",
//       "doi": [
//         "10.1088/0004-6256/138/6/1667"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "galaxies: individual: Messier: Number M31",
//         "galaxies: star clusters",
//         "globular clusters: general",
//         "Astrophysics - Galaxy Astrophysics"
//       ],
//       "title": [
//         "A Hubble Space Telescope/WFPC2 Survey of Bright Young Clusters in M31. III. Structural Parameters"
//       ],
//       "page": [
//         "1667"
//       ],
//       "[citations]": {
//         "num_references": 74,
//         "num_citations": 32
//       }
//     },
//     {
//       "pubdate": "2009-12-00",
//       "abstract": "The Cosmic Evolution Survey (COSMOS) provides a unique opportunity for the study of AGN with a combination of deep radio (VLA), infrared (Spitzer MIPS & IRAC), optical (Hubble/ACS & 21-band (Subaru/Suprime-Cam), UV (GALEX), and X-ray (XMM & Chandra) observations over 2 deg<SUP>2</SUP>. I will present results from a 3-year spectroscopic survey of X-ray and IR selected AGN in COSMOS using the Magellan/IMACS and MMT/Hectospec instruments. This spectroscopic sample reaches the customary quasar/Seyfert luminosity boundary at z 2, and also reveals Type 1 AGN with black hole masses of only 10<SUP>7</SUP> M<SUB>sun</SUB> to z 2. The IR selection additionally allows us to observe a large number of heavily obscured AGN, which recent pencil-beam surveys have revealed to be a significant fraction of the total AGN population. The obscured fraction of AGN in COSMOS shows the well-known luminosity dependence, but also shows the most significant evidence to date for redshift evolution. These dependencies suggest a strong case for dusty star formation driving AGN obscuration, with luminous AGN luminosity providing negative feedback. COSMOS also allows for new constraints on fueling mechanisms of obscured and unobscured AGN. A large sample of Type 1 AGN allows us to suggest limits on accretion rate for the presence of a stable BLR. And the largest sample of X-ray bright / optical normal galaxies (XBONGs) to date, complete with bolometric SEDs, suggests that these targets are actually radiatively inefficient accretors with truncated accretion disks. I will try to place these ideas in the framework of the AGN unified model and discuss how they might be especially tested with future Herschel and ALMA observations.",
//       "pub": "American Astronomical Society Meeting Abstracts #213",
//       "citation_count": 0,
//       "volume": "213",
//       "id": "1753671",
//       "page": [
//         "608"
//       ],
//       "bibcode": "2009AAS...21360808T",
//       "author": [
//         "Trump, Jonathan R.",
//         "Impey, C. D.",
//         "Elvis, M.",
//         "McCarthy, P. J.",
//         "Huchra, J. P.",
//         "Brusa, M.",
//         "Salvato, M.",
//         "Gabor, J.",
//         "Kelly, B. C.",
//         "Scoville, N. Z."
//       ],
//       "aff": [
//         "University of Arizona",
//         "University of Arizona",
//         "Harvard/CfA",
//         "Carnegie",
//         "Harvard/CfA",
//         "Max Planck, Germany",
//         "Caltech",
//         "University of Arizona",
//         "Harvard/CfA",
//         "Caltech"
//       ],
//       "pub_raw": "American Astronomical Society, AAS Meeting #213, id.608.08",
//       "title": [
//         "The Cosmos AGN Survey: The Nature of Faint, Weak, and Obscured AGN"
//       ],
//       "property": [
//         "NONARTICLE",
//         "NOT REFEREED"
//       ],
//       "[citations]": {
//         "num_references": 0,
//         "num_citations": 0
//       }
//     },
//     {
//       "pubdate": "2009-11-00",
//       "abstract": "We present infrared, optical, and X-ray data of 48 X-ray bright, optically dull active galactic nuclei (AGNs) in the COSMOS field. These objects exhibit the X-ray luminosity of an AGN but lack broad and narrow emission lines in their optical spectrum. We show that despite the lack of optical emission lines, most of these optically dull AGNs are not well described by a typical passive red galaxy spectrum: instead they exhibit weak but significant blue emission like an unobscured AGN. Photometric observations over several years additionally show significant variability in the blue emission of four optically dull AGNs. The nature of the blue and infrared emission suggest that the optically inactive appearance of these AGNs cannot be caused by obscuration intrinsic to the AGNs. Instead, up to ~70% of optically dull AGNs are diluted by their hosts, with bright or simply edge-on hosts lying preferentially within the spectroscopic aperture. The remaining ~30% of optically dull AGNs have anomalously high f<SUB>X</SUB> /f<SUB>O</SUB> ratios and are intrinsically weak, not obscured, in the optical. These optically dull AGNs are best described as a weakly accreting AGN with a truncated accretion disk from a radiatively inefficient accretion flow. Based on observations with the NASA/ESA Hubble Space Telescope, obtained at the Space Telescope Science Institute, which is operated by AURA Inc, under NASA contract NAS 5-26555; the Magellan Telescope, which is operated by the Carnegie Observatories; and the Subaru Telescope, which is operated by the National Astronomical Observatory of Japan.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"48\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"50\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"spires\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 37,
//       "id": "1763947",
//       "bibcode": "2009ApJ...706..797T",
//       "author": [
//         "Trump, Jonathan R.",
//         "Impey, Chris D.",
//         "Taniguchi, Yoshi",
//         "Brusa, Marcella",
//         "Civano, Francesca",
//         "Elvis, Martin",
//         "Gabor, Jared M.",
//         "Jahnke, Knud",
//         "Kelly, Brandon C.",
//         "Koekemoer, Anton M.",
//         "Nagao, Tohru",
//         "Salvato, Mara",
//         "Shioya, Yasuhiro",
//         "Capak, Peter",
//         "Huchra, John P.",
//         "Kartaltepe, Jeyhan S.",
//         "Lanzuisi, Giorgio",
//         "McCarthy, Patrick J.",
//         "Maineri, Vincenzo",
//         "Scoville, Nick Z."
//       ],
//       "aff": [
//         "Steward Observatory, University of Arizona, 933 North Cherry Avenue, Tucson, AZ 85721, USA",
//         "Steward Observatory, University of Arizona, 933 North Cherry Avenue, Tucson, AZ 85721, USA",
//         "Research Center for Space & Cosmic Evolution, Ehime University, 2-5 Bunkyo-cho, Matsuyama 790-8577, Japan",
//         "Max-Planck-Institut für extraterrestrische Physik, Garching bei München, Germany",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Steward Observatory, University of Arizona, 933 North Cherry Avenue, Tucson, AZ 85721, USA",
//         "Max-Planck-Institut für Astronomie, Königstuhl 17, D-69117 Heidelberg, Germany",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Space Telescope Science Institute, 3700 San Martin Drive, Baltimore, MD 21218, USA",
//         "Research Center for Space & Cosmic Evolution, Ehime University, 2-5 Bunkyo-cho, Matsuyama 790-8577, Japan",
//         "California Institute of Technology, MC 105-24, 1200 East California Boulevard, Pasadena, CA 91125, USA",
//         "Research Center for Space & Cosmic Evolution, Ehime University, 2-5 Bunkyo-cho, Matsuyama 790-8577, Japan",
//         "California Institute of Technology, MC 105-24, 1200 East California Boulevard, Pasadena, CA 91125, USA",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden Street, Cambridge, MA 02138, USA",
//         "Institute for Astronomy, 2680 Woodlawn Dr., University of Hawaii, Honolulu, HI 96822, USA",
//         "Dipartimento di Fisica, Università di Roma La Sapienza, P.le A. Moro 2, 00185 Roma, Italy",
//         "Observatoires of the Carnegie Institute of Washington, Santa Barbara Street, Pasadena, CA 91101, USA",
//         "European Southern Observatory, Karl-Schwarschild-Strasse 2, D-85748 Garching bei München, Germany",
//         "California Institute of Technology, MC 105-24, 1200 East California Boulevard, Pasadena, CA 91125, USA"
//       ],
//       "pub_raw": "The Astrophysical Journal, Volume 706, Issue 1, pp. 797-809 (2009).",
//       "pub": "The Astrophysical Journal",
//       "volume": "706",
//       "doi": [
//         "10.1088/0004-637X/706/1/797"
//       ],
//       "keyword": [
//         "accretion",
//         "accretion disks",
//         "black hole physics",
//         "galaxies: active",
//         "galaxies: nuclei",
//         "X-rays: galaxies",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics",
//         "Astrophysics - Astrophysics of Galaxies"
//       ],
//       "title": [
//         "The Nature of Optically Dull Active Galactic Nuclei in COSMOS"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "page": [
//         "797"
//       ],
//       "[citations]": {
//         "num_references": 72,
//         "num_citations": 37
//       }
//     },
//     {
//       "pubdate": "2009-10-00",
//       "abstract": "We report the final redshift release of the 6dF Galaxy Survey (6dFGS), a combined redshift and peculiar velocity survey over the southern sky (|b| 〉 10°). Its 136304 spectra have yielded 110256 new extragalactic redshifts and a new catalogue of 125071 galaxies making near-complete samples with (K, H, J, r<SUB>F</SUB>, b<SUB>J</SUB>) 〈= (12.65, 12.95, 13.75, 15.60, 16.75). The median redshift of the survey is 0.053. Survey data, including images, spectra, photometry and redshifts, are available through an online data base. We describe changes to the information in the data base since earlier interim data releases. Future releases will include velocity dispersions, distances and peculiar velocities for the brightest early-type galaxies, comprising about 10 per cent of the sample. Here we provide redshift maps of the southern local Universe with z 〈= 0.1, showing nearby large-scale structures in hitherto unseen detail. A number of regions known previously to have a paucity of galaxies are confirmed as significantly underdense regions. The URL of the 6dFGS data base is http://www-wfau.roe.ac.uk/6dFGS.",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"71890\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"124652\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 375,
//       "id": "1793856",
//       "bibcode": "2009MNRAS.399..683J",
//       "author": [
//         "Jones, D. Heath",
//         "Read, Mike A.",
//         "Saunders, Will",
//         "Colless, Matthew",
//         "Jarrett, Tom",
//         "Parker, Quentin A.",
//         "Fairall, Anthony P.",
//         "Mauch, Thomas",
//         "Sadler, Elaine M.",
//         "Watson, Fred G.",
//         "Burton, Donna",
//         "Campbell, Lachlan A.",
//         "Cass, Paul",
//         "Croom, Scott M.",
//         "Dawe, John",
//         "Fiegert, Kristin",
//         "Frankcombe, Leela",
//         "Hartley, Malcolm",
//         "Huchra, John",
//         "James, Dionne",
//         "Kirby, Emma",
//         "Lahav, Ofer",
//         "Lucey, John",
//         "Mamon, Gary A.",
//         "Moore, Lesa",
//         "Peterson, Bruce A.",
//         "Prior, Sayuri",
//         "Proust, Dominique",
//         "Russell, Ken",
//         "Safouris, Vicky",
//         "Wakamatsu, Ken-Ichi",
//         "Westra, Eduard",
//         "Williams, Mary"
//       ],
//       "aff": [
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Institute for Astronomy, Royal Observatory, Blackford Hill, Edinburgh EH9 3HJ",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Infrared Processing and Analysis Center, California Institute of Technology, Mail Code 100-22, Pasadena, CA 91125, USA",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia; Department of Physics, Macquarie University, Sydney 2109, Australia",
//         "Department of Astronomy, University of Cape Town, Private Bag, Rondebosch 7700, South Africa",
//         "Astrophysics, Department of Physics, University of Oxford, Keble Road, Oxford OX1 3RH",
//         "School of Physics, University of Sydney, NSW 2006, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia; Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "School of Physics, University of Sydney, NSW 2006, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Harvard-Smithsonian Center for Astrophysics, 60 Garden St MS20, Cambridge, MA 02138-1516, USA",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Department of Physics and Astronomy, University College London, Gower St, London WC1E 6BT",
//         "Department of Physics, University of Durham, South Road, Durham DH1 3LE",
//         "Institut d'Astrophysique de Paris (CNRS UMR 7095), 98 bis Bd Arago, F-75014 Paris, France; GEPI (CNRS UMR 8111), Observatoire de Paris, F-92195 Meudon, France",
//         "School of Physics, University of Sydney, NSW 2006, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "GEPI (CNRS UMR 8111), Observatoire de Paris, F-92195 Meudon, France",
//         "Anglo-Australian Observatory, PO Box 296, Epping, NSW 1710, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Faculty of Engineering, Gifu University, Gifu 501-1193, Japan",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia",
//         "Research School of Astronomy & Astrophysics, The Australian National University, Weston Creek, ACT 2611, Australia"
//       ],
//       "pub_raw": "Monthly Notices of the Royal Astronomical Society, Volume 399, Issue 2, pp. 683-698.",
//       "pub": "Monthly Notices of the Royal Astronomical Society",
//       "volume": "399",
//       "doi": [
//         "10.1111/j.1365-2966.2009.15338.x"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "keyword": [
//         "surveys",
//         "galaxies: distances and redshifts",
//         "cosmology: observations",
//         "large-scale structure of Universe",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "The 6dF Galaxy Survey: final redshift release (DR3) and southern large-scale structures"
//       ],
//       "page": [
//         "683"
//       ],
//       "[citations]": {
//         "num_references": 70,
//         "num_citations": 375
//       }
//     },
//     {
//       "pubdate": "2009-08-00",
//       "abstract": "We have obtained velocity dispersions from Keck high-resolution integrated spectroscopy of 10 M31 globular clusters (GCs), including three candidate intermediate-age GCs. We show that these candidates have the same V-band mass-to-light (M/L<SUB>V</SUB> ) ratios as the other GCs, implying that they are likely to be old. We also find a trend of derived velocity dispersion with wavelength, but cannot distinguish between a systematic error and a physical effect. Our new measurements are combined with photometric and spectroscopic data from the literature in a re-analysis of all M31 GC M/L<SUB>V</SUB> values. In a combined sample of 27 GCs, we show that the metal-rich GCs have lower M/L<SUB>V</SUB> than the metal-poor GCs, in conflict with predictions from stellar population models. Fragmentary data for other galaxies support this observation. The M31 GC fundamental plane is extremely tight, and we follow up an earlier suggestion by Djorgovski to show that the fundamental plane can be used to estimate accurate distances (potentially 10% or better).",
//       "links_data": [
//         "{\"title\":\"\", \"type\":\"preprint\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"ned\", \"instances\":\"31\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"electr\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"\", \"type\":\"simbad\", \"instances\":\"40\", \"access\":\"\"}",
//         "{\"title\":\"\", \"type\":\"pdf\", \"instances\":\"\", \"access\":\"open\"}",
//         "{\"title\":\"MAST References (HST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}",
//         "{\"title\":\"European HST References (EHST)\", \"type\":\"data\", \"instances\":\"\", \"access\":\"\"}"
//       ],
//       "citation_count": 40,
//       "id": "1759773",
//       "bibcode": "2009AJ....138..547S",
//       "author": [
//         "Strader, Jay",
//         "Smith, Graeme H.",
//         "Larsen, Soeren",
//         "Brodie, Jean P.",
//         "Huchra, John P."
//       ],
//       "aff": [
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA 02138, USA",
//         "UCO/Lick Observatory, Santa Cruz, CA 95064, USA",
//         "Utrecht University, Utrecht, The Netherlands",
//         "UCO/Lick Observatory, Santa Cruz, CA 95064, USA",
//         "Harvard-Smithsonian Center for Astrophysics, Cambridge, MA 02138, USA"
//       ],
//       "pub_raw": "The Astronomical Journal, Volume 138, Issue 2, pp. 547-557 (2009).",
//       "pub": "The Astronomical Journal",
//       "volume": "138",
//       "doi": [
//         "10.1088/0004-6256/138/2/547"
//       ],
//       "keyword": [
//         "galaxies: star clusters",
//         "globular clusters: general",
//         "Astrophysics - Astrophysics of Galaxies",
//         "Astrophysics - Cosmology and Nongalactic Astrophysics"
//       ],
//       "title": [
//         "Mass-to-Light Ratios for M31 Globular Clusters: Age Dating and a Surprising Metallicity Trend"
//       ],
//       "property": [
//         "OPENACCESS",
//         "REFEREED",
//         "EPRINT_OPENACCESS",
//         "PUB_OPENACCESS",
//         "ARTICLE"
//       ],
//       "page": [
//         "547"
//       ],
//       "[citations]": {
//         "num_references": 49,
//         "num_citations": 40
//       }
//     }
//   ]
// },
//   "highlighting": {
//   "1753671": {},
//   "1759773": {},
//   "1760138": {},
//   "1763947": {},
//   "1793856": {},
//   "1810944": {},
//   "1821011": {},
//   "1821045": {},
//   "1821301": {},
//   "1830501": {},
//   "1866808": {},
//   "1868893": {},
//   "1876209": {},
//   "1876491": {},
//   "1878790": {},
//   "1885955": {},
//   "1893399": {},
//   "1908367": {},
//   "1920223": {},
//   "1951577": {},
//   "1953663": {},
//   "2001505": {},
//   "2001744": {},
//   "2002041": {},
//   "2066283": {}
// }
// }
