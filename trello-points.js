/**

TODO
Bug: Counting "Done" points on first time loading the page

**/



var pointsArray = []
var nameOfList = "Done";

// Save these values in browser-storage
var lastKnownNumCards = 0;
var totalPoints = 0;

var numCards = 0;
var isCounting = true;

var $checkboxSpanStart = $('<span class="list-checkbox">');

function setInitialValue() {

    var $list;
    var $listCards;

    $('.list').each(function (i, obj) {
        $listCards = $(obj).find('.list-cards');

        $listCards.find('.list-card').each(function (j, listCard) {

            var cardName = $(listCard).find('.list-card-title').text();

            var countedStatus = $(listCard).find("[name='done-counting']").val();

            var doneCountingHiddenFalse = '<input type="hidden" name="done-counting" value="false" />';
            var doneCountingHiddenTrue = '<input type="hidden" name="done-counting" value="true" />';

            $list = $(obj).find('.list-header-name');

            if (countedStatus === undefined) {

                $(listCard).append(doneCountingHiddenFalse);

            }

            if ($list.val() === nameOfList) {

//                if (countedStatus === undefined) {
//
//                    $(listCard).append(doneCountingHiddenTrue);
//
//                }

            } else {



                if (countedStatus === 'true') {

                    $(listCard).find("[name='done-counting']").val('false');
                }
            }




        });

    });

    computePoints();
    setTimeout(setInitialValue, 1000);

};

function addCheckbox() {

    var $list;

    // Loop through all lists
    $('.list').each(function (i, obj) {
        $list = $(obj).find('.list-header-name');
        if ($list.val() === nameOfList) {
            var test = 'Text';
            var $listHeader = $('.list').find('.list-header');
            $checkboxSpanStart.empty().appendTo($listHeader);

            var $checkboxSpanEnd = $('<span/>');
            $checkboxSpanStart.append($checkboxSpanEnd);

        }

    });
}

function computePoints() {

    var $list;
    var $listCards;


    //console.log("\n DO CALCULATIONS:\n");

    // Loop through all lists
    $('.list').each(function (i, obj) {
        $list = $(obj).find('.list-header-name');
        if ($list.val() === nameOfList) {
            //console.log("Title: " + $list.val());

            $listCards = $(obj).find('.list-cards');

            numCards = $listCards.find('.list-card').length;



            $listCards.find('.list-card').each(function (j, listCard) {

                var countedStatus = $(listCard).find("[name='done-counting']").val();

                if (countedStatus === 'false') {
                    var cardName = $(listCard).find('.list-card-title').text();
                    var valueSplit = cardName.split(/\(([^)]+)\)/);
                    var cardName = valueSplit[2];
                    var value = valueSplit[1];
                    //console.log("Card name: " + cardName);
                    //console.log("Value: " + value);


                    if (value !== undefined) {
                        totalPoints += parseInt(value);

                        $(listCard).find("[name='done-counting']").val('true');
                    }
                }

                console.log("Total points: " + totalPoints);



            });
            localStorage.setItem('totalPoints', totalPoints);



        }

    });



};


setInitialValue();
//computePoints();
