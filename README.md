This library contain two functions - "OrientControl" and "Motion Control".
##### OrientControl
This function execute user's callback for current gamma-angle of mobile device.
For usage this, user should create object, by calling function "OrientControl" with a massive of objects as parameters.
Structure of object : `{maxAngle : Number, minAngle : Number, callback : function(){}, ifLast : Boolean}`. If user want , that library finished work after last callback, he can marked it with `itLast == true` in object.
###### Example
```javascript
var params = [];
params.push({maxAngle : 10, minAngle : 0, function() { alert("between 0 and 10") }, isLast : false});
params.push({maxAngle : 20, minAngle : 10, function() { alert("between 10 and 20") }, isLast : false});
params.push({maxAngle : 30, minAngle : 20, function() { alert("between 20 and 30") }, isLast : true});
var test = OrientControl(params);
```
After that, if device gamma-angle changed, library will execute current callback. If gamma-angle become a value between 20 and 30, further work of library will be stopped.
##### MotionControl
This function execute user's callback when he has started to shake mobile device and when he has finished.
For usage this, user should create object, by calling function "MotionControl" with special object as parameter.
Structure of object : `{ motionSensitive : Number, motionStarted : function(){}, motionFinished : function(){}, isRepeated : Boolean }`.
###### Example
```javascript
var param = { motionSensitive : 6, motionStarted : function(){ alert("start motion") }, motionFinished : function(){ alert("finish motion") }, isRepeated : false };
var test = MotionControl(param);
```
##### ScreenTurnControl
This function was created according to functional class pattern. For usage this, user should create object,
by calling function "ScreenTurnControl". And then, he will be able to get actual info about device orientation, by calling method "getOrientationType" of "ScreenTurnControl" object. Returned value:
+ `portrait-primary` : primary portrait orientation on Android/Tizen, secondary on iOS,
+ `portrait-secondary` : primary portrait orientation on iOS, secondary on Android/Tizen,
+ `landscape-primary` : primary landscape orientation on Android/Tizen, secondary on iOS,
+ `landscape-secondary` : primary landscape orientation on Android/Tizen, secondary on iOS.
###### Example
```javascript
var stc = new ScreenTurnControl();
var type = stc.getOrientationType();
```
