let Activity = function()
{
   Object.defineProperties(Activity,
   {
      name:
      {
         value: "Unknown",
         writable: true
      },
      renewTarget:
      {
         value: "Unknown",
         writable: true
      },
      maxPerTarget:
      {
         value: "Unknown",
         writable: true
      },
      targetRange:
      {
         value: "Unknown",
         writable: true
      }
   });

   // Esnures this activity is valid.
   Activity.isValidActivity = function(creep)
   {
      // no work in base class.
   };

   Activity.isValidTarget = function(target)
   {
      // no work in base class.
   };

   // picks a new target suitable for this activity
   Activity.newTarget = function(creep)
   {
      // no work in base class.
   }

   // Runs this activity.
   Activity.work = function(creep)
   {
      // no work in base class.
   };

   // order for the creep to execute each tick, when assigned to that action
   Activity.step = function(creep)
   {
      // no work in base class
   };
};

module.exports = Activity;