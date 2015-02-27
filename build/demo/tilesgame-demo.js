(function () {
    var options = {
        startTilesgameCount: 2,
        fieldSize: { x: 4, y: 4 },
        showWeight: false,
        showTryAgain: true,
        showScoreBoard: true,
        showBestScore: true,
        useImages: true,
        menuButtons: Tilesgame.ScoreBoardButton.ShowHideWeight | Tilesgame.ScoreBoardButton.Restart | Tilesgame.ScoreBoardButton.ShowHideImages,
        fullScreenMessages: false,
        gameOverTitle: 'HA-HA!',
        gameOverText: ['Your score is only ', Tilesgame.getRenderScoreText(), '.<br/> One more time?'].join(''),
        imgFolder: 'img/simpsons_theme/',
        gameOverImg: 'nelson.png',
        bestScoreImg: 'willie.png',
        tilesStyle: {
            '2': { img: 'apu.png', font: 'FFF' }, '4': { img: 'meggie.png', font: 'FFF' }, '8': { img: 'krusty.png', font: 'FFF' }, '16': { img: 'lisa.png', font: 'FFF' },
            '32': { img: 'moe.png', font: 'FFF' }, '64': { img: 'marge.png', font: 'FFF' }, '128': { img: 'wiggum.png', font: 'FFF' }, '256': { img: 'millhouse.png', font: 'FFF' },
            '512': { img: 'bart.png', font: 'FFF' }, '1024': { img: 'homer.png', font: 'FFF' }, '2048': { img: 'ralph.png', font: 'FFF' }, '4096': { img: 'burns.png', font: 'FFF' },
            '8192': { img: 'skinner.png', font: 'FFF' }, 'default': { img: 'ned.png', font: 'FFF' }
        }
    };
    $(document).ready(function () {
        apps = $('.tilesgame').tilesgame(options);
    });
}());