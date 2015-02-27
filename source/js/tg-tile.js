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
        if (self.private.rendered)
            self.animateMove(deferred);
        else
            self.render(deferred);
        return deferred.promise();
    },

    animateIncreaseWeight: function (deferred) {
        var me = this.private, el = me.el,
            duration = me.options.durationTileGrow, // me.options.durationTileGrow
            addition = 20,
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
            duration = me.options.durationTileCreate, // me.options.durationTileCreate
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
        //
        var me = this.private;
        me.el.animate(me.cell.offset(), me.options.durationTileMove, function () {
            if (deferred)
                deferred.resolve();
        });
    },

    getWeight: function () {
        return this.private.weight;
    },

    increaseWeight: function (outDeferred) {
        var self = this, deferred = $.Deferred();
        this.private.weight *= 2;
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
        else
            me.el.detach();
        return deferred;
    }
});