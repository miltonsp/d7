if(!aetn) {
	//init aetn namespace
	var aetn={}; 
}

if(!aetn.admin) {
	aetn.admin = {};
}

aetn.admin.schedule = function() {
	var pub = {}; //public
	var priv = {}; //private
	
	priv.inEdit = {};
	
	priv.item = {};
	
	priv.ajax = function(url, params, callback) {
		$.post(url, params, function(data) {
			if(callback) {
				callback(data);
			}
		}, "json");
	};
	
	priv.item.makeInput = function(item) {
		var contents = $(item).html();
		
		var url = '/movies/admin/settings/ppl_feeds/shows/list/get_input';
		
		var item_id = $(item).parent('.list_row').attr('id');
		var type = $(item).attr('type');
		
		if(priv.inEdit[item_id] == true) {
			return;
		}
		
		var params = {
				type: type,
				item_id: item_id,
				contents: contents
		};
		
		var callback = function(data) {
			$(item).html(data.input);
			
			$(params.item).css('color', 'green');
			
			$('#' + item_id + ' .edit').focus();
			
			$('#' + item_id + ' .edit').blur(function(){
				priv.item.makeInput.save({item: item, item_id: item_id, type:type, old_contents: contents});
			});
		};
		
		priv.inEdit[item_id] = true;
		priv.ajax(url, params, callback);
	};
	
	priv.item.makeInput.save = function(params) {
		if(priv.inEdit[params.item_id] != true) {
			return;
		}
		
		var url = '/movies/admin/settings/ppl_feeds/shows/list/save_input';
		
		var value = $('#' + params.item_id + ' .edit').attr('value');
		
		var eparams = {
			type: params.type,
			item_id: params.item_id,
			value: value,
			old_contents: params.old_contents
		};
		
		var callback = function(data) {			
			$(params.item).html(data.html);
			
			if(data.saved==true) {
				$(params.item).css('color', 'green');
			} else {
				$(params.item).css('color', 'red');
			}
			
			priv.inEdit[params.item_id] = false;
		};
		
		priv.ajax(url, eparams, callback);
	};
	
	pub.editItem = function(item) {
		var item_id = $(item).parent('.list_row').attr('id');
		var type = $(item).attr('type');
		
		priv.item.makeInput(item);
	};
	
	return pub;
}();

aetn.admin.movies = function() {
	var pub = {}; //public
	var priv = {}; //private
	
	priv.inEdit = {};
	
	var url = '/movies/admin/settings/ppl_feeds/programs/list/import';
	
	priv.ajax = function(url, params, callback) {
		$.post(url, params, function(data) {
			if(callback) {
				callback(data);
			}
		}, "json");
	};
	
	pub.importItem = function(item) {
		var item_id = $(item).parent('.list_row').attr('id');
		var type = $(item).attr('type');
				
		if(priv.inEdit[item_id] == true) {
			return;
		}
		
		var params = {
				type: type,
				item_id: item_id
		};
		
		$(item).html('Importing...');
		
		var callback = function(data) {
			
			if(data.status==true) {
				$(item).html(data.edit_url);
				
				$(item).attr('class', 'item import imported');
			} else {
				alert('Error:' + data.error);
			}
		};
		
		priv.inEdit[item_id] = true;
		priv.ajax(url, params, callback);
	};
	
	pub.search = function() {
		var url = '/movies/admin/settings/ppl_feeds/programs/list/search';
		
		var search_text = $('.ppl_feeds .searchbox #search').attr('value');
		var search_field = $('.ppl_feeds .searchbox #search_field').val();
		var search_type = $('.ppl_feeds .searchbox #type').val();
		var search_imported = $('.ppl_feeds .searchbox #search_imported').val();
		
		var params = {
				imported: search_imported,
				type: search_type,
				field: search_field,
				text: search_text
		};
		
		$('.ppl_feeds .searchbox .search').html('Searching...');
		
		var callback = function(data) {
			
			if(data.status==true) {
				$('.listAllPrograms').html(data.html);
				
				$('.ppl_feeds .searchbox .search').html('Search');
				
				pub.bind();
			} else {
				alert('Error:' + data.error);
			}
		};
		
		priv.ajax(url, params, callback);
	};
	
	pub.bind = function() {
		$('.ppl_feeds .listAllPrograms .list_row .import_me').click(function() {
			aetn.admin.movies.importItem(this);
		});
		
		$('.ppl_feeds .searchbox .search').click(function() {
			aetn.admin.movies.search();
		});
		
		//press enter event
		$('.ppl_feeds .searchbox #search').keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				aetn.admin.movies.search();
				return false;
			} else {
				return true;
			}
		});
	};
	
	return pub;
}();

$(document).ready(function() {
	$('.ppl_feeds .listByShowcode .list_row .item').click(function() {
		aetn.admin.schedule.editItem(this);
	});
	
	aetn.admin.movies.bind();
});