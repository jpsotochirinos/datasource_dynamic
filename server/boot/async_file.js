'use strict';


module.exports = function(server) {
    //var app = require('../../server/server');
    

    var since = { push: -1, pull: -1 };
    
    // var LocalProduct = server.models.Product;
    // var RemoteProduct = server.models.productremote;
    
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
    
    var LocalUnity = server.models.Testmodel;
    var RemoteUnity = server.models.Testmodelremote;

    function sync() {
        
      // It is important to push local changes first,
      // that way any conflicts are resolved at the client
      LocalUnity.replicate(
        since.push,
        RemoteUnity,
        function pushed(err, conflicts, cps) {
          // TODO: handle err
          
          if (conflicts) 
          {
            handleConflicts(conflicts);
            //console.log(conflicts);
            
          }
        //console.log(cps);
        
  
          since.push = cps;
  
          RemoteUnity.replicate(
            since.pull,
            LocalUnity,
            function pulled(err, conflicts, cps) {
              // TODO: handle err
              if (conflicts){
                handleConflicts(conflicts.map(function(c) { return c.swapParties(); }));
              }
              console.log(cps);
              since.pull = cps;
            });
        });
    }
  
    LocalUnity.observe('after save', function(ctx, next) {
      next();
      sync(); // in background
    });
  
    LocalUnity.observe('after delete', function(ctx, next) {
      next();
      sync(); // in background
    });
    server.sync = sync;
    function handleConflicts(conflicts) {
      // TODO notify user about the 
      //console.log(conflicts);
      
    }
  };
  