(function () {

  var global = global || this;

  var nx = global.nx || require('next-js-core2');
  var NxValidator = nx.Validator || require('next-validator');
  var Q = global.Q || require('q');

  var ValidateStrategy = nx.declare('nx.ValidateStrategy', {
    methods:{
      init: function(inValidators){
        this._validators = inValidators || [ NxValidator ];
        this._cache = {};
      },
      destroy: function(){
        this._validators = null;
        this._cache = null;
      },
      addAll: function(inKey,inStrategies){
        var cache = this._cache[inKey] = this._cache[inKey] || [];
        this._cache[inKey] = cache.concat(inStrategies);
      },
      add: function(inKey,inStrategy){
        var cache = this._cache[inKey] = this._cache[inKey] || [];
        cache.push(inStrategy);
        this._cache[inKey] = cache;
      },
      validate: function(inKeys,inDataSource){
        var self = this;
        var errors = [];
        return Q.Promise(function(resolve,reject){
          nx.each(inKeys,function(_,item){
            var validateStrategies = this._cache[item];
            nx.each( validateStrategies ,function( _, strategy ){
              var validator = this.getValidator(strategy.validator);
              var isEqualCondition = validator.call(null, inDataSource[item], strategy.data);
              if(strategy.invert){
                if(!isEqualCondition){
                  errors.push(strategy);
                }
              }else{
                if(isEqualCondition){
                  errors.push(strategy);
                }
              }
            },this);
          },self);
          return !!errors.length ? reject(errors) : resolve(true);
        });
      },
      getValidator:function(inName){
        var validators = this._validators;
        var validator = null;
        nx.each(this._validators,function( _ ,_validator){
          if(nx.isFunction(_validator[inName])){
            validator = _validator[inName];
            return nx.BREAKER;
          }
        });
        return validator ? validator : nx.error('Invalid validtor: ['+ inName +']');
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ValidateStrategy;
  }

}());
