## Tilesgame - An Incredible "2048" Replica
### Description
Tilesgame is just a copy of "2048" game, which made as jQuery plug-in. The purpose of this project is nothing but education and some fun.
### Installation
Just include `tilesgame` folder in your project. It will contains js files, css file, images and font.
### Usage
        <link href="libs/tilesgame/tilesgame.css" rel="stylesheet" />

        <script type="text/javascript" src="libs/jquery.js"></script>

        <script type="text/javascript" src="libs/tilesgame/tilesgame.min.js"></script>

        <div class="tilesgame"></div>

        <script type="text/javascript">

        $('.tilesgame').tilesgame({})

        </script>

### Options
* `startTilesgameCount`

    Number of tiles which will be craeted on game start.

    _Default value: 2_
* `fieldSize`

    Size of game field. Value should be an object with _x_ and _y_ properties.

    _Default value: { x: 4, y: 4 }_
* `showWeight`

    Boolean value. Determines tiles weight visibility on game start. 

    _Default value: true_
* `showTryAgain`

    Boolean value. Determines 'Try again' button visibility when game is over. 

    _Default value: true_
* `showScoreBoard`

    Boolean value. Determines scoreboard visibility. 

    _Default value: true_
* `showBestScore`

    Boolean value. Determines 'Best Score' functionality enabled or disabled. 

    _Default value: true_
* `useImages`

    Boolean value. Determines images for tiles, game over and best score are enabled or disabled by default. 

    _Default value: false_
* `fullScreenMessages`

    Boolean value. Determines Game Over and Best Score display mode:

    If `true` will be shown over full screen;

    if `false` will be shown over container.

    _Default value: false_
* `menuButtons`

    Determines buttons which will be displayed on scoreboard. Binary addition of next possible values:
    
    `Tilesgame.ScoreBoardButton.ShowHideWeight` - Show or Hide tiles weight
    
    `Tilesgame.ScoreBoardButton.Restart` - Restart button
    
    `Tilesgame.ScoreBoardButton.ShowHideImages` - Show or Hide images for tiles, game over and best score

    _Default value: (Tilesgame.ScoreBoardButton.ShowHideWeight | Tilesgame.ScoreBoardButton.Restart)_
* `gameOverTitle`

    Title of Game Over message.

    _Default value: 'GAME OVER!'_
* `gameOverText`

    Text of Game Over message. To put user score in your message, you have to include {score} instead score value.

    _Default value: 'Your score is {score}, try again!'_
* `tryAgainText`

    Text of Try Again button.

    _Default value: 'Try Again'_
* `newBestScoreText`

    Text of Best Score message.

    _Default value: 'New Best Score!'_
* `imgFolder`

    Path to folder with images for tiles, Game Over screen and Best Score screen.

    _Default value: null_
* `gameOverImg`

    Image, which will be shown when game is over.

    _Default value: null_
* `bestScoreImg`

    Image, which will be shown when player breaks his best score.

    _Default value: null_
* `tilesStyle`

    Settings for tiles display, where you can set up tile color, font color or image for each type of tile. Format for settings:

        { '<tile weight>': {font: '<font color in hex>', bg: '<tile color in hex>', img: '<image URL>'}}

    If style is not defined for some tile weight you can define `default` style.

    _Example:_

        {

        '2': { font: '000', bg: '33CCCC', img: 'tile1.png' },

        '4': { font: '000', bg: '3399CC', img: 'tile1.png' },

        'default': { font: 'FFF', bg: '0066CC', img: 'tiledefault.png' }

        }