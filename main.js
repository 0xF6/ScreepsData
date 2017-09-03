const isProfiler = true;



if(!isProfiler)
{
    module.exports.loop = function ()
    {
        require("xInput").xInput.Main();
    };
}
else
{
    profiler = require('screeps-profiler');
    profiler.enable();
    module.exports.loop = function() 
    {
      profiler.wrap(function() 
      {
         require("xInput").xInput.Main();
      });
    }
}


