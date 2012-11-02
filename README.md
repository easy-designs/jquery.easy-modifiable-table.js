jquery.easy-modifiable-table.js
===============================

A simple script that facilitates the addition and removal of table columns by a user

The API
-------

This script enables the dyynamic showing and hiding of columns and column groups. In order to modify the table, you must set two data attributes on the table:

 - The `data-modifiable` attribute
	  A comma-separated list of all column names that are removable
 - The `data-modifiable-start-with`
   A comma seaparated list of which columns should be shown by default

The modifiable drop-down list will be added to an element with a class of "table-tools" that exists as a sibling to the table parent.