/**
 * [OrientControl description]
 * @param {Object[]} params - array of {maxAngle: 30, minAngle: 10, callback: function() {}},{callback: someFunc}
 * @param {number} params[].maxAngle - maximum angle in range
 * @param {number} params[].minAngle - minimum angle in range
 * @param {function} params[].callback - user's callback
 * @param {boolean} [params[].isLast] - it is last object?
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

 var currentItem = null;
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

							if (item !== currentItem)
							{
															
			            if ((item.callback !== undefined) && (item.callback !== null)) {
											if (typeof item.callback == "function")
											{
			                		item.callback();
											}
			            } else {
			                console.log("no callback");
			            }

									currentItem = item;
							}
	        }

	    })
	};


	/**
	 * [receiveMessage description]
	 * @return {[type]} [description]
	 */
	var receiveMessage = function(event)
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

/**
 * MotionControl - description
 *
 * @param {Object} param - object as parameter
 * @param {number} param.motionSensitive - sensitive
 * @param {function} param.motionStarted - user's callback for processing of start motion
 * @param {function} [param.motionFinished] - user's callback for processing of finish motion
 * @param {number} [param.isRepeated] - if true - motionStarted is repeated
 */
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

					if (_motionParams.isRepeated === true)
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
														{
                            	_motionParams.motionStarted();
														}
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

	/**
	 * receiveMessage function - description
	 *
	 * @return {type}  description
	 */
	var receiveMessage = function (event)
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
}

/**
 * ScreenTurnControl - description
 *
 * @return {null}  - if device's doen't support DeviceMotionEvent
 */
function ScreenTurnControl()
{
	if (!window.DeviceMotionEvent)
	{
		return null;
	}
	var self = this;
	var C_PORTRAIT_PRIMARY = "portrait-primary";
	var C_PORTRAIT_SECONDARY = "portrait-secondary";
	var C_LANDSCAPE_PRIMARY = "landscape-primary";
	var C_LANDSCAPE_SECONDARY = "landscape-secondary";
	var C_TIMER_INTERVAL = 300;
  var _x1 = 0, _y1 = 0, _x2 = 0, _y2 = 0;
	var _isDataUpdated = false;
	this.currentMode = undefined;

	var _handleDeviceMotion = function(event)
	{
		_x1 = event.accelerationIncludingGravity.x;
		_y1 = event.accelerationIncludingGravity.y;
	}

	var _processMotion = function()
	{
		if (_isDataUpdated)
		{
			var delta = Math.abs(_y1) - Math.abs(_x1);
			if (delta > 0)
			{
				if (_y1 > 0)
				{
					self.currentMode = C_PORTRAIT_PRIMARY;
				}
				else {
					self.currentMode = C_PORTRAIT_SECONDARY;
				}
			}
			else {
				if (_x1 > 0)
				{
					self.currentMode = C_LANDSCAPE_PRIMARY;
				}
				else {
					self.currentMode = C_LANDSCAPE_SECONDARY;
				}
			}
		}
		_x2 = _x1;
		_y2 = _y1;
		_isDataUpdated = true;
	}

	/**
	 * this method return current device orientation type
	 *  @returns {string}  - "portrait-primary" : primary portrait orientation on Android/Tizen, secondary on iOS
	 * (									 - "portrait-secondary" : primary portrait orientation on iOS, secondary on Android/Tizen
	 * 										 - "landscape-primary" : primary landscape orientation on Android/Tizen, secondary on iOS
	 * 										 - "landscape-secondary" : primary landscape orientation on iOS, secondary on Android/Tizen
	 */
	this.getOrientationType = function()
	{
		return self.currentMode;
	}

	window.addEventListener("devicemotion", _handleDeviceMotion, false);
	setInterval(_processMotion, C_TIMER_INTERVAL);
}
