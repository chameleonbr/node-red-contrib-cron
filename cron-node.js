module.exports = function(RED) {
	function CronIn(n){
		var CronJob = require('cron').CronJob;
		var parser = require('cron-parser');
		RED.nodes.createNode(this,n);
		this.topic = n.topic;
		this.name = n.name;
        this.payload = n.payload;
        this.crontab = n.crontab;
		var node = this;
		
		try {
			parser.parseExpression(n.crontab);
			var job = new CronJob(n.crontab,function(){
				node.status({fill:"green",shape:"dot",text:"Job Started"});
				var msg = { payload: Date.now() };
				node.send(msg);
				node.status({});
			});
			this.on('close', function() {
				node.status({fill:"red",shape:"dot",text:"Job Stopped"});
				job.stop();
			});
			job.start();
			
		} catch (err) {
			node.error("Invalid Expression");
		}
	}
    RED.nodes.registerType("cron", CronIn);
}
