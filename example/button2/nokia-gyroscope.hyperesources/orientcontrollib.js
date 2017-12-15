//[{maxAngle: 30, minAngle: 10, callback: function() {}},{callback: someFunc}]
function OrientControl(params) {
	
	var orientParams = [];
	var isLast = false;
	
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
	
	addCorrectParams(params);
	
	var checkOrientation = function(gamma)
	{
		this.orientParams.forEach(function(item)
		{
			if	((item.maxAngle > gamma) && (gamma > item.minAngle))
				{

					if (item.isLast === true) {
						isLast = true;
						alert("isLast");
					}
					if  ((item.callback != undefined) && (item.callback != null))
						item.callback();
				}
				
			
		})
	};
	
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
	
	window.addEventListener("message", receiveMessage, false);
}