const winstonLogger = require("../../utils/logger_utils/winston")
const mongoose = require('mongoose');
exports.genericHealthcheck = (request, response) => {

    const start_time = process.hrtime();

    // Taking the process uptime
    let uptimeRaw = process.uptime();

    const date = new Date(uptimeRaw * 1000);

    // Bifurcating the date
    const uptimeDays = date.getUTCDate() - 1,
        uptimeHours = date.getUTCHours(),
        uptimeMins = date.getUTCMinutes(),
        uptimeSeconds = date.getUTCSeconds(),
        uptimeMillisecs = date.getUTCMilliseconds();
    let segments = [];
    if (uptimeDays > 0) segments.push(uptimeDays + ' day' + ((uptimeDays == 1) ? '' : 's'));
    if (uptimeHours > 0) segments.push(uptimeHours + ' hour' + ((uptimeHours == 1) ? '' : 's'));
    if (uptimeMins > 0) segments.push(uptimeMins + ' minute' + ((uptimeMins == 1) ? '' : 's'));
    if (uptimeSeconds > 0) segments.push(uptimeSeconds + ' second' + ((uptimeSeconds == 1) ? '' : 's'));
    if (uptimeMillisecs > 0) segments.push(uptimeMillisecs + ' millisecond' + ((uptimeSeconds == 1) ? '' : 's'));
    
    const readableUptime = segments.join(', ');
    const end_time = process.hrtime(start_time);
    
    const healthResponseObj = {
        trace_id: request.id,
        uptime: readableUptime,
        response_time: end_time,
        usage: process.resourceUsage(),
        memory: process.memoryUsage(),
        mongo_ready_state: mongoose.connection.readyState,
        redis: false,
        versions: process.versions,
        timestamp: new Date().toGMTString()
    }
    return response.status(200).send(healthResponseObj);    
}

exports.loadHealthCheck = (request, response) => {
    let n = parseInt(request.params.n);
    let count = 0;
    for (let i = 1; i <= n; i++) {
        count += 1;
    }
    response.status(200).send({
        iterations: count
    });
}