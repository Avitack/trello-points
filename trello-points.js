var pointsArray = []
var nameOfList = "Done";

computePoints();


function computePoints() {

    var $list;
    var $listCards;

    // Loop through all lists
    $('.list').each(function(i, obj) {
        $list = $(obj).find('.list-header-name').val();
        if ($list === nameOfList) {
            console.log("Title: " + $list);

            $listCards = $(obj).find('.list-cards');
            $listCards.find('.list-card').each(function(j, listCard) {
                var cardName = $(listCard).find('.list-card-title').text();

                var valueSplit = cardName.split(/\(([^)]+)\)/);
//                console.log("valueSpit: " + valueSplit);
                var cardName = valueSplit[2];
                var value = valueSplit[1];
                console.log("Card name: " + cardName);
                console.log("Value: " + value);
            });

        }

    });


};
