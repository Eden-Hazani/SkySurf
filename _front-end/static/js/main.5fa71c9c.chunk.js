(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{102:function(e,t,a){},103:function(e,t,a){},104:function(e,t,a){},105:function(e,t,a){},106:function(e,t,a){},107:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a.n(r),s=a(8),o=a.n(s);a(76),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var i=a(17),c=a.n(i),u=a(26),l=a(12),m=a(13),h=a(16),d=a(15),p=(a(78),a(25)),f=a(10),v=(a(79),function e(t,a,r,n,s){Object(l.a)(this,e),this.userId=t,this.userName=a,this.passWord=r,this.isAdmin=n,this.followsVacations=s}),g=a(133),b=a(140),E=a(136),y=a(137),j=a(27),x=a.n(j),w=function(){function e(){Object(l.a)(this,e)}return Object(m.a)(e,null,[{key:"_initialize",value:function(){e.serverUrl="https://skysurf.herokuapp.com/api"}}]),e}();w.serverUrl=void 0,w._initialize();var O=function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(l.a)(this,a),(r=t.call(this,e)).getVacations=Object(u.a)(c.a.mark((function e(){var t,a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=w.serverUrl,e.next=4,x.a.get("".concat(t,"/vacations/getVacations"));case 4:a=e.sent,n=a.data,console.log(a),r.setState({vacations:n}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[0,10]])}))),r.state={userInfo:new v,vacations:[],enableText:!1},r}return Object(m.a)(a,[{key:"componentDidMount",value:function(){var e=Object(u.a)(c.a.mark((function e(){var t,a=this;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return setTimeout((function(){a.setState({enableText:!0})}),2e3),e.next=3,this.props.isUserLogged();case 3:t=e.sent,this.getVacations(),this.setState({userInfo:t});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;return!1===this.state.userInfo?n.a.createElement(f.a,{to:"/"}):this.state.enableText?n.a.createElement(g.a,{container:!0},n.a.createElement(b.a,{mb:2},n.a.createElement(g.a,{container:!0,alignItems:"flex-start",justify:"flex-start",direction:"row"},n.a.createElement(E.a,{component:"h1",variant:"h6"},"Welcome - ","".concat(this.state.userInfo.userName)))),n.a.createElement(g.a,{container:!0,alignItems:"flex-start",justify:"flex-start",direction:"row",style:{minHeight:"50vh"}},n.a.createElement(E.a,{component:"h1",variant:"h4"},"Vacations You Follow!"),n.a.createElement(g.a,{container:!0,style:{overflowX:"auto",minHeight:"40vh"}},""===this.state.userInfo.followsVacations?n.a.createElement(b.a,{mt:4},n.a.createElement("div",null,"You Don't Seem to follow any Vacations yet, Feel free to pick some!")):this.state.userInfo.followsVacations.split(",").map((function(t){return e.state.vacations.filter((function(e){return e.vacationId===+t})).map((function(e){return n.a.createElement(g.a,{container:!0,xs:10,sm:4,justify:"center",className:"vacationContainer"},n.a.createElement(y.a,{className:"vacationContainerBackground",style:{background:' linear-gradient(0deg, rgba(216, 95, 166, 0.541), rgba(255, 189, 103, 0.438)), url("'.concat(w.serverUrl,"/uploads/").concat(e.vacationImg,'")')}},n.a.createElement(b.a,{ml:2},n.a.createElement(g.a,{container:!0,direction:"row",justify:"flex-start",alignItems:"flex-start"},n.a.createElement(E.a,{gutterBottom:!0,variant:"subtitle1"},e.destination))),n.a.createElement(g.a,{container:!0,direction:"row",justify:"center",alignItems:"center"},n.a.createElement(E.a,{gutterBottom:!0,variant:"subtitle1"},e.description)),n.a.createElement(g.a,{container:!0,direction:"row",justify:"center",alignItems:"center"},n.a.createElement(E.a,{gutterBottom:!0,variant:"subtitle1"},"Dates - ",e.vacationDates)),n.a.createElement(g.a,{container:!0,direction:"row",justify:"center",alignItems:"flex-end"},n.a.createElement(E.a,{gutterBottom:!0,variant:"subtitle1"},"Now for Just - ",e.price," $ per Person!"))))}))}))))):null}}]),a}(r.Component),k=a(31),N=a(138),W=a(141),I=(a(102),a(33)),U=a.n(I),S=function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(l.a)(this,a),(r=t.call(this,e)).setUserName=function(e){var t=e.target.value,a=Object(k.a)({},r.state.users);a.userName=t,r.setState({users:a})},r.setPassWord=function(e){var t=e.target.value,a=Object(k.a)({},r.state.users);a.passWord=t,r.setState({users:a})},r.logIn=Object(u.a)(c.a.mark((function e(){var t,a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=w.serverUrl,e.next=4,x.a.post("".concat(t,"/login"),r.state.users);case 4:a=e.sent,n=a.data,U.a.fire({title:"Success!",text:"Welcome ".concat(n.userName," Press Below To enter the site!"),icon:"success",confirmButtonText:"O.K"}),r.props.history.push("/home"),e.next=15;break;case 10:if(e.prev=10,e.t0=e.catch(0),401!==e.t0.response.status){e.next=15;break}return U.a.fire({title:"Error!",text:"Wrong Username Or Password",icon:"error",confirmButtonText:"O.K"}),e.abrupt("return");case 15:case"end":return e.stop()}}),e,null,[[0,10]])}))),r.state={users:new v},r}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return n.a.createElement(g.a,{container:!0,direction:"column",alignItems:"center",justify:"center",style:{minHeight:"85vh"}},n.a.createElement(b.a,{m:2},n.a.createElement(E.a,{component:"h1",variant:"h4"},"Login!")),n.a.createElement("form",{className:"logInForm",onSubmit:function(t){return t.preventDefault(),e.logIn()}},n.a.createElement(g.a,{container:!0,direction:"row",spacing:5},n.a.createElement(g.a,{item:!0,xs:12,sm:6},n.a.createElement(N.a,{onChange:this.setUserName,autoComplete:"userName",value:this.state.users.userName||"",error:""===this.state.users.userName,helperText:""===this.state.users.userName?"Empty field!":" ",name:"firstName",variant:"outlined",fullWidth:!0,id:"userName",label:"User Name",autoFocus:!0,required:!0})),n.a.createElement(g.a,{item:!0,xs:12,sm:6},n.a.createElement(N.a,{onChange:this.setPassWord,autoComplete:"passWord",value:this.state.users.passWord||"",error:""===this.state.users.passWord,helperText:""===this.state.users.passWord?"Empty field!":" ",name:"passWord",variant:"outlined",fullWidth:!0,id:"passWord",label:"Password",required:!0})),n.a.createElement(g.a,{container:!0,justify:"center"},n.a.createElement(W.a,{variant:"contained",color:"primary",type:"submit"},"Log In!")))),n.a.createElement(b.a,{m:10},n.a.createElement(g.a,{container:!0,justify:"center"},n.a.createElement(W.a,{color:"default",to:"/register",component:p.b,size:"large",style:{border:"1px solid black"}},"New To Our Site? Press here to join and find your destination today!"))))}}]),a}(r.Component),C=(a(103),function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(l.a)(this,a),(r=t.call(this,e)).setUserName=function(e){var t=e.target.value,a="",n=Object(k.a)({},r.state.users),s=Object(k.a)({},r.state.errors);""===t&&(a="*"),t.length<3&&(a="*"),n.userName=t,s.usernameError=a,r.setState({users:n,errors:s})},r.setPassWord=function(e){var t=e.target.value,a="",n=Object(k.a)({},r.state.users),s=Object(k.a)({},r.state.errors);""===t&&(a="*"),t===r.state.users.userName&&(a="*"),t.length<5&&(a="*"),s.passwordError=a,n.passWord=t,r.setState({users:n,errors:s})},r.isLegal=function(){return""===r.state.errors.usernameError&&""===r.state.errors.passwordError},r.signUp=Object(u.a)(c.a.mark((function e(){var t,a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,r.isLegal()){e.next=4;break}return U.a.fire({title:"Error!",text:"Please fix the form Errors!",icon:"error",confirmButtonText:"O.K"}),e.abrupt("return");case 4:return t=w.serverUrl,e.next=7,x.a.post("".concat(t,"/register"),r.state.users);case 7:a=e.sent,n=a.data,U.a.fire({title:"Success!",text:"Welcome ".concat(n.userName," Press Below To enter the site!"),icon:"success",confirmButtonText:"O.K"}),r.props.history.push("/home"),e.next=18;break;case 13:if(e.prev=13,e.t0=e.catch(0),401!==e.t0.response.status){e.next=18;break}return U.a.fire({title:"Error!",text:"Seems Like That Name is already taken :( \n                            Try Another One!",icon:"error",confirmButtonText:"O.K"}),e.abrupt("return");case 18:case"end":return e.stop()}}),e,null,[[0,13]])}))),r.state={users:new v,errors:{usernameError:"*",passwordError:"*"}},r}return Object(m.a)(a,[{key:"render",value:function(){var e,t,a,r,s,o,i,c=this;return n.a.createElement(g.a,{container:!0,direction:"column",alignItems:"center",justify:"center",style:{minHeight:"85vh"}},n.a.createElement(b.a,{m:2},n.a.createElement(E.a,{component:"h1",variant:"h4"},"Sign Up!")),n.a.createElement("form",{className:"signUpForm",onSubmit:function(e){return e.preventDefault(),c.signUp()}},n.a.createElement(g.a,{container:!0,direction:"row",spacing:5},n.a.createElement(g.a,{item:!0,xs:12,sm:6},n.a.createElement(N.a,{onChange:this.setUserName,autoComplete:"userName",value:this.state.users.userName||"",error:(null===(e=this.state.users.userName)||void 0===e?void 0:e.length)<3,helperText:[""===this.state.users.userName?"Empty field!":" ",(null===(t=this.state.users.userName)||void 0===t?void 0:t.length)<3&&(null===(a=this.state.users.userName)||void 0===a?void 0:a.length)>0?"Username cannot be under 3 characters":" "],name:"firstName",variant:"outlined",fullWidth:!0,id:"userName",label:"User Name",autoFocus:!0,required:!0})),n.a.createElement(g.a,{item:!0,xs:12,sm:6},n.a.createElement(N.a,{onChange:this.setPassWord,autoComplete:"passWord",value:this.state.users.passWord||"",error:this.state.users.userName===this.state.users.passWord&&(null===(r=this.state.users.passWord)||void 0===r?void 0:r.length)>0||""===this.state.users.passWord||(null===(s=this.state.users.passWord)||void 0===s?void 0:s.length)<5,helperText:[this.state.users.userName===this.state.users.passWord&&(null===(o=this.state.users.passWord)||void 0===o?void 0:o.length)>0?"Username cannot be the same as password!":"",""===this.state.users.passWord?"Empty field!":" ",(null===(i=this.state.users.passWord)||void 0===i?void 0:i.length)<5?"Password must be above 5 characters":""],name:"passWord",variant:"outlined",fullWidth:!0,id:"passWord",label:"Password",required:!0})),n.a.createElement(g.a,{container:!0,justify:"center"},n.a.createElement(W.a,{variant:"contained",color:"primary",type:"submit"},"Sign Up!")))),n.a.createElement(b.a,{m:10},n.a.createElement(g.a,{container:!0,justify:"center"},n.a.createElement(W.a,{color:"default",to:"/login",component:p.b,size:"large",style:{border:"1px solid black"}},"Already A user? - Click Here To LogIn!"))))}}]),a}(r.Component)),T=(a(104),function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"menu"})}}]),a}(r.Component)),B=(a(105),function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"createVacation"})}}]),a}(r.Component)),L=(a(106),function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return n.a.createElement(g.a,{container:!0,direction:"column",alignItems:"center",justify:"center",style:{minHeight:"90vh"}},n.a.createElement(E.a,{component:"h1",variant:"h3",style:{color:"white",textShadow:"1px 2px 1px black"}},"Oops... It seems Like you reached Somewhere no plane can Go :("),n.a.createElement(b.a,{m:10},n.a.createElement(g.a,{container:!0,justify:"center"},n.a.createElement(W.a,{color:"default",to:"/register",component:p.b,size:"large"},"Already A user? - Click Here To LogIn!"))))}}]),a}(r.Component));x.a.defaults.withCredentials=!0;var P=function(e){Object(h.a)(a,e);var t=Object(d.a)(a);function a(e){var r;return Object(l.a)(this,a),(r=t.call(this,e)).userLogged=Object(u.a)(c.a.mark((function e(){var t,a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=w.serverUrl,e.next=4,x.a.get("".concat(t,"/userLogged"));case 4:return a=e.sent,e.abrupt("return",a.data);case 8:if(e.prev=8,e.t0=e.catch(0),401!==e.t0.response.status){e.next=12;break}return e.abrupt("return",!1);case 12:case"end":return e.stop()}}),e,null,[[0,8]])}))),r.state={},r}return Object(m.a)(a,[{key:"render",value:function(){var e=this;return n.a.createElement(g.a,{container:!0,direction:"column",alignItems:"center",style:{minHeight:"100vh"}},n.a.createElement(p.a,null,n.a.createElement("header",{className:"header"},n.a.createElement(g.a,{container:!0,alignItems:"center",direction:"column",style:{minHeight:"20vh"}},n.a.createElement(E.a,{component:"h1",variant:"h2"},"SkySurf"),n.a.createElement(E.a,{component:"h1",variant:"h6"},"- Your Indulgent vacation is a few clicks away... -"))),n.a.createElement("aside",null,n.a.createElement(T,null)),n.a.createElement("main",null,n.a.createElement(f.d,null,n.a.createElement(f.b,{path:"/home",render:function(t){return n.a.createElement(O,Object.assign({},t,{isUserLogged:e.userLogged}))},exact:!0}),n.a.createElement(f.b,{path:"/register",component:C}),n.a.createElement(f.b,{path:"/login",component:S}),n.a.createElement(f.b,{path:"/createVacation",component:B}),n.a.createElement(f.a,{from:"/",to:"/register",exact:!0}),n.a.createElement(f.b,{component:L}))),n.a.createElement("footer",null)))}}]),a}(r.Component);o.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},71:function(e,t,a){e.exports=a(107)},76:function(e,t,a){},78:function(e,t,a){},79:function(e,t,a){}},[[71,1,2]]]);
//# sourceMappingURL=main.5fa71c9c.chunk.js.map