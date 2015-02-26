Tilesgame.Base = function () {
    this.events = {};
};

$.extend(Tilesgame.Base.prototype, {
    on: function (name, handler, scope) {
        var e = this.events;
        if (!e[name]) {
            e[name] = [];
        }
        if (scope)
            handler = handler.bind(scope);
        e[name].push(handler);
    },

    fire: function (name) {
        var e = this.events,
            args = Array.prototype.slice.call(arguments);
        if (e[name]) {
            for (var i = e[name].length; i--;) {
                e[name][i].apply(this, args);
            }
        }
    }
});