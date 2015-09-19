var Demo = require("./demo");

console.log(Demo);

var demo = Demo.create(1);
console.log(demo);
demo.Initialize('test');
console.log(demo);
demo.UpdateTest("pippo");
console.log(demo);