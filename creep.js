let mod = {};
module.exports = mod;

mod.extend = function()
{
   // Creates memory space within the creeps
   // for storing primitives.
   Creep.prototype.SetupMemory = function()
   {
      if (this.memory.data == undefined)
      {
         this.memory.data = {
            targetId: "",
            predictedRenewal: 0,
            role:
            {},
            activity:
            {}
         }
      }
   }

   // Runs this creep based on its roll.
   Creep.prototype.run = function()
   {
      var roleType = Creep.role[this.GetRole()
         .name];
      console.log(roleType);
      if (roleType != undefined)
      {
         roleType.run(this);
      }
      else
      {
         console.log("Got an undefined role! " + roleType);
         // Dead weight reclaim
         this.suicide();
      }
   }

   // Move the creep to a position
   Creep.prototype.Drive = function(pos)
   {
      return this.moveTo(pos.x, pos.y);
   }

   // Memory Get and set
   Creep.prototype.GetRole = function()
   {
      return Creep.role[this.GetData()
         .role.name];
   }

   Creep.prototype.GetData = function()
   {
      return this.memory.data;
   }

   Creep.prototype.GetActivity = function()
   {
      if (this.GetData()
         .activity != null)
      {
         return Creep.activity[this.GetData()
            .activity.name];
      }
      else return null;
   }

   Creep.prototype.SetActivity = function(value)
   {
      this.memory.data.activity = value;
   }

   Creep.prototype.SetRole = function(value)
   {
      this.memory.data.role = value;
   }

   Creep.prototype.SetData = function(value)
   {
      return this.memory.data = value;
   }

   Creep.prototype.SetTarget = function(value)
   {
      this.memory.data.targetId = value.id;
   }

   Creep.prototype.GetTarget = function()
   {
      return Game.getObjectById(this.memory.data.targetId);
   }

   // Helper functions
   Creep.prototype.GetCurrentCarryAmount = function()
   {
      return _.sum(this.carry);
   }
};


// Runs all creeps in the game that belong to you.
mod.execute = function()
{
   let run = creep => creep.run(creep.GetRole()
      .name);
   _.forEach(Game.creeps, run);
};