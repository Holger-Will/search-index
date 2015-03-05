var vows = require('vows'),
      assert = require('assert'),
      fs = require('fs'),
      si = require('../../')({indexPath:'si-test1'});

vows.describe('indexing and search').addBatch({
	'An Index with testdata': {
		topic: function () {
			var data=[
						{
							'id':'1',
							'title':'A really interesting document',
							'body':'This is a really interesting document about potatos',
							'about':'potatos',
							'metadata':['red', 'potato']
						},
						{
							'id':'2',
							'title':'Another interesting document',
							'body':'This is another really interesting document that is a bit different',
							'about': 'vegtables',
							'metadata':['yellow', 'potato']
						}
					]
						
			si.add({'batchName': 'test1',
				     'filters': ['metadata','about']},
				     data, 
				     this.callback
			)

		},
		'should not return an err when indexed succesfully': function (err) {
			assert.isUndefined(err);
		},
		'should return a search result when queried':{
			topic:function(){
				si.search({'query': {'*': ['potato']},
				'facets': ['metadata','about']},
				this.callback);
			},
			'which is defined':function (err,searchResults){assert.isNotNull(searchResults)},
			'and should return 2 results':function(err,searchResults){assert.equal(searchResults.hits.length,2)},
			'the facet metadata should also be defined':function(err,searchResults){assert.isNotNull(searchResults.facets.metadata)},
			'the first facet should be potato':function(err,searchResults){assert.equal(searchResults.facets.metadata[0].key,'potato')},
			'the first facet should have a value of 2':function(err,searchResults){;assert.equal(searchResults.facets.metadata[0].value,2)},
			'there should be 3 facets':function(err,searchResults){assert.equal(searchResults.facets.metadata.length,3)},
			'the id of the first document in the result set should be 1':function(err,searchResults){assert.equal(searchResults.hits[0].id,1)},
			'the id of the second document in the result set should be 2':function(err,searchResults){assert.equal(searchResults.hits[1].id,2)},
		},
		'of facets of fields not in array format':{
			topic:function(){
				si.search({'query': {'*': ['potato']},
				'facets': ['about']},
				this.callback);
			},
			'should be defined':function (err,searchResults){assert.isNotNull(searchResults)},
			'and should return 2 results':function(err,searchResults){assert.equal(searchResults.hits.length,2)},
			'the facet "about" should be defined  despite not being in array format':function(err,searchResults){assert.isNotNull(searchResults.facets.about)},
			'the first facet should be potatos':function(err,searchResults){assert.equal(searchResults.facets.about[0].key,'potatos')},
			'the first facet should have a value of 1':function(err,searchResults){assert.equal(searchResults.facets.about[0].value,1)},
			'there should be 2 facets':function(err,searchResults){assert.equal(searchResults.facets.about.length,2)}
		}
	}
	
}).export(module)