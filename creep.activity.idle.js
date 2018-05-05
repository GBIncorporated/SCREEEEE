let activity = new Creep.Activity();
module.exports = activity;

activity.name = "idle";
activity.renewTarget = false;
activity.maxPerTarget = 6;
activity.targetRange = 1;

// Esnures this activity is valid.
activity.isValidActivity = function(creep)
{
   return true
};

activity.isValidTarget = function(target)
{
   return true;
};

// picks a new target suitable for this activity
activity.newTarget = function(creep)
{
   // Have the bum wonder around following other screeps
   let target = null;

   var creeps = creep.room.find(FIND_CREEPS);

   if (creeps.length > 0)
   {
      // order them to distance from this creep
      creeps.sort((c) => creep.pos.getRangeTo(creeps));
      target = creeps[0];
   }
   // move to that creep
   return target;
};

// order for the creep to execute each tick, when assigned to that action
activity.step = function(creep)
{
   creep.say("Im idle!");
   let error = creep.Drive(creep.GetTarget()
      .pos);
};

// Runs this activity.
activity.work = function(creep)
{
   // Just return ok maybe we need to do something
   // like move off of crowded spots.
   return OK;
};