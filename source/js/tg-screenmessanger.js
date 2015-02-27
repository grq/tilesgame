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