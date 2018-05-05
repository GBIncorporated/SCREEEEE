let Role = function()
{
   Object.defineProperties(Role,
   {
      name:
      {
         value: "Unknown",
         writable: true
      },
      activityQueue:
      {
         value:
         {},
         writable: true
      },
   });

   Role.run = function(creep)
   {
      // No work in base class
   };

   // These can be base class maybe next acitivty might not be
   Role.nextTarget = function(creep, activity)
   {
      // No work in base class
   };

   Role.nextActivity = function(creep)
   {
      // No work in base class
   };
};

module.exports = Role;