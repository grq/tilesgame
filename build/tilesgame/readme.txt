Tilesgame v1.0.0

Version includes .js, .min.js, css and some additional files.
Includes demo project with a simple Tilesgame example.

--- Description
Tilesgame is just a copy of "2048" game, which made as jQuery plug-in. The purpose of this project is nothing but education and some fun.

--- Installation
Just include "tilesgame" folder in your project. It will contains js files, css file, images and font.

--- Usage

	<link href="libs/tilesgame/tilesgame.css" rel="stylesheet" />

    <script type="text/javascript" src="libs/jquery.js"></script>

    <script type="text/javascript" src="libs/tilesgame/tilesgame.min.js"></script>

    <div class="tilesgame"></div>

    <script type="text/javascript">

    $('.tilesgame').tilesgame({})

    </script>

--- Options

- startTilesgameCount
    Number of tiles which will be craeted on game start.
    Default value: 2

- fieldSize
    Size of game field. Value should be an object with _x_ and _y_ properties.
    Default value: { x: 4, y: 4 }

- showWeight
    Boolean value. Determines tiles weight visibility on game start. 
    Default value: true

- showTryAgain
    Boolean value. Determines 'Try again' button visibility when game is over. 
    Default value: true

- showScoreBoard
    Boolean value. Determines scoreboard visibility. 
    Default value: true

- showBestScore
    Boolean value. Determines 'Best Score' functionality enabled or disabled. 
    Default value: true

- useImages
    Boolean value. Determines images for tiles, game over and best score are enabled or disabled by default. 
    Default value: false

- fullScreenMessages
    Boolean value. Determines Game Over and Best Score display mode:
    If "true" will be shown over full screen;
    if "false" will be shown over container.
    Default value: false

- menuButtons
    Determines buttons which will be displayed on scoreboard. Binary addition of next possible values:
		Tilesgame.ScoreBoardButton.ShowHideWeight - Show or Hide tiles weight
		Tilesgame.ScoreBoardButton.Restart - Restart button
		Tilesgame.ScoreBoardButton.ShowHideImages - Show or Hide images for tiles, game over and best score
    Default value: (Tilesgame.ScoreBoardButton.ShowHideWeight | Tilesgame.ScoreBoardButton.Restart)

- gameOverTitle
    Title of Game Over message.
    Default value: 'GAME OVER!'

- gameOverText
    Text of Game Over message. To put user score in your message, you have to include {score} instead score value.
    Default value: 'Your score is {score}, try again!'

- tryAgainText
    Text of Try Again button.
    Default value: 'Try Again'

- newBestScoreText
    Text of Best Score message.
    Default value: 'New Best Score!'

- imgFolder
    Path to folder with images for tiles, Game Over screen and Best Score screen.
    Default value: null

- gameOverImg
    Image, which will be shown when game is over.
    Default value: null

- bestScoreImg
    Image, which will be shown when player breaks his best score.
    Default value: null

- tilesStyle
    Settings for tiles display, where you can set up tile color, font color or image for each type of tile. Format for settings:
        { '<tile weight>': {font: '<font color in hex>', bg: '<tile color in hex>', img: '<image URL>'}}
    If style is not defined for some tile weight you can define `default` style.

    Example:

    {

		'2': { font: '000', bg: '33CCCC', img: 'tile1.png' },

		'4': { font: '000', bg: '3399CC', img: 'tile1.png' },

		'default': { font: 'FFF', bg: '0066CC', img: 'tiledefault.png' }

    }