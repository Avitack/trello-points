// list to keep track of, counting points
var nameOfList = "Done";
$countingList = undefined;
var cardsInCountingList = [];

// current points in counting list
var currentTotalPoints = 0;
var currentPointsInList = 0;

// total points from every session. Saved in local storage
var totalPoints = 0;

var isLoadedFirstTime = false;

// html elements used
var $checkboxSpanStart = $('<span class="list-checkbox">');
var doneCountingHiddenFalse = '<input type="hidden" name="done-counting" value="false" />';
var doneCountingHiddenTrue = '<input type="hidden" name="done-counting" value="true" />';

// find countingList (nameOfList)
// get totalPoints from local storage
function setup() {

  chrome.storage.local.get({'totalPoints': 0}, function(result){
    totalPoints = parseInt(result.totalPoints);
    // start counting
    setInitialValue();
  });

  // console.log("Got totalPoints: " + totalPoints);

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

        // reset count for list
        currentPointsInList = 0;

        $listCards.find('.list-card').each(function (j, listCard) {

            // get info about current card
            var cardNameFull = $(listCard).find('.list-card-title').text();
            var cardSplit = cardNameFull.split(/\(([^)]+)\)( )*([\s\S]*)/);
            var cardFirst = cardSplit[0];
            var value = cardSplit[1];
            var cardName = cardSplit[3];

            // status about if value is undefined, has been counted, or has not been counted
            var countedStatus = $(listCard).find("[name='done-counting']").val();

            // card mave moved from a list to another
            if (countedStatus === undefined) {

              $(listCard).append(doneCountingHiddenFalse);

                // if card came from counting list (listName), then decrease currentTotalPoints in listName accordingly to the change
                var index = cardsInCountingList.indexOf(cardNameFull);
                if (index !== -1) {
                  currentTotalPoints -= parseInt(value);
                  cardsInCountingList.splice(index, 1);

                  // update total points displayed by counting list
                  var updatedHeaderValue = "(" + currentTotalPoints + ") " + nameOfList;
                  $countingList.val(updatedHeaderValue);
                }
            }

            countedStatus = $(listCard).find("[name='done-counting']").val();
            if (listName === nameOfList) {
              if (!isLoadedFirstTime) {
                currentTotalPoints += parseInt(value);

                // update total points displayed by counting list
                var updatedHeaderValue = "(" + currentTotalPoints + ") " + nameOfList;
                $countingList.val(updatedHeaderValue);

                 $(listCard).append(doneCountingHiddenTrue);
                  countedStatus = $(listCard).find("[name='done-counting']").val('true');
                   // add card to cards in cardsInCountingList
                   cardsInCountingList.push(cardNameFull);
              }

            } else {
                currentPointsInList += parseInt(value);
                // cards not in listName list should be set to false
                if (countedStatus === 'true') {
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
    var numCards = 0;

    // Loop through all lists
    $('.list').each(function (i, obj) {
        $list = $(obj).find('.list-header-name');

        // list info
        var listCount = $(obj).find('.list-header-name').text();
        var listSplit = listCount.split(/\(([^)]+)\)( )*([\s\S]*)/);
        var splittedFirst = listSplit[0];
        var listValue = listSplit[1];
        var listName = listSplit[3];


        if ((splittedFirst === nameOfList) || (listName === nameOfList)) {

            $listCards = $(obj).find('.list-cards');

            numCards = $listCards.find('.list-card').length;

            $listCards.find('.list-card').each(function (j, listCard) {

                var countedStatus = $(listCard).find("[name='done-counting']").val();

                if (countedStatus === 'false') {
                  //card info
                    var cardNameFull = $(listCard).find('.list-card-title').text();
                    var cardSplit = cardNameFull.split(/\(([^)]+)\)( )*([\s\S]*)/);
                    var cardFirst = cardSplit[0];
                    var value = cardSplit[1];
                    var cardName = cardSplit[3];

                    // add points to totalPoints
                    if (value !== undefined) {
                        totalPoints += parseInt(value);
                        currentTotalPoints += parseInt(value);

                        // add card to cards in cardsInCountingList
                        cardsInCountingList.push(cardNameFull);

                        // set status as counted
                        $(listCard).find("[name='done-counting']").val('true');

                        // update total points displayed by counting list
                        var updatedHeaderValue = "(" + currentTotalPoints + ") " + listName;
                        $(obj).find('.list-header-name').val(updatedHeaderValue);

                    }
                }

                console.log("Total points: " + totalPoints);
                chrome.storage.local.set({'totalPoints': totalPoints}, function(){
                  if (chrome.extension.lastError) {
                    // some error
                  }
                });

            });

        }

    });

    var lastDateRecorded;
    var currentDate;
    var pointsSaved;

    date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    currentDate = day+month+year;

    chrome.storage.local.get({'lastDateRecorded': currentDate}, function(result){
      lastDateRecorded = parseInt(result.lastDateRecorded);
    });

    // get all points saved
    chrome.storage.local.get({pointsSaved: []}, function(result){
      pointsSaved = parseInt(result.pointsSaved);
    });

    if (lastDateRecorded == currentDate) {
      // update last entry of pointsSaved
      pointsSaved[pointsSaved.length-1] += totalPoints;
    } else {
      // insert new entry in pointsSaved

      // save last date recorded
      chrome.storage.local.set({'lastDateRecorded': currentDate}, function(){
        if (chrome.extension.lastError) {
          // some error
        }
      });

    }

      // save updated pointsSaved
      // update last date recorded
      chrome.storage.local.set({'pointsSaved': pointsSaved}, function(){
        if (chrome.extension.lastError) {
          // some error
        }
      });

};

setup();
