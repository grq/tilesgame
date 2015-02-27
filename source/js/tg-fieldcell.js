Tilesgame.FieldCell = function (options) {
    var me = this;
    me.private = {
        el: false,
        currentTile: false,
        options: options
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
        this.private.currentTile = tile;
        return this.private.currentTile.setFieldCell(this.private.el, increase);
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