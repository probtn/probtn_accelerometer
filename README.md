This library execute user's callback for current gamma-angle of mobile device.
For usage this, user should create object, by calling function "OrientControl" with a massive of objects as parameters.
Structure of object : `{maxAngle : Number, minAngle : Number, callback : function(){}, ifLast : Boolean}`. If user want , that library finished work after last callback, he can marked it with `itLast == true` in object.
###### Example
```javascript
params.push({maxAngle : 10, minAngle : 0, function() { alert("between 0 and 10") }, isLast : false});
params.push({maxAngle : 20, minAngle : 10, function() { alert("between 10 and 20") }, isLast : false});
params.push({maxAngle : 30, minAngle : 20, function() { alert("between 20 and 30") }, isLast : true});
var test = OrientControl(params);
```
After that, if device gamma-angle changed, library will execute current callback. If gamma-angle become a value between 20 and 30, further work of library will be stopped. 
