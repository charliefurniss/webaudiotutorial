var Sequencer = function(context) {

	var channelArray = [];

	this.channelArray = channelArray;

	this.setUpChannels = function(bufferList, config){

		for (i = 0; i < bufferList.length; i++){

			//create sequence array based on config.seqLength variable
			var emptySeqArray = [];
			for (k = 0; k < config.seqLength; k++){
				emptySeqArray.push(0);
			}
			//create channel
			var channel = {
				number: i + 1,
				seqArray: emptySeqArray,
				instr: bufferList[i],
				gain: 1,
				solo: false,
				mute: false
			}
			//push channel object into channelArray
			channelArray.push(channel);
			//using channel info to create HTML elements on page
			createChannelHTML(channel);
		}
		registerMuteButtonClick();
		registerGainSliderOperation();
	}

	function createChannelHTML(channel){
		var seqContainerDiv = '<div class="seqContainer" id="channel' + channel.number + '"></div>';
		
		$('body').append(seqContainerDiv);
		$('#channel' + channel.number).append(channel.number + " ");

		for (j = 0; j < channel.seqArray.length; j++){
			var step = j + 1;
			var button = '<button class="seqButton" channel="' + channel.number + '" data="' + step + '" value="0" id="ch' + channel.number + '_st' + step +'"></button>';
			$('#channel' + channel.number).append(button);
		}
		var soloButton = '<input type="button" class="controlButton soloButton" channel="' + channel.number + '" data=' + channel.solo + ' value="S"  id="ch' + channel.number + '_solo"></button>';
		$('#channel' + channel.number).append(soloButton);
		var muteButton = '<input type="button" class="controlButton muteButton" channel="' + channel.number + '" data=' + channel.mute + ' value="M"  id="ch' + channel.number + '_mute"></button>';
		$('#channel' + channel.number).append(muteButton);
		var gainSlider = '<input type="range" class="gainSlider" channel="' + channel.number + '" min="0" max="1" step="0.1" value="1"  id="ch' + channel.number + '_gain"></button>';
		$('#channel' + channel.number).append(gainSlider);
	}

	this.registerSeqButtonClick = function(){

		function playSound(buffer, time) {
		  var source = context.createBufferSource();
		  source.buffer = buffer;
		  source.connect(context.destination);
		  if (!source.start)
		    source.start = source.noteOn;
		  source.start(time);
		}

	  $('button').each(function(){
	    $(this).on('click', function(){
	      var click = $(this);
	      var step = click.attr('data') - 1;
	      var channel = click.attr('channel');
	      var playBoolean = click.attr('value');
	      var instr = channelArray[channel - 1].instr;

	      $('#' + click.attr('id')).toggleClass("seqClicked");
	      playSound(instr, 0);

	      if (playBoolean == 1){
	        $('#' + click.attr('id')).val(0);
	      } else {
	        $('#' + click.attr('id')).val(1);
	      }

	      if (channelArray[channel - 1].seqArray[step] == 0) {
	        channelArray[channel - 1].seqArray[step] = 1;
	      } else {
	        channelArray[channel - 1].seqArray[step] = 0;
	      }

	    });
	  })
	}


	function registerMuteButtonClick(){
		$(function(){
			$('.muteButton').each(function(){
				$(this).on('click', function(){				
					var click = $(this);
					var channel = click.attr('channel');
					channelArray[channel - 1].mute === false ? muteOff(channel) : muteOn(channel);
				})
			})
		});
	}

	function muteOff(channel){
		console.log("muteOff");
	  channelArray[channel - 1].mute = true;
	  console.log(channelArray[channel - 1].mute);
	}

	function muteOn(channel){
		console.log("muteOn");
	  channelArray[channel - 1].mute = false;
	  console.log(channelArray[channel - 1].mute);
	}

	function registerGainSliderOperation(){
		$(function(){
			$('.gainSlider').each(function(){
				$(this).on("input", function(){
					var click = $(this);
					var channel = click.attr('channel');
					console.log(this.value);
					channelArray[channel - 1].gain = this.value;
				});
			})
		});
	}

}