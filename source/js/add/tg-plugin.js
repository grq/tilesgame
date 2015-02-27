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
            else
                return;
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