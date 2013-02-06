/*! (c) Aaron Gustafson (@AaronGustafson). MIT License. http://github.com/easy-designs/jquery.easy-modifiable-table.js */

/* Modifiable Table API
 * 
 * This script enables the dyynamic showing and hiding of columns and column groups.
 * In order to modify the table, you must set two data attributes on the table:
 * 
 *  - The data-modifiable attribute
 * 	  A comma-separated list of all column names that are removable
 *  - The data-modifiable-start-with 
 *    A comma seaparated list of which columns should be shown by default
 * 
 * The modifiable drop-down list will be added to an element with a class of "table-tools"
 * that exists as a sibling to the table parent
 * 
 **/

;(function($){
	
	var MODIFIABLE = 'modifiable',
		$mod_tools = $('<div class="modification-tools"><span>Modify Table</span><ul/></div>'),
		$option = $('<li><label></label></li>'),
		$input = $('<input type="checkbox"/>');
	
	$.fn.easyModifiableTable = function(){
	
		var $tables = $(this);
		
		$tables.each(function(){

			var $table = $(this),
				modifiable = $table.data( MODIFIABLE ),
				start_with = $table.data( MODIFIABLE + '-start-with' ),
				$headers = $table.find('thead th'),
				$tools = $mod_tools.clone(),
				have_parents = [];

			if ( modifiable )
			{
				modifiable = modifiable.split(',');
			}
			if ( start_with )
			{
				start_with = start_with.split(',');
			}

			$.each( modifiable, function( i, text ){
				var id = 'column-' + i;
				$option.clone()
					.appendTo( $tools.find('ul') )
					.find('label')
						.attr( 'for', id )
						.text( ' ' + text )
							.prepend(
								$input.clone()
									.attr({
										'id': id,
										'checked': true
									 })
									.val( text )
							);
			} );

			$tools
				.on( 'change', 'input', function(){

					var $input = $(this),
						value = $input.val(),
						checked = $input.is(':checked'),
						$header = $table.find('th')
									.filter(function(){
										return $(this).text() == value;
									}),
						$prev = $header.prevAll(),
						columns = [],
						column = $header.index(),
						col_count = $header.attr('colspan'),
						$nodes = $([]);

					// get the precieved column #
					if ( $prev.length )
					{
						$prev.each(function(){
							var cols = $(this).attr('colspan');
							if ( cols ) 
							{
								column += ( cols - 1 );
							}
						});
					}

					// push the columns #
					if ( col_count )
					{
						while ( col_count-- )
						{
							columns.push( column + col_count );
						}
					}
					else
					{
						columns.push( column );
					}

					// loop & collect the columns
					$table.find('tr')
						.children()
						.each(function(){

							var $el = $(this),
								$my_prev = $el.prevAll(),
								my_column = $el.index(),
								my_colspan = $el.attr( 'colspan' ),
								local_map = columns.slice(0),
								map_index;

							// get the precieved column #
							if ( $my_prev.length )
							{
								$my_prev.each(function(){
									var cols = $(this).attr('colspan');
									if ( cols ) 
									{
										my_column += ( cols - 1 );
									}
								});
							}
							map_index = $.inArray( my_column, local_map );

							// this column is in the list
							if ( map_index > -1 )
							{
								$nodes = $nodes.add( $el );

								// remove from the local map
								local_map.splice( map_index, ( my_colspan ? my_colspan : 1 ) );
							}

						 } );

					$nodes[( checked ? 'show' : 'hide' )]();

				 })
				.find('input')
					.each(function(){
						var $input = $(this);
						if ( $.inArray( $input.val(), start_with ) == -1 )
						{
							$input.attr( 'checked', false )
								.trigger('change');
						}
					 });

			$tools.prependTo( $table.parent().siblings('.table-tools') );
			
			// ensure there is always enough room to show the tools
			$table.closest('.TabInterface-enabled')
				.css( 'min-height', $tools.outerHeight() + $tools.find('ul').outerHeight() + 10 );
			
		} );
		
		// maintain the chain
		return this;
	};
	
})(jQuery);