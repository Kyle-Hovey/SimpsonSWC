$(document).ready(function() {
	var type = $('#charactertype').val();
	if (type == 'patron') {
		$('.proxyform').hide();
		$('#proxycontact').show();
		$('#patroncontact').hide();
		$('.patron').show();
		$('.wildcard').hide();

	}
	else if (type == 'proxy'){
		$('.proxyform').show();
		$('#patroncontact').show();
		$('#proxycontact').hide();
		$('.patron').show();
		$('.wildcard').hide();
	}
	else if (type == 'wildcard') {
		$('.proxyform').show();
		$('#patroncontact').hide();
		$('#proxycontact').hide();
		$('.patron').hide();
		$('.wildcard').show();
	}
});

$("#charactertype").change(function() {
	var type = $(this).val();
	if (type == 'patron') {
		$('.proxyform').hide();
		$('#proxycontact').show();
		$('#patroncontact').hide();
		$('.patron').show();
		$('.wildcard').hide();
	}
	else if (type == 'proxy'){
		$('.proxyform').show();
		$('#patroncontact').show();
		$('#proxycontact').hide();
		$('.patron').show();
		$('.wildcard').hide();
	}
	else if (type == 'wildcard') {
		$('.proxyform').show();
		$('#patroncontact').hide();
		$('#proxycontact').hide();
		$('.patron').hide();
		$('.wildcard').show();
	}
});

$('#addskill').click(function() {
	$('#skill-container').append("<div class=\"skill\"><textarea class=\"form-control\" name=\"skills\" rows=\"3\" placeholder=\"Character's skills and knowledge...\" style=\"resize: none\"></textarea><br></div>");
});

$("#removeskill").click(function() {
	$('.skill:last').remove();
});

$('#addability').click(function() {
	$('#ability-container').append("<div class=\"ability\"><textarea class=\"form-control\" name=\"special\" rows=\"3\" placeholder=\"Character's abilities and objects...\" style=\"resize: none\"></textarea><br></div>");
});

$("#removeability").click(function() {
	$('.ability:last').remove();
});