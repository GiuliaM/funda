(function() {

    "use strict";
    var config ={
// config.apiKey --> still need to connect to the config.js
        searchApi:'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/',
        submitSearch: document.getElementById('submit-search'),
        detailApi: 'http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/',
        detailSection: document.getElementById('details')
    }

     var app = {
        init: function() {
            //If you click on the search button, start function getUserQuery
            config.submitSearch.addEventListener('click', function() {
//                event.preventDefault();
                getData.overview();
            });

            routes.init();
        }
    };

    var routes = {
        init: function() {
            routie({
                'home': function() {
                    sections.toggle(location.hash);
//                    console.log('Youre at the homepage');
                },

                'home/:id': function(id) {
                    sections.toggle(location.hash);
                    getData.details(id);
//                    console.log('Youre at the detailpage');
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

            aja()
                .url(apiUrl)
                .on('success', function(data) {
//                    sections.overview(data);
                    self.filter(data);
//                    console.log(data);
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
//
        filter: function(data){

            function getKamers(kamers) {
                return kamers.AantalKamers >= 5;
            }

            var filterdata = data.Objects.filter(getKamers);
            console.log(filterdata);
            return sections.overview(filterdata);
            }

    };


//            document.getElementById('queryResult').innerHTML = filterdata
//                .map(function(info, i) {
//                    return getData.filter(info, i);
//                });
//        }
//    };

    var sections = {
        overview: function(data) {
            console.log(data);
            // render html with data
            var html = '';

            // With this function you tell what you want to show when a query is requested.
            data.map(function(element) {
                    console.log(element);
            //snipet no foto

                html += '<div class="searchResult" id="' + element.Id + '"> <a href="#home/' + element.Id + '"><h1>' + element.Adres + '</h1><h1>' + element.AantalKamers + '</h1> <img src= "' + element.FotoLarge + '"/> </div></a>';
            });

            document.getElementById('queryResult').innerHTML = html;
        },

        details: function(detail) {
            //render html with data
            var htmlDetail = '';

            //snippet no foto

            htmlDetail += '<div class="detailResult" id="' + detail.Id + '"><img src= "' + detail.HoofdFoto + '"/> <div class="detailBlok"> <h1>' + detail.Adres + '</h1> <h2>Omschrijving</h2><p>'+ detail.VolledigeOmschrijving +'</p> <h2>Koopprijs</h2><p>'+ detail.Koopprijs +'</p> <h2>Soort woning</h2><p>'+ detail.SoortWoning +'</p> <h2>Aantal kamers</h2><p>'+ detail.AantalKamers +'</p> <h2>Energielabel</h2><p>'+ detail.Energielabel.Label +'</p><a href="#home"> Go back to overview</a> </div> </div>';

            document.getElementById('showDetails').innerHTML = htmlDetail;

        },



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
