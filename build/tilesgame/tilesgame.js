/*! Tilesgame v1.0.0, 2015 !*/
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
Tilesgame.Base = function () {
    this.events = {};
};

$.extend(Tilesgame.Base.prototype, {
    on: function (name, handler, scope) {
        var e = this.events;
        if (!e[name]) {
            e[name] = [];
        }
        if (scope) {
            handler = handler.bind(scope);
        }
        e[name].push(handler);
    },

    fire: function (name) {
        var e = this.events, i,
            args = Array.prototype.slice.call(arguments);
        if (e[name]) {
            for (i = e[name].length; i--;) {
                e[name][i].apply(this, args);
            }
        }
    }
});
Tilesgame.App = function (container, options) {
    var me = this;
    me.private = {
        container: container,
        options: false,
        gameField: false,
        gameScore: false,
        gameMessanger: false
    };
    me.private.options = $.extend(true, Tilesgame.defaultOptions, options);
};

Tilesgame.inheritBase(Tilesgame.App);

$.extend(Tilesgame.App.prototype, {

    start: function () {
        var self = this;
        if (!self.private.container) {
            throw Tilesgame.Errors.ContainerNotDefined;
        }
        self.init();
        self.render();
    },

    restart: function () {
        var me = this.private;
        if (me.gameField) {
            me.gameField.restart();
        }
        if (me.gameScore) {
            me.gameScore.restart();
        }
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
            useImages: opt.useImages
        };
    },

    getFieldOptions: function () {
        var opt = this.private.options;
        return {
            startTilesgameCount: opt.startTilesgameCount,
            size: opt.fieldSize,
            tilesStyle: opt.tilesStyle,
            imgFolder: opt.imgFolder,
            durationTileGrow: opt.durationTileGrow,
            durationTileCreate: opt.durationTileCreate,
            durationTileMove: opt.durationTileMove,
            tileGrowSizeIncrease: opt.tileGrowSizeIncrease
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
            durationShowGameOver: opt.durationShowGameOver,
            durationShowBestScore: opt.durationShowBestScore,
            durationHideGameOver: opt.durationHideGameOver,
            durationHideBestScore: opt.durationHideBestScore
        };
    },

    render: function () {
        var me = this.private;
        me.container.addClass(Tilesgame.Cls.container);
        me.gameScore.render();
        me.gameField.render();
    },

    resize: function () {
        var me = this.private;
        if (me.gameField) {
            me.gameField.resize();
        }
        if (me.gameMessanger) {
            me.gameMessanger.resize();
        }
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
Tilesgame.Field = function (parent, options) {
    this.private = {
        parent: parent,
        container: false,
        fieldCells: [],
        options: {},
        allowMove: true,
        tileContainer: false
    };
    this.private.options = $.extend(this.defaultOptions, options);
};

Tilesgame.inheritBase(Tilesgame.Field);

$.extend(Tilesgame.Field.prototype, {

    restart: function () {
        var self = this, i, cells = Array.prototype.concat.apply([], self.private.fieldCells);
        for (i = cells.length; i--;) {
            if (cells[i].hasTile()) {
                cells[i].deleteTile();
            }
        }
        self.private.allowMove = true;
        self.createDefaultTilesgame();
    },

    getAllAvailableFieldCells: function () {
        var me = this.private, result = [], x, y;
        for (x = 0; x < me.options.size.x; x++) {
            for (y = 0; y < me.options.size.y; y++) {
                if (!me.fieldCells[x][y].hasTile()) {
                    result.push(me.fieldCells[x][y]);
                }
            }
        }
        return result;
    },

    getAvailableFieldCell: function (x, y) {
        var cells = this.getAllAvailableFieldCells(),
            random = Math.floor(Math.random() * (cells.length));
        return cells[random];
    },

    createTile: function () {
        var self = this;
        return self.getAvailableFieldCell().createTile(self.private.tileContainer);
    },

    mergeTilesgame: function (oldField, newField) {
        return newField.getTile().increaseWeight(oldField.deleteTile(newField));
    },

    moveTile: function (oldField, newField) {
        var result = newField.setTile(oldField.getTile());
        oldField.removeTile();
        return result;
    },

    isGameOver: function () {
        var me = this.private, prevWeight, x, y;
        if (!this.getAllAvailableFieldCells().length) {
            for (x = me.options.size.y; x--;) {
                prevWeight = false;
                for (y = me.options.size.x; y--;) {
                    if (prevWeight == me.fieldCells[x][y].getTile().getWeight()) {
                        return false;
                    }
                    prevWeight = me.fieldCells[x][y].getTile().getWeight();
                }
            }
            for (y = me.options.size.y; y--;) {
                prevWeight = false;
                for (x = me.options.size.x; x--;) {
                    if (prevWeight == me.fieldCells[x][y].getTile().getWeight()) {
                        return false;
                    }
                    prevWeight = me.fieldCells[x][y].getTile().getWeight();
                }
            }
            return true;
        }
        return false;
    },

    render: function () {
        var self = this, me = self.private, x, y, cell;
        if (!me.parent) {
            throw 'Tilesgame: Game field parent is not defined';
        }
        me.container = $('<div/>', {
            'class': Tilesgame.Cls.gamefield
        }).appendTo(me.parent);
        me.tileContainer = $('<div/>', {
            'class': Tilesgame.Cls.tilesContainer
        }).appendTo(me.container);
        for (x = 0; x < me.options.size.x; x++) {
            gameLine = $('<div/>', {
                'class': Tilesgame.Cls.fieldline
            }).appendTo(me.container);
            me.fieldCells[x] = [];
            for (y = 0; y < me.options.size.y; y++) {
                me.fieldCells[x][y] = new Tilesgame.FieldCell(self.getFieldCellOptions());
                me.fieldCells[x][y].render(gameLine);
            }
        }
        setTimeout(function () {
            self.createDefaultTilesgame();
        }, 150);
    },

    getFieldCellOptions: function () {
        var opt = this.private.options;
        return {
            tilesStyle: opt.tilesStyle,
            imgFolder: opt.imgFolder,
            durationTileGrow: opt.durationTileGrow,
            durationTileCreate: opt.durationTileCreate,
            durationTileMove: opt.durationTileMove,
            tileGrowSizeIncrease: opt.tileGrowSizeIncrease
        };
    },

    createDefaultTilesgame: function () {
        var self = this;
        for (var i = self.private.options.startTilesgameCount; i--;) {
            self.createTile();
        }
    },

    move: function (direction, callback) {
        var self = this;
        if (self.private.allowMove) {
            self.private.allowMove = false;
            self.doMove(direction, callback);
        }
    },

    doMove: function (direction, callback) {
        var self = this, i, j, x, y, cell, mergeResult, deferreds = [], availableCells,
            lastTile, result, fieldCells = self.private.fieldCells, score = 0,
            iterator = self.getIterator(direction);
        self.private.allowMove = false;
        for (i = 0; i < iterator.length; i++) {
            availableCells = [];
            lastTile = false;
            for (j = 0; j < iterator[i].length; j++) {
                x = iterator[i][j].x;
                y = iterator[i][j].y;
                if (!fieldCells[x][y].hasTile()) {
                    availableCells.push(fieldCells[x][y]);
                }
                else if (lastTile && fieldCells[x][y].getTile().getWeight() == lastTile.getTile().getWeight()) {
                    mergeResult = self.mergeTilesgame(fieldCells[x][y], lastTile);
                    deferreds.push(mergeResult.deferred);
                    score += mergeResult.weight;
                    availableCells.push(fieldCells[x][y]);
                    lastTile = false;
                }
                else if (availableCells.length > 0) {
                    cell = availableCells.shift();
                    deferreds.push(self.moveTile(fieldCells[x][y], cell));
                    availableCells.push(fieldCells[x][y]);
                    lastTile = cell;
                }
                else {
                    lastTile = fieldCells[x][y];
                }
            }
        }
        $.when.apply($, deferreds).then(function () {
            self.afterMoveDone(!!deferreds.length);
            callback(score);
        });
    },

    afterMoveDone: function (allowCreate) {
        var self = this;
        if (allowCreate) {
            $.when(self.createTile().promise()).then(function () {
                if (!self.isGameOver()) {
                    self.private.allowMove = true;
                }
                else {
                    self.fire('gameover');
                }
            });
        }
        else {
            self.private.allowMove = true;
        }
    },

    resize: function () {
        var cells = Array.prototype.concat.apply([], this.private.fieldCells), i;
        for (i = cells.length; i--;) {
            if (cells[i].hasTile()) {
                cells[i].getTile().resize();
            }
        }
    },

    getIterator: function (direction) {
        var self = this, me = this.private;
        switch (direction) {
            case Tilesgame.Direction.Left:
                return self.getLeftIterator(me.options.size.x, me.options.size.y);
            case Tilesgame.Direction.Up:
                return self.getUpIterator(me.options.size.x, me.options.size.y);
            case Tilesgame.Direction.Right:
                return self.getRightIterator(me.options.size.x, me.options.size.y);
            case Tilesgame.Direction.Down:
                return self.getDownIterator(me.options.size.x, me.options.size.y);
        }
    },

    getLeftIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var x = 0; x < xMax; x++) {
            arr = [];
            for (var y = 0; y < yMax; y++) {
                arr.push({ x: x, y: y });
            }
            result.push(arr);
        }
        return result;
    },

    getUpIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var y = 0; y < yMax; y++) {
            arr = [];
            for (var x = 0; x < xMax; x++) {
                arr.push({ x: x, y: y });
            }
            result.push(arr);
        }
        return result;
    },

    getRightIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var x = 0; x < xMax; x++) {
            arr = [];
            for (var y = yMax; y--;) {
                arr.push({ x: x, y: y });
            }
            result.push(arr);
        }
        return result;
    },

    getDownIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var y = 0; y < yMax; y++) {
            arr = [];
            for (var x = xMax; x--;) {
                arr.push({ x: x, y: y });
            }
            result.push(arr);
        }
        return result;
    }
});
Tilesgame.FieldCell = function (options) {
    var me = this;
    me.private = {
        el: false,
        currentTile: false,
        options: {}
    };
    $.extend(me.private.options, options);
};

$.extend(Tilesgame.FieldCell.prototype, {

    getEl: function () {
        return this.private.el;
    },

    hasTile: function () {
        return !!this.private.currentTile;
    },

    getTile: function () {
        return this.private.currentTile;
    },

    setTile: function (tile, increase) {
        var me = this.private;
        me.currentTile = tile;
        return me.currentTile.setFieldCell(me.el, increase);
    },

    createTile: function (container) {
        var self = this;
        return self.setTile(new Tilesgame.Tile(container, self.getTileOptions()));
    },

    removeTile: function () {
        this.private.currentTile = false;
    },

    deleteTile: function (newField) {
        var result = this.private.currentTile.destroy(newField);
        delete this.private.currentTile;
        this.private.currentTile = false;
        return result;
    },

    getTileOptions: function () {
        var opt = this.private.options;
        return {
            tilesStyle: opt.tilesStyle,
            imgFolder: opt.imgFolder,
            durationTileGrow: opt.durationTileGrow,
            durationTileCreate: opt.durationTileCreate,
            durationTileMove: opt.durationTileMove,
            tileGrowSizeIncrease: opt.tileGrowSizeIncrease
        };
    },

    render: function (parent) {
        var me = this.private;
        me.el = $('<div/>', {
            'class': Tilesgame.Cls.fieldCell
        });
        me.el.appendTo(parent);
    }
});
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
Tilesgame.ScreenMessanger = function (parent, options) {
    this.private = {
        options: {},
        parent: parent,
        score: 'NA'
    };
    $.extend(this.private.options, options);
    this.init();
};

Tilesgame.inheritBase(Tilesgame.ScreenMessanger);

$.extend(Tilesgame.ScreenMessanger.prototype, {

    Message: {
        GameOver: 1,
        NewBestScore: 2
    },

    showGameOver: function (score) {
        var self = this, me = self.private;
        me.score = score;
        self.showMessage(self.Message.GameOver, me.options.durationShowGameOver);
    },

    showBestScore: function () {
        var self = this, opt = self.private.options;
        self.showMessage(self.Message.NewBestScore, opt.durationShowBestScore);
        self.hide(opt.durationHideBestScore);
    },

    hide: function (duration) {
        var self = this, me = self.private;
        me.maskEl.animate({ opacity: '0' }, duration, function () {
            me.maskEl.hide();
        });
        me.msgBoxEl.animate({ opacity: '0' }, duration, function () {
            me.msgBoxEl.hide();
        });
        me.msgEl.animate({ opacity: '0' }, duration, function () {
            me.gameOverEl.appendTo(me.msgHolder);
            me.bestScoreEl.appendTo(me.msgHolder);
            me.msgEl.hide();
        });
    },

    showMessage: function (type, duration) {
        var self = this, me = self.private, img;
        me.maskEl.css({ opacity: '0' });
        me.maskEl.animate({ opacity: '0.6' }, duration);
        me.maskEl.show();
        me.msgBoxEl.css({ opacity: '0' });
        me.msgBoxEl.animate({ opacity: '0.6' }, duration);
        me.msgBoxEl.show();
        me.msgEl.css({ opacity: '0' });
        me.msgEl.animate({ opacity: '1' }, duration);
        me.msgEl.show();
        switch (type) {
            case self.Message.GameOver:
                me.gameOverEl.appendTo(me.msgEl);
                img = me.options.gameOverImg;
                if (me.scoreEl) {
                    me.scoreEl.html(me.score);
                }
                break;
            case self.Message.NewBestScore:
                me.bestScoreEl.appendTo(me.msgEl);
                img = me.options.bestScoreImg;
                break;
        }
        if (img) {
            me.maskEl.css({ 'background-image': ['url(', me.options.imgFolder, img, ')'].join('') });
        }
        self.resize();
    },

    resize: function () {
        var me = this.private, top, left;
        /* Resize mask */
        if (me.options.fullScreenMessages) {
            me.maskEl.css({
                height: '100%',
                width: '100%',
                top: '0px',
                left: '0px'
            });
        }
        else {
            me.maskEl.height(me.parent.height());
            me.maskEl.width(me.parent.width());
            me.maskEl.css(me.parent.offset());
        }
        me.maskEl.toggleClass(Tilesgame.Cls.messageMaskInCnt, !me.options.fullScreenMessages);
        /* Resize message box */
        me.msgEl.offset(me.maskEl.offset());
        top =  (me.maskEl.height() - me.msgEl.outerHeight()) / 2;
        left = (me.maskEl.width() - me.msgEl.outerWidth()) / 2;
        top = me.options.fullScreenMessages ? top : me.msgEl.offset().top + top;
        left = me.options.fullScreenMessages ? left : me.msgEl.offset().left + left;
        me.msgEl.css({ top: top, left: left });
        me.msgBoxEl.css(me.msgEl.offset());
        me.msgBoxEl.height(me.msgEl.outerHeight());
        me.msgBoxEl.width(me.msgEl.outerWidth());
    },

    init: function () {
        var self = this, me = self.private;
        if (!me.msgHolder) {
            me.msgHolder = $('<div/>', {
                'class': Tilesgame.Cls.messageHolder
            }).appendTo(me.parent);
        }
        if (!me.maskEl) {
            me.maskEl = $('<div/>', {
                'class': Tilesgame.Cls.messageMask
            }).appendTo(me.parent);
        }
        if (!me.msgBoxEl) {
            me.msgBoxEl = $('<div/>', {
                'class': Tilesgame.Cls.messageBox
            }).appendTo(me.parent);
        }
        if (!me.msgEl) {
            me.msgEl = $('<div/>', {
                'class': Tilesgame.Cls.message
            }).appendTo(me.parent);
        }
        if (!me.gameOverEl) {
            me.gameOverEl = $('<div/>').appendTo(me.msgHolder);
            self.renderGameOverEl();
        }
        if (!me.bestScoreEl) {
            me.bestScoreEl = $('<div/>').html(me.options.newBestScoreText).appendTo(me.msgHolder);
        }
    },

    renderGameOverEl: function () {
        var self = this, me = self.private, msgSpan;
        me.gameOverEl.html(me.options.gameOverTitle);
        $('<br/>').appendTo(me.gameOverEl);
        msgSpan = $('<span/>', {
            'class': Tilesgame.Cls.messageSmall
        }).appendTo(me.gameOverEl);
        self.renderGameOverMessage(msgSpan);
        if (me.options.showTryAgain) {
            self.renderRestartBtn();
        }
    },

    renderGameOverMessage: function (msgSpan) {
        var me = this.private, msg = me.options.gameOverText, i,
            splitted = msg.split(Tilesgame.RenderScoreSeparator);
        for (i = 0; i < splitted.length; i++) {
            if (splitted[i] == Tilesgame.RenderScorePattern) {
                me.scoreEl = $('<span/>', {
                    'class': Tilesgame.Cls.messageScore
                }).appendTo(msgSpan);
            }
            else {
                msgSpan.append(splitted[i]);
            }
        }
    },

    renderRestartBtn: function () {
        var self = this, me = self.private, divRestart, spanRestart;
        divRestart = $('<div/>', { 'class': Tilesgame.Cls.buttonRestart }).appendTo(me.gameOverEl);
        spanRestart = $('<span/>').html(me.options.tryAgainText).appendTo(divRestart);
        spanRestart.click(function () {
            self.hide(me.options.durationHideGameOver);
            self.fire('restart');
        });
    }
});
Tilesgame.Tile = function (container, options) {
    var me = this;
    me.private = {
        weight: false,
        el: false,
        weightEl: false,
        cell: false,
        rendered: false,
        container: container,
        options: {}
    };
    $.extend(me.private.options, options);
    me.private.weight = me.getRandomWeight();
};

$.extend(Tilesgame.Tile.prototype, {

    getRandomWeight: function () {
        return (Math.floor(Math.random() * (2)) + 1) * 2;
    },

    setFieldCell: function (cell) {
        var self = this, deferred = $.Deferred();
        self.private.cell = cell;
        if (self.private.rendered) {
            self.animateMove(deferred);
        }
        else {
            self.render(deferred);
        }
        return deferred.promise();
    },

    animateIncreaseWeight: function (deferred) {
        var me = this.private, el = me.el,
            duration = me.options.durationTileGrow,
            addition = me.options.tileGrowSizeIncrease,
            height = el.height(),
            width = el.width(),
            newCss = {
                'height': height + addition,
                'width': width + addition,
                'margin-left': (addition / 2 * -1),
                'margin-top': (addition / 2 * -1)
            },
            oldCss = {
                'height': height,
                'width': width,
                'margin-left': 0,
                'margin-top': 0
            };
        el.css({ 'z-index': 2 });
        el.animate(newCss, duration, function () {
            el.animate(oldCss, duration, function () {
                el.css({ 'z-index': 1 });
                deferred.resolve();
            });
        });
    },

    animateCreation: function (deferred) {
        var me = this.private, el = me.el,
            duration = me.options.durationTileCreate,
            height = el.height(),
            width = el.width(),
            newCss = {
                'height': 0,
                'width': 0,
                'margin-left': height / 2,
                'margin-top': height / 2
            },
            oldCss = {
                'height': height,
                'width': width,
                'margin-left': 0,
                'margin-top': 0
            };
        el.css({ 'z-index': 3 });
        el.css(newCss);
        el.animate(oldCss, duration, function () {
            el.css({ 'z-index': 1 });
            deferred.resolve();
        });
    },

    animateMove: function (deferred) {
        var me = this.private;
        me.el.animate(me.cell.offset(), me.options.durationTileMove, function () {
            if (deferred) {
                deferred.resolve();
            }
        });
    },

    getWeight: function () {
        return this.private.weight;
    },

    increaseWeight: function (outDeferred) {
        var self = this, deferred = $.Deferred();
        self.private.weight *= 2;
        $.when(outDeferred).then(function () {
            self.printWeight();
            self.animateIncreaseWeight(deferred);
        });
        return {
            deferred: deferred.promise(),
            weight: this.private.weight
        };
    },

    printWeight: function () {
        var me = this.private, css = {},
            style = me.options.tilesStyle[me.weight],
            def = me.options.tilesStyle['default'];
        me.weightEl.html(me.weight);
        if (!style)
            style = def;
        css.color = ['#', style.font ? style.font : def.font].join('');
        css['background-color'] = ['#', style.bg ? style.bg : def.bg].join('');
        css['background-image'] = ['url(', me.options.imgFolder, style.img ? style.img : def.img, ')'].join('');
        me.el.css(css);
    },

    render: function (deferred) {
        var self = this, me = self.private;
        me.el = $('<div/>', {
            'class': Tilesgame.Cls.tile
        });
        me.weightEl = $('<div/>', {
            'class': Tilesgame.Cls.tileWeight
        }).appendTo(me.el);
        me.el.css(me.cell.offset());
        me.el.appendTo(me.container);
        self.printWeight();
        self.animateCreation(deferred);
        me.rendered = true;
    },

    resize: function () {
        this.private.el.css(this.private.cell.offset());
    },

    destroy: function (cell) {
        var deferred = $.Deferred(),
            self = this, me = self.private;
        $.when(deferred.promise()).then(function () {
            me.el.detach();
        });
        if (cell) {
            me.cell = cell.getEl();
            self.animateMove(deferred);
        }
        else {
            me.el.detach();
        }
        return deferred;
    }
});
if (jQuery) {
    jQuery.fn.tilesgame = function (options) {
        var apps = [], containers = this, app;
        for (var i = containers.length; i--;) {
            app = new Tilesgame.App($(containers[i]), options);
            app.start();
            apps.push(app);
        }
        $(document).keydown(function (e) {
            if (e.which >= Tilesgame.Direction.Left && e.which <= Tilesgame.Direction.Down) {
                for (var i = apps.length; i--;) {
                    apps[i].move(e.which);
                }
            }
            else {
                return;
            }
            e.preventDefault();
        });
        $(window).resize(function () {
            for (var i = apps.length; i--;) {
                apps[i].resize();
            }
        });
        return apps;
    };
}