const mongoose = require('mongoose');
exports.genericHealthcheck = (request, response) => {
  const startTime = process.hrtime();

  // Taking the process uptime
  const uptimeRaw = process.uptime();

  const date = new Date(uptimeRaw * 1000);

  // Bifurcating the date
  const uptimeDays = date.getUTCDate() - 1;
  const uptimeHours = date.getUTCHours();
  const uptimeMins = date.getUTCMinutes();
  const uptimeSeconds = date.getUTCSeconds();
  const uptimeMillisecs = date.getUTCMilliseconds();
  const segments = [];
  if (uptimeDays > 0) segments.push(uptimeDays + ' day' + ((uptimeDays === 1) ? '' : 's'));
  if (uptimeHours > 0) segments.push(uptimeHours + ' hour' + ((uptimeHours === 1) ? '' : 's'));
  if (uptimeMins > 0) segments.push(uptimeMins + ' minute' + ((uptimeMins === 1) ? '' : 's'));
  if (uptimeSeconds > 0) segments.push(uptimeSeconds + ' second' + ((uptimeSeconds === 1) ? '' : 's'));
  if (uptimeMillisecs > 0) segments.push(uptimeMillisecs + ' millisecond' + ((uptimeSeconds === 1) ? '' : 's'));

  const readableUptime = segments.join(', ');
  const endTime = process.hrtime(startTime);

  const healthResponseObj = {
    trace_id: request.id,
    uptime: readableUptime,
    response_time: endTime,
    usage: process.resourceUsage(),
    memory: process.memoryUsage(),
    mongo_ready_state: mongoose.connection.readyState,
    redis: false,
    versions: process.versions,
    timestamp: new Date().toGMTString()
  };
  return response.status(200).send(healthResponseObj);
};

exports.loadHealthCheck = (request, response) => {
  const n = parseInt(request.params.n);
  let count = 0;
  for (let i = 1; i <= n; i++) {
    count += 1;
  }
  response.status(200).send({
    iterations: count
  });
};
