var vows = require('vows'),
      assert = require('assert'),
      fs = require('fs'),
      si2 = require('../../')({indexPath:'si-test2'});
vows.describe('indexing should work for different pathes').addBatch({
	'a second index with different indexPath': {
		topic:function(){
			 var stats = fs.statSync("si-test2/000003.log")
			 var size = stats["size"];
			return size;
			},
		'should be empty': function (topic) {
			assert.equal(topic,0);
		}
	}
}).export(module)