require("globalCodeInject");

global.install();
// Main loop entry
module.exports.loop = function()
{
   // ensure required memory namespaces
   if (Memory.modules === undefined)
   {
      Memory.modules = {
         viral:
         {},
         internalViral:
         {}
      };
   }

   Creep.execute();
   Spawn.execute();
}