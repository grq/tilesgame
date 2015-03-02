var Tilesgame = {

    RenderScorePattern: '{score}',

    RenderScoreSeparator: '^',

    getRenderScoreText: function () {
        var me = this;
        return [me.RenderScoreSeparator, me.RenderScorePattern, me.RenderScoreSeparator].join('');
    },

    Direction: {
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40
    },

    ScoreBoardButton: {
        ShowHideWeight: 1,
        Restart: 2,
        ShowHideImages: 4
    },

    Cls: {
        container: 'tilesgame-container',
        scoreboard: 'tilesgame-scoreboard',
        gamefield: 'tilesgame-game-field',
        fieldline: 'tilesgame-field-line',
        tilesContainer: 'tilesgame-tile-container',
        fieldCell: 'tilesgame-field-cell',
        hideTileWeight: 'tilesgame-setting-no-weight',
        settingsContainer: 'tilesgame-game-settings',
        scoreText: 'tilesgame-score-txt',
        scoreValue: 'tilesgame-score',
        messageMask: 'tilesgame-msg-mask',
        messageMaskInCnt: 'tilesgame-mask-in-cnt',
        messageBox: 'tilesgame-msg-box',
        message: 'tilesgame-message',
        messageSmall: 'tilesgame-lose-msg-small',
        messageScore: 'tilesgame-lose-msg-score',
        buttonRestart: 'tilesgame-game-over-restart-btn',
        messageHolder: 'tilesgame-msg-holder',
        tile: 'tilesgame-game-tile',
        tileWeight: 'tilesgame-tile-weight',
        noImages: 'tilesgame-setting-noimages'
    },

    Errors: {
        ContainerNotDefined: 'Tilesgame Exception: Container is not defined',
        JQueryNotDefined: 'Tilesgame Exception: jQuery is not defined!'
    },

    storageBestScoreKey: 'TILESGAME_BEST_SCORE',

    inheritBase: function (child) {
        child.prototype = new Tilesgame.Base();
    }
};

Tilesgame.defaultOptions = {
    startTilesgameCount: 2,
    fieldSize: { x: 4, y: 4 },
    showWeight: true,
    showTryAgain: false,
    showScoreBoard: true,
    showBestScore: true,
    useImages: false,
    menuButtons: (Tilesgame.ScoreBoardButton.ShowHideWeight | Tilesgame.ScoreBoardButton.Restart),
    fullScreenMessages: false,
    gameOverTitle: 'GAME OVER!',
    gameOverText: 'Your score is {score}, try again!',
    tryAgainText: 'Try again',
    newBestScoreText: 'New Best Score!',
    imgFolder: null,
    gameOverImg: null,
    bestScoreImg: null,
    tilesStyle: {
        '2': { font: '', bg: '33CCCC', img: '' },
        '4': { font: '', bg: '3399CC', img: '' },
        '8': { font: '', bg: 'FF6666', img: '' },
        '16': { font: '', bg: 'FF6600', img: '' },
        '32': { font: '', bg: 'FF3366', img: '' },
        '64': { font: '', bg: 'FF0000', img: '' },
        '128': { font: '', bg: 'CC6666', img: '' },
        '256': { font: '', bg: 'CC6600', img: '' },
        '512': { font: '', bg: 'CC3366', img: '' },
        '1024': { font: '', bg: '336666', img: '' },
        '2048': { font: '', bg: '336600', img: '' },
        '4096': { font: '', bg: 'CC3300', img: '' },
        '8192': { font: '', bg: '333366', img: '' },
        'default': { font: 'FFF', bg: '0066CC', img: '' }
    },
    durationShowGameOver: 1000,
    durationHideGameOver: 500,
    durationShowBestScore: 500,
    durationHideBestScore: 500,
    durationTileGrow: 80,
    durationTileCreate: 80,
    durationTileMove: 80,
    tileGrowSizeIncrease: 20
};