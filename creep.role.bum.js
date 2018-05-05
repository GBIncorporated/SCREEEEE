let role = new Creep.Role();
module.exports = role;
role.name = "bum";
role.activityQueue = [Creep.activity.idle];

role.run = function(creep)
{
   let target;
   let activity = creep.GetActivity();
   // Set new activity
   if (activity == null || activity == undefined || activity.name == 'idle' || !activity.isValidActivity(creep))
   {
      activity = this.nextActivity(creep);
      if (activity == null)
      {
         console.log("Null activity");
      }
      creep.SetActivity(activity);
   }

   if (activity == null || activity == undefined)
   {
      // fail fast cause we have no activity do the idle activity that has no target and never get null activity
      return;
   }
   // activity set now check target to see if we need a new one
   target = this.nextTarget(creep, activity);

   if (target != null)
   {
      creep.SetTarget(target);
   }

   if (activity && target)
   {
      activity.step(creep);
   }
   else
   {
      console.log('Creep without Activity or Target!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.GetData()));
   }
};

// These can be base class maybe next acitivty might not be
role.nextTarget = function(creep, activity)
{
   // get the original target and see if its still valid
   let target = creep.GetTarget();
   if (target === null || target === undefined || !activity.isValidTarget(target))
   {
      target = activity.newTarget(creep);
   }
   return target;
};

role.nextActivity = function(creep)
{
   let role = creep.GetRole();
   for (var iActivity = 0; iActivity < role.activityQueue.length; iActivity++)
   {
      var activity = Creep.activity[role.activityQueue[iActivity].name];

      const validActivity = activity.isValidActivity(creep);
      if (!validActivity)
      {
         return null;
      }
      // have a valid activity for this creep check get next target
      return activity;
   }
};