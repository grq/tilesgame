﻿Tilesgame.App = function (container, options) {
    var me = this;
    me.private = {
        container: container,
        options: false,
        gameField: false,
        gameScore: false,
        gameMessanger: false,
    };
    me.private.options = $.extend(true, Tilesgame.defaultOptions, options);
};

Tilesgame.inheritBase(Tilesgame.App);

$.extend(Tilesgame.App.prototype, {

    start: function () {
        var self = this;
        if (!self.private.container)
            throw 'Container is not defined';
        else {
            self.init();
            self.render();
        }
    },

    restart: function () {
        var me = this.private;
        if (me.gameMessanger)
            me.gameMessanger.hide();
        if (me.gameField)
            me.gameField.restart();
        if (me.gameScore)
            me.gameScore.restart();
    },

    init: function () {
        var self = this, me = self.private;
        me.gameMessanger = new Tilesgame.ScreenMessanger(me.container, self.getScreenMessangerOptions());
        me.gameMessanger.on('restart', self.restart, self);
        me.gameScore = new Tilesgame.Scoreboard(me.container, self.getScoreboardOptions());
        me.gameScore.on('restart', self.restart, self);
        me.gameScore.on('bestscore', me.gameMessanger.showBestScore, me.gameMessanger);
        me.gameField = new Tilesgame.Field(me.container, self.getFieldOptions());
        me.gameField.on('gameover', self.onGameOver, self);
    },

    getScoreboardOptions: function () {
        var opt = this.private.options;
        return {
            visible: opt.showScoreBoard,
            showBestScore: opt.showBestScore,
            buttons: opt.menuButtons,
            showWeight: opt.showWeight,
            useImages: opt.useImages,
        };
    },

    getFieldOptions: function () {
        var opt = this.private.options;
        return {
            startTilesgameCount: opt.startTilesgameCount,
            size: opt.fieldSize,
            tilesStyle: opt.tilesStyle,
            imgFolder: opt.imgFolder
        };
    },

    getScreenMessangerOptions: function () {
        var opt = this.private.options;
        return {
            fullScreenMessages: opt.fullScreenMessages,
            showTryAgain: opt.showTryAgain,
            gameOverTitle: opt.gameOverTitle,
            gameOverText: opt.gameOverText,
            tryAgainText: opt.tryAgainText,
            newBestScoreText: opt.newBestScoreText,
            imgFolder: opt.imgFolder,
            gameOverImg: opt.gameOverImg,
            bestScoreImg: opt.bestScoreImg,
        };
    },

    render: function () {
        var me = this.private;
        me.container.addClass(Tilesgame.Cls.container);
        me.gameScore.render();
        me.gameField.render();
    },

    onResize: function () {
        var me = this.private;
        if (me.gameField)
            me.gameField.onResize();
        if (me.gameMessanger)
            me.gameMessanger.onResize();
    },

    onGameOver: function () {
        var me = this.private;
        me.gameMessanger.showGameOver(me.gameScore.getScore());
    },

    move: function (direction) {
        var me = this.private,
            callback = function (score) {
                me.gameScore.addScore(score);
            };
        me.gameField.move(direction, callback);
    }
});