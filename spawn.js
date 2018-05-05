let mod = {};
module.exports = mod;

mod.priorityHigh = [];
mod.priorityLow = [];

// Extension functions for the base game spawn.
mod.extend = function()
{

   // Executes the main function of a spawn.
   // To create creeps
   Spawn.prototype.execute = function()
   {
      if (this.spawning)
      {
         return;
      }

      var role = Creep.role.bum;
      var parts = [WORK, MOVE, CARRY];

      let result = this.create(role, parts);
      return result;
   }

   /**
    * Creates a creep based on a role an a body.
    * Role is the type of creep and body is how
    * to make the creep.
    */
   Spawn.prototype.create = function(role, body)
   {
      if (body.length == 0)
      {
         return false;
      }

      var name = this.createCreep(body, null,
      {
         // this is the memory initializer ... just properties on
         // an object.  Strings are about the only thing that works
         // reliably though.
         CreepRole: role.name
      });
      if (name != undefined && name != ERR_NOT_ENOUGH_ENERGY)
      {
         // Pull that creep via memory
         var newCreep = Game.creeps[name];
         newCreep.SetupMemory();
         newCreep.SetRole(role);
      }
      return name;
   }
};

// Global execute to exceute on all owned spawns.
mod.execute = function()
{
   for (let name in Game.spawns)
   {
      let spawn = Game.spawns[name];
      spawn.execute();
   }
}