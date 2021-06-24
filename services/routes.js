const bunyan = require("../utils/bunyan")
const winstonLogger = require("../utils/winston")
const log = bunyan.logger



module.exports = function(app) {
    app.post('/', (req, res) => {
        console.log(req.body)
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