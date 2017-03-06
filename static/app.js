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
                    console.log('Youre at the homepage');
                },

                'home/:id': function(id) {
                    sections.toggle(location.hash);
                    getData.details(id);
                    console.log('Youre at the detailpage');
                }
            });
        }
    };

    var getData = {
        //  With this function you tell to take the query from the input field and how to construct the new url.
        overview: function() {
            // call to api movie list
            var searchInput = document.getElementById('user-input-field').value;
            var apiUrl = config.searchApi + apiKey + '/?type=koop&zo=/' + searchInput + '&page=1&pagesize=25';
            console.log(apiUrl);
            console.log(searchInput);

            //aja is the mini library.  With .url you tell where to get the info.  With .on you say: if successfull load the data in function(data).
            aja()
                .url(apiUrl)
                .on('success', function(data) {

                    console.log(data + "aja");
                    sections.overview(data);
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

                    console.log(data, "You see me");
                    sections.details(data);
                })
                .go();
        }
    };

    var sections = {
        overview: function(data) {
            console.log(data);
            // render html with data
            var html = '';

            // With this function you tell what you want to show when a query is requested.
            data.Objects.map(function(element) {

            //snipet no foto
                console.log(element);

                html += '<div class="searchResult" id="' + element.Id + '"> <a href="#home/' + element.Id + '"><h1>' + element.Adres + '</h1> <img src= "' + element.FotoLarge + '"/> </div></a>';
            });

            document.getElementById('queryResult').innerHTML = html;
        },

        details: function(detail) {
            //render html with data
            var htmlDetail = '';

            //snippet no foto

            htmlDetail += '<div class="detailResult" id="' + detail.Id + '"><img src= "' + detail.HoofdFoto + '"/> <div class="detailBlok"> <h1>' + detail.Adres + '</h1> <h2>Omschrijving</h2><p>'+ detail.VolledigeOmschrijving +'</p> <h2>Budget</h2><p>'+ detail.Koopprijs +'</p> <a href="#movies"> Go back to overview</a> </div> </div>';

            document.getElementById('showDetails').innerHTML = htmlDetail;

        },

        toggle: function(route /* this is location.hash */ ) {
            var sections = document.querySelectorAll('main section');
            console.log(sections);

            for (var i = 0; i < sections.length; i++) {
                var sectionList = sections[i];
                var sectionsId = "#" + sections[i].id;

                if (sectionsId === route) {
                    sectionList.classList.remove("hide");
                    console.log(sectionsId);
                    console.log(route);

                } else if (route.length > 5) {
                    console.log("true")
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
