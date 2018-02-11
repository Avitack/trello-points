# trello-points
Chrome extension for [Trello](https://trello.com/), which provides functionality for assigning points to each task in a TODO list, which is used to track the total amount of points achieved.<br>

Can be used as a way to prioritize tasks by assigning different points to each task.<br>

### Note: not a finished extension
This extension is not currently finished and may not be of any value yet.<br>
Currently the only way to view the total amount of points acvhieved is to view the console window, which will display a number stored in the browser's local storage.<br>
Charts displaying this information is being added to later version.

## Installing

```sh
git clone git@github.com:Avitack/trello-points.git
cd trello-points
npm install
npm start
```

In chrome, go to ``` chrome://extensions/ ``` and enable ``` Developer mode ```.
Then load the folder ``` trello-points ``` from ``` Load unpacked extension... ``` in Chrome.

## How to use:
Extension only works on the ``` trello.com ``` domain.<br>
This extension is intended to be used for a TODO type of board.
By default, the list that contains all the finished items should be named 'Done'.

#### Assigning points to a task
You assign points to a card by appending '(value)' in front of or behind the task name. In Trello a task is called a 'Card'.</br>
Example giving a Card a value of 20 points, by naming the Card:</br>
``` (20) Start using trello-points ``` or ``` Start using trello-points (20) ```

#### Finishing a task
When you are finished with a task, you simple drag the Trello card over to the 'Done' list, which will then automatically count your points.

## Credits
Inspired by [TrelloScrum](https://github.com/Q42/TrelloScrum) made by [Q42](https://github.com/Q42)
