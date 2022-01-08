'use strict';

var _ = window._;
//var moment = window.moment;

var qa4changes = {
  name: 'qa4changes'
  , label: 'Qualitätssicherung'
  , pluginType: 'report'
};

function init() {
  return qa4changes;
}

module.exports = init;

qa4changes.html = function html(client) {
  var translate = client.translate;
  var ret =
    '<p>' + translate('To see this report, press SHOW while in this view') + '</p>'
  + '<div id="qa4changes-report"></div>';

  return ret;
};

qa4changes.css =
    '.border_bottom td {'
  + '  border-bottom:1pt solid #eee;'
  + '}'
  ;

qa4changes.report = function report_qa4changes(datastorage, sorteddaystoshow, options) {
  var Nightscout = window.Nightscout;
  var client = Nightscout.client;
  var translate = client.translate;
  var report_plugins = Nightscout.report_plugins;

  var div = $('<div>');

  /*--- Site Change (start) -------------*/
  var table = $('<table>');
  table.append($('<tr>').css('background','#ccffcc')
    .append($('<th>').css('width','100px').attr('align','left').append("Wochentag"))
    .append($('<th>').css('width','80px').attr('align','left').append("Datum"))
    .append($('<th>').css('width','80px').attr('align','left').append(translate('Time')))
    .append($('<th>').css('width','300px').attr('align','left').append(translate('Event Type')))
    .append($('<th>').css('width','350px').attr('align','left').append(translate('Duration')))
  );

  var treatments = _.clone(datastorage.treatments);

  treatments = treatments.filter(function filterSensor (t) {
    return t.eventType.indexOf('Site Change') > -1;
  }).sort(function(a, b) {
    return a.mills > b.mills;
  });

  if (options.order === report_plugins.consts.ORDER_NEWESTONTOP) {
    treatments.reverse();
  }

  var lastMills = 0;
  for (var t=0; t<treatments.length; t++) {
    var tr = treatments[t];

    var mills = 0;
    var days = 0;
    var hours = 0;
    var minutes = 0;

    if (t === 0){
      mills = new Date().getTime() - tr.mills;
    }else {
      mills = lastMills - tr.mills;
    }
    days = Math.floor(mills / 1000 / 60 / 60 / 24);
    hours = Math.floor(mills / 1000 / 60 / 60) - days * 24;
    minutes = Math.floor(mills / 1000 / 60) - (hours + 24 * days) * 60;

    var bgcolor = '';
    if ((days * 24 + hours) < (1.25 * 2 * 24)){
      bgcolor = '#7fff00';
    }
    else {
      if ((days * 24 + hours) < (1.5 * 2 * 24)){
        bgcolor = '#ffd700';
      } else {
        bgcolor = '#ff4500';
      }
    }

    table.append($('<tr>').addClass('border_bottom')
      .append($('<td>').append([translate('Sunday'),translate('Monday'),translate('Tuesday'),translate('Wednesday'),translate('Thursday'),translate('Friday'),translate('Saturday')][new Date(tr.created_at).getDay()]))
      .append($('<td>').append(new Date(tr.created_at).toLocaleDateString()))
      .append($('<td>').append(new Date(tr.created_at).toLocaleTimeString()))
      .append($('<td>').append(translate(client.careportal.resolveEventName(tr.eventType))))
      .append($('<td>').css('background-color' , bgcolor).append((days === 0 ? "" : days + " Tage ") + (hours + " Stunden " + minutes + " Minuten")).append(t === 0 ? " und läuft noch" : "")));

    lastMills = tr.mills;

  }

  /*--- Site Change (end) -------------*/

  /*--- Insulin Change (start) -------------*/
  var tableInsulinChange = $('<table>');
  tableInsulinChange.append($('<tr>').css('background','#ccffcc')
    .append($('<th>').css('width','100px').attr('align','left').append("Wochentag"))
    .append($('<th>').css('width','80px').attr('align','left').append("Datum"))
    .append($('<th>').css('width','80px').attr('align','left').append(translate('Time')))
    .append($('<th>').css('width','300px').attr('align','left').append(translate('Event Type')))
    .append($('<th>').css('width','350px').attr('align','left').append(translate('Duration')))
  );

  treatments = _.clone(datastorage.treatments);

  treatments = treatments.filter(function filterSensor (t) {
    return t.eventType.indexOf('Insulin Change') > -1;
  }).sort(function(a, b) {
    return a.mills > b.mills;
  });

  if (options.order === report_plugins.consts.ORDER_NEWESTONTOP) {
    treatments.reverse();
  }

  lastMills = 0;
  for (t=0; t<treatments.length; t++) {
    tr = treatments[t];

    if (t === 0){
      mills = new Date().getTime() - tr.mills;
    }else {
      mills = lastMills - tr.mills;
    }
    days = Math.floor(mills / 1000 / 60 / 60 / 24);
    hours = Math.floor(mills / 1000 / 60 / 60) - days * 24;
    minutes = Math.floor(mills / 1000 / 60) - (hours + 24 * days) * 60;

    bgcolor = '';
    if ((days * 24 + hours) < (1.1 * 5 * 24)){
      bgcolor = '	#7fff00';
    }
    else {
      if ((days * 24 + hours) < (1.2 * 5 * 24)){
        bgcolor = '#ffd700';
      } else {
        bgcolor = '#ff4500';
      }
    }

    tableInsulinChange.append($('<tr>').addClass('border_bottom')
      .append($('<td>').append([translate('Sunday'),translate('Monday'),translate('Tuesday'),translate('Wednesday'),translate('Thursday'),translate('Friday'),translate('Saturday')][new Date(tr.created_at).getDay()]))
      .append($('<td>').append(new Date(tr.created_at).toLocaleDateString()))
      .append($('<td>').append(new Date(tr.created_at).toLocaleTimeString()))
      .append($('<td>').append(translate(client.careportal.resolveEventName(tr.eventType))))
      .append($('<td>').css('background-color' , bgcolor).append((days === 0 ? "" : days + " Tage ") + (hours + " Stunden " + minutes + " Minuten")).append(t === 0 ? " und läuft noch" : "")));

    lastMills = tr.mills;

  }
  /*--- Insulin Change (end) -------------*/

  /*--- Sensor Change (start) -------------*/
  var tableSensorChange = $('<table>');
  tableSensorChange.append($('<tr>').css('background', '#ccffcc' )
    .append($('<th>').css('width','100px').attr('align','left').append("Wochentag"))
    .append($('<th>').css('width','80px').attr('align','left').append("Datum"))
    .append($('<th>').css('width','80px').attr('align','left').append(translate('Time')))
    .append($('<th>').css('width','300px').attr('align','left').append(translate('Event Type')))
    .append($('<th>').css('width','350px').attr('align','left').append(translate('Duration')))
  );

  treatments = _.clone(datastorage.treatments);

  treatments = treatments.filter(function filterSensor (t) {
    return t.eventType.indexOf('Sensor Change') > -1;
  }).sort(function(a, b) {
    return a.mills > b.mills;
  });

  if (options.order === report_plugins.consts.ORDER_NEWESTONTOP) {
    treatments.reverse();
  }

  lastMills = 0;
  for (t=0; t<treatments.length; t++) {
    tr = treatments[t];

    if (t === 0){
      mills = new Date().getTime() - tr.mills;
    }else {
      mills = lastMills - tr.mills;
    }
    days = Math.floor(mills / 1000 / 60 / 60 / 24);
    hours = Math.floor(mills / 1000 / 60 / 60) - days * 24;
    minutes = Math.floor(mills / 1000 / 60) - (hours + 24 * days) * 60;

    bgcolor = '';
    if ((days * 24 + hours) < (0.8 * 10 * 24)){
      bgcolor = '#ff4500';
    }
    else {
      if ((days * 24 + hours) < (0.9 * 10 * 24)){
        bgcolor = '#ffd700';
      } else {
        bgcolor = '#7fff00';
      }
    }

    tableSensorChange.append($('<tr>').addClass('border_bottom')
      .append($('<td>').append([translate('Sunday'),translate('Monday'),translate('Tuesday'),translate('Wednesday'),translate('Thursday'),translate('Friday'),translate('Saturday')][new Date(tr.created_at).getDay()]))
      .append($('<td>').append(new Date(tr.created_at).toLocaleDateString()))
      .append($('<td>').append(new Date(tr.created_at).toLocaleTimeString()))
      .append($('<td>').append(translate(client.careportal.resolveEventName(tr.eventType))))
      .append($('<td>').css('background-color' , bgcolor).append((days === 0 ? "" : days + " Tage ") + (hours + " Stunden " + minutes + " Minuten")).append(t === 0 ? " und läuft noch" : "")));

    lastMills = tr.mills;

  }
  /*--- Sensor Change (end) -------------*/

  /*--- Pump Batterie Change (start) -------------*/
  var tablePumpBatterieChange = $('<table>');
  tablePumpBatterieChange.append($('<tr>').css('background', '#ccffcc')
    .append($('<th>').css('width','100px').attr('align','left').append("Wochentag"))
    .append($('<th>').css('width','80px').attr('align','left').append("Datum"))
    .append($('<th>').css('width','80px').attr('align','left').append(translate('Time')))
    .append($('<th>').css('width','300px').attr('align','left').append(translate('Event Type')))
    .append($('<th>').css('width','350px').attr('align','left').append(translate('Duration')))
  );

  treatments = _.clone(datastorage.treatments);

  treatments = treatments.filter(function filterSensor (t) {
    return t.eventType.indexOf('Pump Battery Change') > -1;
  }).sort(function(a, b) {
    return a.mills > b.mills;
  });

  if (options.order === report_plugins.consts.ORDER_NEWESTONTOP) {
    treatments.reverse();
  }

  lastMills = 0;
  for (t=0; t<treatments.length; t++) {
    tr = treatments[t];

    if (t === 0){
      mills = new Date().getTime() - tr.mills;
    }else {
      mills = lastMills - tr.mills;
    }
    days = Math.floor(mills / 1000 / 60 / 60 / 24);
    hours = Math.floor(mills / 1000 / 60 / 60) - days * 24;
    minutes = Math.floor(mills / 1000 / 60) - (hours + 24 * days) * 60;

    bgcolor = '';
    if ((days * 24 + hours) < (1.1 * 20 * 24)){
      bgcolor = '#7fff00';
    }
    else {
      if ((days * 24 + hours) < (1.2 * 20 * 24)){
        bgcolor = '#ffd700';
      } else {
        bgcolor = '#ff4500';
      }
    }

    tablePumpBatterieChange.append($('<tr>').addClass('border_bottom')
      .append($('<td>').append([translate('Sunday'),translate('Monday'),translate('Tuesday'),translate('Wednesday'),translate('Thursday'),translate('Friday'),translate('Saturday')][new Date(tr.created_at).getDay()]))
      .append($('<td>').append(new Date(tr.created_at).toLocaleDateString()))
      .append($('<td>').append(new Date(tr.created_at).toLocaleTimeString()))
      .append($('<td>').append(translate(client.careportal.resolveEventName(tr.eventType))))
      .append($('<td>').css('background-color' , bgcolor).append((days === 0 ? "" : days + " Tage ") + (hours + " Stunden " + minutes + " Minuten")).append(t === 0 ? " und läuft noch" : "")));

    lastMills = tr.mills;

  }
  /*--- Pump Batterie Change (end) -------------*/

  /*--- build the final HTML tree (begin) -------------*/
  div.append('<h3>', 'Wann wurde der Katheder von mir gewechselt? Und wieviel Zeit war zwischen den Wechseln?');
  div.append(table);

  div.append('<h3>', 'Wann wurde das Insulin von mir gewechselt? Und wieviel Zeit war zwischen den Wechseln?');
  div.append(tableInsulinChange);

  div.append('<h3>', 'Wann wurde der Sensor von mir gewechselt? Und wieviel Zeit war zwischen den Wechseln?');
  div.append(tableSensorChange);

  div.append('<h3>', 'Wann wurde die Batterie der Insulinpumpe von mir gewechselt? Und wieviel Zeit war zwischen den Wechseln?');
  div.append(tablePumpBatterieChange);
  /*--- build the final HTML tree (end) -------------*/

  $('#qa4changes-report').html(div);

};
