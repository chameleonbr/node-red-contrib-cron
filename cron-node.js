module.exports = function (RED) {
    function CronIn(n) {
        var CronJob = require('cron').CronJob;
        var parser = require('cron-parser');
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        this.name = n.name;
        this.payload = n.payload;
        this.crontab = n.crontab;
        var node = this;

        try {
            parser.parseExpression(n.crontab);
            var job = new CronJob(n.crontab, function () {
                node.status({fill: "green", shape: "dot", text: "Job started"});
                var msg = {payload: Date.now()};
                node.send(msg);
                node.status({});
            });
            this.on('close', function (done) {
                node.status({fill: "red", shape: "dot", text: "Job stopped"});
                job.stop();
                done();
            });
            node.status({fill: "blue", shape: "dot", text: "Job deployed"});
            setTimeout(function () {
                node.status({});
            }, 500);
            job.start();
        } catch (err) {
            node.error("Invalid Expression");
        }
    }
    RED.nodes.registerType("cron", CronIn);
};
