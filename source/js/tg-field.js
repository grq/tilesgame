Tilesgame.Field = function (parent, options) {
    this.private = {
        parent: parent,
        container: false,
        fieldCells: [],
        options: {
            /* startTilesgameCount, size: { x, y }, tilesStyle */
        },
        allowMove: true,
        tileContainer: false,
    };
    this.private.options = $.extend(this.defaultOptions, options);
};

Tilesgame.inheritBase(Tilesgame.Field);

$.extend(Tilesgame.Field.prototype, {

    restart: function () {
        var self = this, cells = Array.prototype.concat.apply([], self.private.fieldCells);
        for (var i = cells.length; i--;) {
            if (cells[i].hasTile())
                cells[i].deleteTile();
        }
        self.private.allowMove = true;
        self.createDefaultTilesgame();
    },

    getAllAvailableFieldCells: function () {
        var me = this.private, result = [];
        for (var x = 0; x < me.options.size.x; x++) {
            for (var y = 0; y < me.options.size.y; y++) {
                if (!me.fieldCells[x][y].hasTile())
                    result.push(me.fieldCells[x][y]);
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
                    if (prevWeight == me.fieldCells[x][y].getTile().getWeight())
                        return false;
                    prevWeight = me.fieldCells[x][y].getTile().getWeight();
                }
            }
            for (y = me.options.size.y; y--;) {
                prevWeight = false;
                for (x = me.options.size.x; x--;) {
                    if (prevWeight == me.fieldCells[x][y].getTile().getWeight())
                        return false;
                    prevWeight = me.fieldCells[x][y].getTile().getWeight();
                }
            }
            return true;
        }
        return false;
    },

    render: function () {
        var self = this, me = self.private, x, y, cell;
        if (!me.parent)
            throw 'Tilesgame: Game field parent is not defined';
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
            durationTileMove: opt.durationTileMove
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
                if (!fieldCells[x][y].hasTile())
                    availableCells.push(fieldCells[x][y]);
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
                else
                    lastTile = fieldCells[x][y];
            }
        }
        $.when.apply($, deferreds).then(function () {
            var allowCreate = !!deferreds.length;
            self.afterMoveDone(allowCreate);
            callback(score);
        });
    },

    afterMoveDone: function (allowCreate) {
        var self = this;
        if (allowCreate) {
            $.when(self.createTile().promise()).then(function () {
                if (!self.isGameOver())
                    self.private.allowMove = true;
                else
                    self.fire('gameover');
            });
        }
        else
            self.private.allowMove = true;
    },

    resize: function () {
        var cells = Array.prototype.concat.apply([], this.private.fieldCells);
        for (var i = cells.length; i--;) {
            if (cells[i].hasTile())
                cells[i].getTile().resize();
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
            for (var y = 0; y < yMax; y++)
                arr.push({ x: x, y: y });
            result.push(arr);
        }
        return result;
    },

    getUpIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var y = 0; y < yMax; y++) {
            arr = [];
            for (var x = 0; x < xMax; x++)
                arr.push({ x: x, y: y });
            result.push(arr);
        }
        return result;
    },

    getRightIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var x = 0; x < xMax; x++) {
            arr = [];
            for (var y = yMax; y--;)
                arr.push({ x: x, y: y });
            result.push(arr);
        }
        return result;
    },

    getDownIterator: function (xMax, yMax) {
        var result = [], arr;
        for (var y = 0; y < yMax; y++) {
            arr = [];
            for (var x = xMax; x--;)
                arr.push({ x: x, y: y });
            result.push(arr);
        }
        return result;
    }
});