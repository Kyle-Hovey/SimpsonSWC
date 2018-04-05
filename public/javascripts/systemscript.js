$(document).on('click', '.addevent', function() {
	$('<h5>Crisis Event</h5><input class="form-control" type="text" name="eventname" placeholder="Event related to the crisis"><h5>Event Description</h5><textarea class="form-control" type="text" name="eventdescription" placeholder="Description of event" style="resize : none;"></textarea><br>').insertBefore(this);
});