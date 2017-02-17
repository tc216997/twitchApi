$(document).ready(function() {
  $.ajaxSetup({
  headers : {
      'Client-ID': 'uwfyo6pyfjg8ftjl7zfnzgfn108ezu'
    } 
  });
  main();
  $(document).on('click', '.mainCell', function(event) {
    $(this).toggleClass("selected");
  });
  $(document).on('click', '#deleteButton', function(event){
    event.preventDefault();
    $('.selected').remove();
  });
  $('#addButton').click(function(e) {
    e.preventDefault();
    addChannel();
  });
  $(document).keydown(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      addChannel();
    }
  });
});

function addChannel() {
    var user = $(':input').val();
    var url = 'https://api.twitch.tv/kraken/streams/' + user + '?client_id=twitchAPIkey';
    getInfo(url, user);
}

function main() {
  var array = ['esl_sc2', 'esl_lol', "freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff"];
  for (var i = 0; i < array.length; i++) {
    var url = 'https://api.twitch.tv/kraken/streams/' + array[i];
    var user = array[i];
    getInfo(url, user);
  }
  filterListener();
}

function filterListener() {
  $(".dropdown-menu li a").click(function() {
    var idName = $(this).attr('id');
    var online = $('.online');
    var offline = $('.offline');
    if (idName === 'online') {
      online.show();
      offline.hide();
      $('.filterButton').text('Online');
    } else if (idName === 'offline') {
      offline.show();
      online.hide();
      $('.filterButton').text('Offline');
    } else {
      $('.mainCell').show();
      $('.filterButton').text('All');
    }
  });
}

function getInfo(url, user) {
  $.getJSON(url, function(data) {
    var status;
    if (!data.stream) {
      status = "offline";
      $.getJSON(data._links.channel, function(data) {
        var imgAddress = data.logo;
        var twitchID = data.display_name;
        var link = data.url;
        var statusMsg = 'Offline';
        addDivTemplate(status, twitchID, imgAddress, link, statusMsg);
        $(':input').val('');
      });
    } else {
      status = "online";
      var imgAddress = data.stream.channel.logo;
      var twitchID = data.stream.channel.display_name;
      var link = data.stream.channel.url;
      var statusMsg = data.stream.channel.status;
      addDivTemplate(status, twitchID, imgAddress, link, statusMsg);
      $(':input').val('');
    }
  }).error(function() {
    var status = 'offline';
    var statusMsg = 'user:  ' + '<strong>' + user + '</strong></br>' + " doesn't exist!";
    var twitchID = ' ';
    var link = '#';
    var imgAddress = 'https://lh4.ggpht.com/TfjIdvBxvojPqr3_Xp9qQ6OEhDjv3QflSZBvci9LNEhbT5BxYcR5xleRgJNeMgSkL2w=w300';
    addDivTemplate(status, twitchID, imgAddress, link, statusMsg);
    $(':input').val('');
  });
}

function addDivTemplate(status, twitchID, imgAddress, link, statusMsg) {
  var eleA = document.createElement('a');
  var mainCell = document.createElement('div');
  var leftSubcell = document.createElement('div');
  var rightSubcell = document.createElement('div');
  var eleImg = document.createElement('img');
  var idDiv = document.createElement('div');
  var idSpan = document.createElement('span');
  var statusDiv = document.createElement('div');
  var statusSpan = document.createElement('span');
  $(eleA).attr({
    href: link,
    target: '_blank',
    title: "click here for " + twitchID + "'s channel"
  });
  var profileSil = 'https://media.apnarm.net.au/img/media/images/2015/01/16/GGT_16-01-2015_EGN_05_male-silhouette.2_ct300x300.jpg';
  if (!imgAddress) {
    $(eleImg).attr('src', profileSil);
  } else {
    $(eleImg).attr('src', imgAddress);
  }
  $(eleImg).addClass('twitchProfile');
  $(eleA).addClass('twitchLink');
  $(eleA).append(eleImg)
  $(leftSubcell).append(eleA);
  $(mainCell).addClass('col col-lg-6 mainCell');
  $(leftSubcell).addClass('col col-lg-6 subcell text-center');
  $(rightSubcell).addClass('col col-lg-6 subcell');
  $(idDiv).addClass('col col-lg-12 twitchID');
  $(statusDiv).addClass('col col-lg-12 twitchStatus');
  $(statusSpan).html(statusMsg);
  $(statusSpan).addClass('rightSubcellSpan');
  $(idSpan).text(twitchID);
  $(idSpan).addClass('rightSubcellSpan')
  $(statusDiv).append(statusSpan);
  $(idDiv).append(idSpan);
  $(rightSubcell).append(idDiv).append(statusDiv);
  $(mainCell).append(leftSubcell).append(rightSubcell);
  if (status === 'online') {
    $(mainCell).addClass('online')
  } else {
    $(mainCell).addClass('offline');
  }
  $('.mainRow').append(mainCell);

}