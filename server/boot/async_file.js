'use strict';
//import the server for the models
module.exports = function(server) {
    
    var since = { push: -1, pull: -1 };    

    server.network = {
        _isConnected: true,
        get isConnected() {
          console.log('isConnected?', this._isConnected);
          return this._isConnected;
        },
        set isConnected(value) {
          this._isConnected = value;
        }
      };

    var Local = server.models.Testmodel;
    var Remote = server.models.Testmodelremote;

    function sync() {
      //create a sync function for each model and call in the observe method
      // It is important to push local changes first,
      // that way any conflicts are resolved at the client
      Local.replicate(
        since.push,
        Remote,
        function pushed(err, conflicts, cps) {
          // Test: handle err
          
          if (conflicts) 
          {
            handleConflicts(conflicts);
            console.log(conflicts);
            
          }
        //console.log(cps);
          since.push = cps;
          Remote.replicate(
            since.pull,
            Local,
            function pulled(err, conflicts, cps) {
              // Test: handle err
              if (conflicts){
                handleConflicts(conflicts.map(function(c) { return c.swapParties(); }));
              }
              //console.log(cps);
              since.pull = cps;
            });
        });
    }
    // observe method
    Local.observe('after save', function(ctx, next) {
      next();
      sync(); // sync function  in background
    });
    // observe method
    Local.observe('after delete', function(ctx, next) {
      next();
      sync(); // sync function  in background
    });
    
    function handleConflicts(conflicts) {
      // test notify user about the 
      //console.log(conflicts);
    }
  };
  
