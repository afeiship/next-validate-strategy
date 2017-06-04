# next-validate-strategy
> A validate strategy toolkit.


## usage:
```javascript
var formEls = document.forms[0].elements;
var els = nx.toArray(formEls);
var dataSource = {};

var btn = document.querySelector('button');

//inital:
updateDataSource();

function updateDataSource(){
  els.forEach(function(item){
    dataSource[item.id] = item.value;
  });
  return dataSource;
}


var MyValidator = {
  isNotSpecialPassword: function(inValue){
    return inValue.indexOf('@')===-1;
  }
};

var stategy = new nx.ValidateStrategy([nx.Validator,MyValidator]);

stategy.add('username',{
  validator:'isEmpty',
  data:null,
  msg:'用户名不能为空~'
});

stategy.add('password',{
  validator:'isEmpty',
  data:null,
  msg:'密码不能为空~'
});

stategy.addAll('password',[
  {
    validator:'!isInRange',
    data:{ start:3,end:6},
    msg:'密码区间为3-6'
  },
  {
    validator:'isNotSpecialPassword',
    msg:'密码中必须有@'
  }
]);


function validate(){
  //get latest dataSource:
  updateDataSource();

  //validate:
  stategy.validate(['username','password'],dataSource).then(function(success){
    console.log('success!');
  },function(errors){
    console.log('error!',errors[0]);
  });
}


//btn click OR on submit:
btn.onclick = function(){
  validate();
};




```


## resources:

## todos:
- [ ] todo list..
