/**

TODO
Bug: Counting "Done" points on first time loading the page

**/

// listName object
$countingList = undefined;

var pointsArray = []
var nameOfList = "Done";

var cardsInCountingList = [];

// Save these values in browser-storage
var lastKnownNumCards = 0;
var totalPoints = 0;

var currentTotalPoints = 0;

var numCards = 0;
var isCounting = true;

var isLoadedFirstTime = false;

var $checkboxSpanStart = $('<span class="list-checkbox">');

var doneCountingHiddenFalse = '<input type="hidden" name="done-counting" value="false" />';
var doneCountingHiddenTrue = '<input type="hidden" name="done-counting" value="true" />';

function findCountingList() {
  var $list;
  var $listCards;

  $('.list').each(function (i, obj) {
      $listCards = $(obj).find('.list-cards');

      $list = $(obj).find('.list-header-name');
      var listHeaderName = $(obj).find('.list-header-name').text();
      var listSplit = listHeaderName.split(/\(([^)]+)\)( )*([\s\S]*)/);
      var splittedFirst = listSplit[0];
      var listValue = listSplit[1];
      var listName = listSplit[3];

      if (listName === nameOfList) {
        $countingList = $(obj).find('.list-header-name');
        return;
      }

  });
};

function setInitialValue() {

    var $list;
    var $listCards;

    $('.list').each(function (i, obj) {
        $listCards = $(obj).find('.list-cards');

        // get info about current list
        $list = $(obj).find('.list-header-name');
        var listHeaderName = $(obj).find('.list-header-name').text();
        var listSplit = listHeaderName.split(/\(([^)]+)\)( )*([\s\S]*)/);
        var splittedFirst = listSplit[0];
        var listValue = listSplit[1];
        var listName = listSplit[3];

        $listCards.find('.list-card').each(function (j, listCard) {

            // get info about current card
            var cardNameFull = $(listCard).find('.list-card-title').text();
            var cardSplit = cardNameFull.split(/\(([^)]+)\)( )*([\s\S]*)/);
            var cardFirst = cardSplit[0];
            var value = cardSplit[1];
            var cardName = cardSplit[3];

            // status about if value is undefined, has been counted, or has not been counted
            var countedStatus = $(listCard).find("[name='done-counting']").val();

            if (countedStatus === undefined) {
                // card mave moved from a list to another
                console.log("CARD MOVED: append false");
                $(listCard).append(doneCountingHiddenFalse);

                // if card came from counting list (listName), then decrease currentTotalPoints in listName accordingly to the change
                var index = cardsInCountingList.indexOf(cardNameFull);
                console.log("index: " + index);
                if (index !== -1) {
                  console.log("points before: " + currentTotalPoints);
                  currentTotalPoints -= parseInt(value);
                  cardsInCountingList.splice(index, 1);
                  console.log("After removal: " + cardsInCountingList);
                  console.log("points after: " + currentTotalPoints);
                  // update total points displayed by Card name
                  var updatedHeaderValue = "(" + currentTotalPoints + ") " + nameOfList;
                  $countingList.val(updatedHeaderValue);
                }
            }

            countedStatus = $(listCard).find("[name='done-counting']").val();
            if (listName === nameOfList) {
              if (!isLoadedFirstTime) {
                console.log("value: " + parseInt(value));
                currentTotalPoints += parseInt(value);

                // update total points displayed by Card name
                var updatedHeaderValue = "(" + currentTotalPoints + ") " + nameOfList;
                $countingList.val(updatedHeaderValue);

                  // $countingList = $(obj);
                   $(listCard).append(doneCountingHiddenTrue);
                   countedStatus = $(listCard).find("[name='done-counting']").val('true');
                   // add card to cards in cardsInCountingList
                   cardsInCountingList.push(cardNameFull);
              }

            } else {

                // cards not in listName list should be set to false
                if (countedStatus === 'true') {
                    console.log("INITIAL: set FALSE, from true");
                    $(listCard).find("[name='done-counting']").val('false');
                }
            }

        });

    });
    isLoadedFirstTime = true;
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

        var listCount = $(obj).find('.list-header-name').text();
        var listSplit = listCount.split(/\(([^)]+)\)( )*([\s\S]*)/);
        var splittedFirst = listSplit[0];
        var listValue = listSplit[1];
        var listName = listSplit[3];
        // console.log("splitted: " + listSplit);
        // console.log("first: " + splittedFirst);
        // console.log("listValue: " + listValue);
        // console.log("listName: " + listName);


        if ((splittedFirst === nameOfList) || (listName === nameOfList)) {
            //console.log("Title: " + $list.val());


            $listCards = $(obj).find('.list-cards');

            numCards = $listCards.find('.list-card').length;

            $listCards.find('.list-card').each(function (j, listCard) {

                var countedStatus = $(listCard).find("[name='done-counting']").val();
                // console.log("Counted status: " + countedStatus);

                if (countedStatus === 'false') {
                    var cardNameFull = $(listCard).find('.list-card-title').text();

                    var cardSplit = cardNameFull.split(/\(([^)]+)\)( )*([\s\S]*)/);
                    var cardFirst = cardSplit[0];
                    var value = cardSplit[1];
                    var cardName = cardSplit[3];


                    // var valueSplit = cardName.split(/\(([^)]+)\)/);
                    // var cardName = valueSplit[2];
                    // var value = valueSplit[1];
                    // console.log("Splitted: " + cardSplit);
                    // console.log("Card name: " + cardName);
                    // console.log("Value: " + value);


                    if (value !== undefined) {
                        totalPoints += parseInt(value);
                        currentTotalPoints += parseInt(value);

                        // add card to cards in cardsInCountingList
                        cardsInCountingList.push(cardNameFull);
                        console.log(cardsInCountingList);

                        $(listCard).find("[name='done-counting']").val('true');

                        // update total points displayed by Card name
                        var updatedHeaderValue = "(" + currentTotalPoints + ") " + listName;
                        $(obj).find('.list-header-name').val(updatedHeaderValue);

                    }
                }

                console.log("Total points: " + totalPoints);

            });
            localStorage.setItem('totalPoints', totalPoints);

        }

    });



};

findCountingList();
setInitialValue();
//computePoints();
