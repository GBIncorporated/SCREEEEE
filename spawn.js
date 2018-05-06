let mod = {};
module.exports = mod;

mod.priorityHigh = [];
mod.priorityLow = [Creep.role.bum];

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

      this.spawnByQueue(Spawn.priorityHigh);
      this.spawnByQueue(Spawn.priorityLow);
   }

   // Spawns creeps based on the two priority queues in order
   Spawn.prototype.spawnByQueue = function(queue)
   {
      if (!queue || queue.length == 0) return null;
      let role = queue.shift();
      let cost = 0;
      // Get the parts needed for behavior
      let parts = role.parts;
      for (let part of parts)
      {
         cost += BODYPART_COSTS[part];
      }

      // no parts
      if (cost === 0)
      {
         console.log('Zero parts body creep queued. Removed.');
         return false;
      }

      if (cost > this.room.energyAvailable)
      {
         if (cost > this.room.energyCapacityAvailable)
         {
            console.log("Queued creep greater then room capacity. " + JSON.stringify(role))
            return false;
         }
         // place back on queue to wait for enough energy.
         queue.unshift(role);
         return true;
      }

      let result = this.create(role, parts);
      return result;
   };


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