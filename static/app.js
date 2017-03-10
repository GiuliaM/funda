(function() {

    "use strict";
    var config ={
// config.apiKey --> still need to connect to the config.js
        searchApi:'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        submitSearch: document.getElementById('submit-search'),
        submitQuiz: document.getElementById('submit-quiz'),
        detailApi: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/',
        detailSection: document.getElementById('details'),
        queryResult: document.getElementById('queryResult'),
        suggestResult: document.getElementById('suggestResult'),
        showDetails: document.getElementById('showDetails'),
        roomFilter: document.getElementById('roomFilter'),
        budgetFilter: document.getElementById('budgetFilter')
//        metersFilter: document.getElementById('metersFilter')
    }


     var app = {
        init: function() {
            //If you click on the search button, start function getUserQuery
            config.submitSearch.addEventListener('click', function() {
//                event.preventDefault();
                getData.overview();
                getData.suggest();
            });

            routes.init();
        }
    };

    var routes = {
        init: function() {
            routie({
                'home': function() {
                    sections.toggle(location.hash);
                },

                'home/:id': function(id) {
                    sections.toggle(location.hash);
                    getData.details(id);
                }
            });
        }
    };

    var getData = {
        //  With this function you tell to take the query from the input field and how to construct the new url.
        overview: function(userQuery) {
            var self = this;
            var searchInput = document.getElementById('user-input-field').value;
            var apiUrl = config.searchApi + apiKey + '/?type=koop&zo=/' + searchInput + '&page=1&pagesize=25';
            console.log(apiUrl);

            aja()
                .url(apiUrl)
                .on('success', function(data) {
                    sections.overview(data);
                    var obj = data.Objects;
                    self.filterRooms(obj);
                    self.filterBudget(obj);
                    location.hash = '#queryResult';
                })
            .go();
        },

      suggest: function(data) {
          var self = this;
            //makes sure api url has the right userquery and adds the value of the selected option
            var searchInput = document.getElementById('user-input-field').value;
            var apiUrl = config.searchApi + apiKey + '/?type=koop&zo=/' + searchInput + '/+5km/' +  '&page=1&pagesize=5';

            console.log(apiUrl);

            aja()
            .url(apiUrl)
            .on('success', function(suggestArray){

              console.log('suggest api is loaded');
                console.log(suggestArray);

                sections.suggestHtml(suggestArray);

            })
            .go();
      },


        details: function(id) {
            // call to api movie detail by id
            var detailUrl = config.detailApi + apiKey + '/koop/' + id;
            console.log(detailUrl);

            aja()
                .url(detailUrl)
                .on('success', function(data) {
                    sections.details(data);
                })
                .go();
        },

        filterRooms: function(data){
           var self = this;
            config.roomFilter.addEventListener('change', function() {

            var filterValue = this.value;
            function getFilters(check) {
                console.log(filterValue);
                return check.AantalKamers > filterValue;
            }

            var filterData = data.filter(getFilters);
            config.queryResult.innerHTML > filterData;
            sections.filterHtml(filterData);
            console.log(filterData);
            self.filterBudget(filterData);
//            self.filterMeters(filterData);

            })
          },

        filterBudget: function(data){
           var self = this;
            config.budgetFilter.addEventListener('change', function() {
            console.log(this.value);

            var filterValue = this.value;
            function getFilters(check) {
                console.log(filterValue);
                return check.Koopprijs < filterValue;
            }

            var filterData = data.filter(getFilters);
            config.queryResult.innerHTML > filterData;
            sections.filterHtml(filterData);
            console.log(filterData);
            self.filterRooms(filterData);
//            self.filterMeters(filterData);

            })
          }

//        Snippet filterMeters
    };

    var sections = {
        overview: function(data) {
            console.log(data);
            // render html with data
            var html = '';

            // With this function you tell what you want to show when a query is requested.
            data.Objects.map(function(element) {
//                    console.log(element);
            //snipet no foto

                html += '<div class="searchResult" id="' + element.Id + '"> <a href="#home/' + element.Id + '"><img src= "' + element.FotoLarge + '"/><h3>' + element.Adres + ' - ' + element.Woonplaats + '</h3><p>€ ' + element.Koopprijs + ' k.k.</p><p>Aantal kamers: ' + element.AantalKamers + '</p><p> Woonoppervlakte: ' + element.Woonoppervlakte + ' m² </p></div></a>';
            });

            config.queryResult.innerHTML = html;
        },

        details: function(detail) {
            //render html with data
            var htmlDetail = '';

            //snippet no foto

            htmlDetail += '<div class="detailResult" id="' + detail.Id + '"><h1>' + detail.Adres + ' - ' + detail.Plaats + '</h1><a href="#home"> Terug naar het overzicht</a> <div class="detailImg"><img src= "' + detail.HoofdFoto + '"/></div> <div class="detailBlok"><h1>Kenmerken</h1><h2>Koopprijs</h2><p>€'+ detail.Koopprijs +'</p> <h2>Soort woning</h2><p>'+ detail.SoortWoning +'</p> <h2>Aantal kamers</h2><p>'+ detail.AantalKamers +'</p></div> <h2>Omschrijving</h2><div class="detailP"><p>'+ detail.VolledigeOmschrijving +'</p></div> </div>';

            config.showDetails.innerHTML = htmlDetail;
        },

        filterHtml: function(data){
            var html = '';
          data.map(function(filterArray) {
            html += '<div class="searchResult" id="' + filterArray.Id + '"> <a href="#home/' + filterArray.Id + '"><img src= "' + filterArray.FotoLarge + '"/><h3>' + filterArray.Adres + ' - ' + filterArray.Woonplaats + '</h3><p>€ ' + filterArray.Koopprijs + ' k.k.</p><p>Aantal kamers: ' + filterArray.AantalKamers + '</p><p> Woonoppervlakte: ' + filterArray.Woonoppervlakte + ' m² </p></div></a>';
          });

            config.queryResult.innerHTML = html;
        },

        suggestHtml: function(data) {
            var html = '';
          data.Objects.map(function(suggestArray) {
            html += '<div class="searchResult suggestResult" id="' + suggestArray.Id + '"> <a href="#home/' + suggestArray.Id + '"><h3>' + suggestArray.Adres + ' - ' + suggestArray.Woonplaats + '</h3><img src= "' + suggestArray.FotoLarge + '"/><p>€ ' + suggestArray.Koopprijs + ' k.k.</p><p>Aantal kamers: ' + suggestArray.AantalKamers + '</p><p> Woonoppervlakte: ' + suggestArray.Woonoppervlakte + ' m² </p></div></a>';
          });

          config.suggestResult.innerHTML = html;
        },

        toggle: function(route /* this is location.hash */ ) {
            var sections = document.querySelectorAll('main section');
//            console.log(sections);

            for (var i = 0; i < sections.length; i++) {
                var sectionList = sections[i];
                var sectionsId = "#" + sections[i].id;

                if (sectionsId === route) {
                    sectionList.classList.remove("hide");
//                    console.log(sectionsId);
//                    console.log(route);

                } else if (route.length > 5) {
//                    console.log("true")
                    sectionList.classList.add("hide"); config.detailSection.classList.remove('hide');
                } else {
                    sectionList.classList.add("hide");
                }
            }
        }
    };

    app.init();

}());




/* Snippets */

/* no foto
    var fotoPath;
    if (element.FotoLarge !== null) {
        fotoPath = element.Fotolarge
    } else {
        fotoPath = element.HoofdFoto;
    }
*/


/*  filterMeters

        filterMeters: function(data){
           var self = this;
            config.metersFilter.addEventListener('change', function() {
            console.log(this.value);

            var filterValue = this.value;
            function getFilters(check) {
                console.log(filterValue);
                return check.Woonoppervlakte > filterValue;
            }

            var filterData = data.filter(getFilters);
            config.queryResult.innerHTML > filterData;
            sections.filterHtml(filterData);
            console.log(filterData);
            self.filterRooms(filterData);
            self.filterBudget(filterData);

            })
          }

*/








//---------------------------------------

//        filter: function(filterdata) {
//            //render html with data
//            var htmlFilter = '';
//
//            //snippet no foto
//
//            filterDetail += '<div class="detailResult" id="' + detail.Id + '"><img src= "' + detail.HoofdFoto + '"/> <div class="detailBlok"> <h1>' + detail.Adres + '</h1> <h2>Omschrijving</h2><p>'+ detail.VolledigeOmschrijving +'</p> <h2>Koopprijs</h2><p>'+ detail.Koopprijs +'</p> <h2>Soort woning</h2><p>'+ detail.SoortWoning +'</p> <h2>Aantal kamers</h2><p>'+ detail.AantalKamers +'</p><a href="#movies"> Go back to overview</a> </div> </div>';
//
//            document.getElementById('showDetails').innerHTML = htmlFilter;
//
//
//            function(data) {
////                function getKamers(kamers) {
////                    return kamers.AantalKamers >= 7;
////                console.log(kamers);
////            }
////
////            var filterdata = data.Objects.filter(getKamers);
////            document.getElementById('overview').innerHTML = filterdata
////                .map(function(info, i) {
////                    return sections.filter(info, i);
////                });
////        }
//
//
//
//
//        },








//            var filterdata = data.Objects.filter(getFilters);
//            console.log(filterdata);
//            return sections.overview(filterdata);
//            }


//        filter: function(data){
//    console.log(data)
//    el.rooms.addEventListener('change', function() {
//      console.log(this.value);
//      var filterValue = this.value;
//      function getFilters(check) {
//        console.log(filterValue);
//        return check.AantalKamers > filterValue;
//      }
//      var filterData = data.Objects.filter(getFilters);
//      el.queryResult.innerHTML > filterData;
//      sections.renderFilter(filterData);
//      console.log(filterData);
