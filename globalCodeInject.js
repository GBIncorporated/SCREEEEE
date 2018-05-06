// check if a path is valid
global.validatePath = path =>
{
   let mod;
   try
   {
      mod = require(path);
   }
   catch (e)
   {
      if (global.DEBUG !== false && !(e.message && e.message.startsWith('Unknown module')))
      {
         console.log('<font style="color:FireBrick">Error loading ' + path +
            ' caused by ' + (e.stack || e.toString()) + '</font>');
      }
      mod = null;
   }
   return mod != null;
};
// evaluate existing module overrides and store them to memory.
// return current module path to use for require
global.getPath = (modName, reevaluate = false) =>
{
   if (reevaluate || !Memory.modules[modName])
   {
      // find base file
      let path = './custom.' + modName;
      if (!validatePath(path))
      {
         path = './internal.' + modName;
         if (!validatePath(path))
            path = './' + modName;
      }
      Memory.modules[modName] = path;
      // find viral file
      path = './internalViral.' + modName;
      if (validatePath(path))
         Memory.modules.internalViral[modName] = true;
      else if (Memory.modules.internalViral[modName])
         delete Memory.modules.internalViral[modName];
      path = './viral.' + modName;
      if (validatePath(path))
         Memory.modules.viral[modName] = true;
      else if (Memory.modules.viral[modName])
         delete Memory.modules.viral[modName];
   }
   return Memory.modules[modName];
};

global.load = (modName) =>
{
   // read stored module path
   let path = getPath(modName);
   // try to load module
   let mod = tryRequire(path, true);
   return mod;
}

// inject members of alien class into base class. specify a namespace to call originals from baseObject.baseOf[namespace]['<functionName>'] later
global.inject = (base, alien, namespace) =>
{
   let keys = _.keys(alien);
   for (const key of keys)
   {
      if (typeof alien[key] === "function")
      {
         if (namespace)
         {
            let original = base[key];
            if (!base.baseOf) base.baseOf = {};
            if (!base.baseOf[namespace]) base.baseOf[namespace] = {};
            if (!base.baseOf[namespace][key]) base.baseOf[namespace][key] = original;
         }
         base[key] = alien[key].bind(base);
      }
      else
      {
         base[key] = alien[key]
      }
   }
};

// partially override a module using a registered viral file
global.infect = (mod, namespace, modName) =>
{
   if (Memory.modules[namespace][modName])
   {
      // get module from stored viral override path
      let viralOverride = tryRequire(`./${namespace}.${modName}`);
      // override
      if (viralOverride)
      {
         global.inject(mod, viralOverride, namespace);
      }
      // cleanup
      else delete Memory.modules[namespace][modName];
   }
   return mod;
};

// try to require a module. Log errors.
global.tryRequire = (path, silent = false) =>
{
   let mod;
   try
   {
      mod = require(path);
   }
   catch (e)
   {
      if (e.message && e.message.indexOf('Unknown module') > -1)
      {
         if (!silent) console.log(`Module "${path}" not found!`);
      }
      else if (mod == null)
      {
         console.log(`Error loading module "${path}"!<br/>${e.stack || e.toString()}`);
      }
      mod = null;
   }
   return mod;
};

// load code
global.install = () =>
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
   _.assign(global, load("constants"));
   Creep.Activity = load("creep.activity");
   Creep.Role = load("creep.role");
   // Load and assign modules to classes
   _.assign(Creep,
   {
      activity:
      {
         idle: load("creep.activity.idle"),
         harvest: load("creep.activity.harvest"),
         deposit: load("creep.activity.deposit")
      }
   });

   _.assign(Creep,
   {
      role:
      {
         bum: load("creep.role.bum"),
         miner: load("creep.role.miner")
      }
   });

   // inject overrides.
   global.inject(Room, load("room"));
   global.inject(StructureSpawn, load("spawn"));
   global.inject(Creep, load("creep"));
   global.inject(Source, load("source"));

   Creep.extend();
   Source.extend();
   Room.extend();
   StructureSpawn.extend();
}