(function () {
    var options = {
        startTilesgameCount: 2,
        fieldSize: { x: 4, y: 4 },
        showWeight: true,
        showTryAgain: true,
        showScoreBoard: true,
        showBestScore: true,
        useImages: false,
        menuButtons: Tilesgame.ScoreBoardButton.ShowHideWeight | Tilesgame.ScoreBoardButton.Restart | Tilesgame.ScoreBoardButton.ShowHideImages,
        fullScreenMessages: false,
        gameOverTitle: 'YOU SUCK!',
        gameOverText: ['Your score is only ', Tilesgame.getRenderScoreText(), ',<br/>you miserable loser!'].join(''),
        imgFolder: 'img/sidatron_theme/',
        gameOverImg: 'game_over.png',
        bestScoreImg: 'best_score.png',
        tilesStyle: {
            '2': { img: 'tile1.png', font: 'FFF' }, '4': { img: 'tile2.png', font: 'FFF' }, '8': { img: 'tile3.png', font: 'FFF' }, '16': { img: 'tile4.png', font: 'FFF' },
            '32': { img: 'tile5.png', font: 'FFF' }, '64': { img: 'tile6.png', font: 'FFF' }, '128': { img: 'tile7.png', font: 'FFF' }, '256': { img: 'tile8.png', font: 'FFF' },
            '512': { img: 'tile9.png', font: 'FFF' }, '1024': { img: 'tile10.png', font: 'FFF' }, 'default': { img: 'tile_default.png', font: '000' }
        }
    };
    $(document).ready(function () {
        apps = $('.tilesgame').tilesgame(options);
    });
}());