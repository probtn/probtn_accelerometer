//[{maxAngle: 30, minAngle: 10, callback: function() {}},{callback: someFunc}]

/**
 * [OrientControl description]
 * @param {[type]} params [description]
 */
function OrientControl(params) {

	var orientParams = [];
	var isLast = false;

	/**
	 * [addCorrectParams description]
	 * @param {[type]} params [description]
	 */
	var addCorrectParams = function(params)
	{
			params.forEach(function(elem)
			{
				if ((elem.maxAngle !== undefined) || (elem.maxAngle !== null) || (elem.minAngle !== undefined) ||
		 			(elem.minAngle !== null))
					{
						orientParams.push(elem);
					}
			});
	};

	/**
	 * [checkOrientation description]
	 * @param  {[type]} gamma [description]
	 * @return {[type]}       [description]
	 */
	var checkOrientation = function (gamma) {
	    orientParams.forEach(function (item) {
	        if ((item.maxAngle > gamma) && (gamma >= item.minAngle)) {
	            if (item.isLast === true) {
	                isLast = true;
	            }
	            if ((item.callback !== undefined) && (item.callback !== null)) {
									if (typeof item.callback == "function")
									{
	                		item.callback();
									}
	            } else {
	                console.log("no callback");
	            }

	        }

	    })
	};

	/**
	 * [receiveMessage description]
	 * @return {[type]} [description]
	 */
	var receiveMessage = function()
	{
		if (isLast !== true) {
			if ((event.data!==null) && (event.data!==undefined)) {
            	if (event.data.message === "probtn_page_deviceorientation") {
                	checkOrientation(event.data.dataEvent.gamma);
            	}
        	}
		}
	};

	addCorrectParams(params);
	window.addEventListener("message", receiveMessage, false);
}

function MotionControl(param)
{
	var C_TIMER_INTERVAL = 150;
	var _motionParams;
  var _x1 = 0, _y1 = 0, _z1 = 0, _x2 = 0, _y2 = 0, _z2 = 0;
	var _isShaking = false;
	var _isDataUpdated = false;
	var isMultipleProcessing = false;	// multy motion processing flag

	var addCorrectParams = function(param)
	{
				if ((param.motionSensitive !== undefined) || (param.motionSensitive !== null) ||
				(param.motionStarted !== undefined) || (param.motionStarted !== null))
					{
						_motionParams = param;
					}

					if (_motionParams.isMultipleProcessing === true)
					{
						isMultipleProcessing = true;
					}
	};

	var processMotion = function()
	{
      if (_isDataUpdated)
			{
      	var change = Math.abs(_x1 - _x2 + _y1 - _y2 + _z1 - _z2);
      						if ((change > _motionParams.motionSensitive) && ((!_isShaking) ||
								(isMultipleProcessing === true)))
									{						// motion process had started or continuing
                            _isShaking = true;
														if (typeof _motionParams.motionStarted == "function")
                            _motionParams.motionStarted();
                  }

									if ((change < _motionParams.motionSensitive) && (_isShaking))
									{						// motion process had finished
                            _isShaking = false;
														if ((_motionParams.motionFinished != undefined) &&
																	(_motionParams.motionFinished != null))
														{
															if (typeof _motionParams.motionFinished == "function")
															 	{
	                            		_motionParams.motionFinished();
															 	}
													  }
                  }
        }
      // Update new position
      _x2 = _x1;
      _y2 = _y1;
      _z2 = _z1;
      _isDataUpdated = true;
 	};

	var receiveMessage = function ()
	{
      if ((event.data!==null) && (event.data!==undefined)) {
      	if (event.data.message === "probtn_page_devicemotion") {
                	        _x1 = event.data.dataEvent.x;
                            _y1 = event.data.dataEvent.y;
                            _z1 = event.data.dataEvent.z;
            	        }
        	        }
  };

  window.self.addEventListener("message", receiveMessage, false);
	addCorrectParams(param);
	setInterval(processMotion, C_TIMER_INTERVAL);
	//test code
	/*var event = new CustomEvent("message");
	event.data = {};
	event.data.message = "probtn_page_devicemotion";
	event.data.dataEvent = {x : 1, y: 1, z : 1};
  window.dispatchEvent(event);
	processMotion();
	event.data.dataEvent = {x : 7, y: 7, z : 7};
	window.dispatchEvent(event);
	processMotion();*/
}
