const logger = require('../config/winston');

module.exports = function(app) {
    app.get('/', (req, res) => {
        logger.debug('Hello again distributed logs');
        res.send(req.headers)
    });

    app.get('/api/:n', function (req, res) {
        let n = parseInt(req.params.n);
        let count = 0;

        if (n > 5000000000) n = 5000000000;

        for (let i = 0; i <= n; i++) {
            count += i;
        }

        res.send(`Final count is ${count}`);
    });
};
