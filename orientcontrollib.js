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
				if ((elem.maxAngle != undefined) || (elem.maxAngle != null) || (elem.minAngle != undefined) ||
		 			(elem.minAngle != null))
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
	var checkOrientation = function(gamma)
	{
		orientParams.forEach(function(item)
		{
			if	((item.maxAngle > gamma) && (gamma > item.minAngle))
			{
				console.log("item", item, gamma);
					if (item.isLast === true) {
						isLast = true;
						alert("isLast");
					}
					if  ((item.callback != undefined) && (item.callback != null))
						item.callback();
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