Tilesgame.Scoreboard = function (parent, options) {
    var me = this;
    me.private = {
        parent: parent,
        container: false,
        totalScore: 0,
        bestScore: false,
        scoreEl: false,
        bestScoreEl: false,
        settingsEl: false,
        options: {},
        settings: {
            showTileWeight: {
                el: false,
                state: options.showWeight,
                showTxt: 'Show tile weight',
                hideTxt: 'Hide tile weight'
            },
            restart: {
                el: false
            },
            showHideImages: {
                el: false,
                state: options.useImages,
                showTxt: 'Use images',
                hideTxt: 'Disable images'
            }
        }
    };
    $.extend(me.private.options, options);
};

Tilesgame.inheritBase(Tilesgame.Scoreboard);

$.extend(Tilesgame.Scoreboard.prototype, {

    restart: function () {
        var self = this, me = self.private;
        me.newBestScore = false;
        me.totalScore = 0;
        me.bestScore = 'NA';
        if (localStorage) {
            if (!localStorage[Tilesgame.storageBestScoreKey]) {
                localStorage[Tilesgame.storageBestScoreKey] = 0;
            }
            me.bestScore = localStorage[Tilesgame.storageBestScoreKey];
        }
        self.updateScore();
    },

    getEl: function () {
        return this.private.el;
    },

    getScore: function () {
        return this.private.totalScore;
    },

    addScore: function (score) {
        var self = this;
        self.private.totalScore += score;
        self.checkBestScore();
        self.updateScore();
    },

    checkBestScore: function () {
        var self = this, me = self.private;
        if (localStorage) {
            if (me.bestScore < me.totalScore) {
                me.bestScore = me.totalScore;
                localStorage[Tilesgame.storageBestScoreKey] = me.bestScore;
                if (me.options.showBestScore && !me.newBestScore) {
                    me.newBestScore = true;
                    self.fire('bestscore');
                }
            }
        }
    },

    render: function () {
        var self = this, me = self.private;
        if(me.options.visible) {
            me.container = $('<div/>', {
                'class': Tilesgame.Cls.scoreboard
            }).appendTo(me.parent);
            if (me.options.showBestScore) {
                $('<span/>', {
                    'class': Tilesgame.Cls.scoreText
                }).html('BEST:').appendTo(me.container);
                me.bestScoreEl = $('<span/>', {
                    'class': Tilesgame.Cls.scoreValue
                }).appendTo(me.container);
            }
            $('<span/>', {
                'class': Tilesgame.Cls.scoreText
            }).html('SCORE:').appendTo(me.container);
            me.scoreEl = $('<span/>', {
                'class': Tilesgame.Cls.scoreValue
            });
            me.scoreEl.appendTo(me.container);
            self.renderSettingsMenu(me.container);
        }
        self.restart();
    },

    renderSettingsMenu: function (el) {
        var self = this, me = self.private;
        me.settingsEl = $('<div/>', {
            'class': Tilesgame.Cls.settingsContainer
        }).appendTo(el);
        if ((me.options.buttons & Tilesgame.ScoreBoardButton.ShowHideWeight) > 0) {
            self.initTileWeight();
        }
        if ((me.options.buttons & Tilesgame.ScoreBoardButton.Restart) > 0) {
            self.renderRestartBtn();
        }
        if ((me.options.buttons & Tilesgame.ScoreBoardButton.ShowHideImages) > 0) {
            self.initImageSwitcher();
        }
    },

    initTileWeight: function () {
        var self = this, me = self.private;
        me.settings.showTileWeight.el = $('<span/>').appendTo(me.settingsEl).click(function () {
            self.toggleTileWeight();
        });
        self.toggleTileWeight(true);
    },

    toggleTileWeight: function (isInit) {
        var self = this, me = self.private,
            setting = me.settings.showTileWeight,
            parent = $(me.parent);
        if (!isInit) {
            setting.state = !setting.state;
        }
        setting.el.text(setting.state ? setting.hideTxt : setting.showTxt);
        parent.toggleClass(Tilesgame.Cls.hideTileWeight, !setting.state);
    },

    renderRestartBtn: function () {
        var self = this, me = self.private;
        me.settings.restart.el = $('<span/>').appendTo(me.settingsEl);
        me.settings.restart.el.html('Restart');
        me.settings.restart.el.click(function () {
            self.fire('restart');
        });
    },

    initImageSwitcher: function () {
        var self = this, me = self.private;
        me.settings.showHideImages.el = $('<span/>').appendTo(me.settingsEl).click(function () {
            self.toggleImages();
        }).html('asdd');
        self.toggleImages(true);
    },

    toggleImages: function (isInit) {
        var self = this, me = self.private,
            setting = me.settings.showHideImages;
        if (!isInit) {
            setting.state = !setting.state;
        }
        setting.el.text(setting.state ? setting.hideTxt : setting.showTxt);
        $('body').toggleClass(Tilesgame.Cls.noImages, !setting.state);
    },

    updateScore: function () {
        var me = this.private;
        if (me.options.visible) {
            me.scoreEl.html(me.totalScore);
            if (me.options.showBestScore) {
                me.bestScoreEl.html(me.bestScore);
            }
        }
    }
});