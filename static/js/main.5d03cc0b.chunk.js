(this["webpackJsonpgraph-sketch"]=this["webpackJsonpgraph-sketch"]||[]).push([[0],{38:function(t,a,e){},39:function(t,a,e){},85:function(t,a,e){"use strict";e.r(a);var s=e(6),r=e(7),n=e.n(r),i=e(30),h=e.n(i),o=(e(38),e.p,e(39),e(19)),d=e(18),c=e(31),l=e(33),u=e(32),g=e(12),M=e.n(g),f=e(8),p=1,v=1,j=function(t){return{id:p,x:t.x,y:t.y,width:40,height:40}},b=n.a.createRef(),P=function(t){Object(l.a)(e,t);var a=Object(u.a)(e);function e(){var t;Object(c.a)(this,e);for(var r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return(t=a.call.apply(a,[this].concat(n))).state={isBipartite:!0,canvas:[],lines:[],adjList:{},edgenodestart:[null,null,null]},t.handleClick=function(a){if(a.target===a.target.getStage()){var e=a.target.getStage().getPointerPosition();t.setState((function(t){return{canvas:[].concat(Object(d.a)(t.canvas),[Object(o.a)({},j(e))])}})),p+=1}},t.handleDragStart=function(t){t.target.to({shadowOffsetX:0,shadowOffsetY:0,shadowBlur:10,shadowColor:"black",scaleX:1.15,scaleY:1.15})},t.handleDragEnd=function(t){t.target.to({duration:.5,easing:M.a.Easings.ElasticEaseOut,scaleX:1,scaleY:1,shadowBlur:0})},t.addEdge=function(a){if(null==t.state.edgenodestart[0])t.setState({edgenodestart:[a.target.attrs.id,a.target.attrs.x,a.target.attrs.y]});else{var e=0,s=t.state.edgenodestart[0],r=t.state.edgenodestart[1],n=t.state.edgenodestart[2],i=a.target.attrs.id,h=a.target.attrs.x,c=a.target.attrs.y,l=b.current.find("#line"),u=0,g=0;for(g=0;g<l.length;g+=1)(l[g].attrs.startid===s&&l[g].attrs.endid===i||l[g].attrs.startid===i&&l[g].attrs.endid===s)&&(e=1,u+=1,g);var M,f=20;e=0;r>=h&&(e=1);var p=r-h,j=n-c;M=Math.atan2(-j,p),1===u?1!=e?(r+=.5*Math.cos(M+Math.PI-1)*-20,n+=f*(.5*Math.sin(M+Math.PI-1)),h+=.5*Math.cos(M+1)*-20,c+=f*(.5*Math.sin(M+1))):(r+=.5*Math.cos(M+Math.PI+1)*-20,n+=f*(.5*Math.sin(M+Math.PI+1)),h+=.5*Math.cos(M-1)*-20,c+=f*(.5*Math.sin(M-1))):2===u&&(1!=e?(r+=.5*Math.cos(M+Math.PI+1)*-20,n+=f*(.5*Math.sin(M+Math.PI+1)),h+=.5*Math.cos(M-1)*-20,c+=f*(.5*Math.sin(M-1))):(r+=.5*Math.cos(M+Math.PI-1)*-20,n+=f*(.5*Math.sin(M+Math.PI-1)),h+=.5*Math.cos(M+1)*-20,c+=f*(.5*Math.sin(M+1))));var P=!1;u>0&&(P=!0);var I={id:v,startid:s,endid:i,points:[r,n,h,c],isgrouped:P,groupnumber:u+1};t.setState((function(t){return{lines:[].concat(Object(d.a)(t.lines),[Object(o.a)({},I)])}})),t.setState({edgenodestart:[null,null,null]}),v+=1,t.genAdjlist(v,!0)}},t.updateLine=function(t){for(var a=t.target.attrs.id,e=b.current,s=e.find("#line"),r=0;r<s.length;r+=1){if(s[r].attrs.startid===a){var n=e.findOne("#"+s[r].attrs.startid),i=e.findOne("#"+s[r].attrs.endid),h=0,o=n.attrs.x,d=n.attrs.y;o>=(M=i.attrs.x)&&(h=1);var c=20,l=o-M,u=d-(f=i.attrs.y),g=Math.atan2(-u,l);if(s[r].attrs.groupnumber%3===1||!1===s[r].attrs.isgrouped)(I=s[r].attrs.points)[0]=t.target.attrs.x,I[1]=t.target.attrs.y,s[r].attrs.points=I;else if(s[r].attrs.groupnumber%3===2){1!=h?(o+=.5*Math.cos(g+Math.PI-1)*-20,d+=c*(.5*Math.sin(g+Math.PI-1)),M+=.5*Math.cos(g+1)*-20,f+=c*(.5*Math.sin(g+1))):(o+=.5*Math.cos(g+Math.PI+1)*-20,d+=c*(.5*Math.sin(g+Math.PI+1)),M+=.5*Math.cos(g-1)*-20,f+=c*(.5*Math.sin(g-1))),(I=s[r].attrs.points)[0]=o,I[1]=d,I[2]=M,I[3]=f,s[r].attrs.points=I}else if(s[r].attrs.groupnumber%3===0){1!=h?(o+=.5*Math.cos(g+Math.PI+1)*-20,d+=c*(.5*Math.sin(g+Math.PI+1)),M+=.5*Math.cos(g-1)*-20,f+=c*(.5*Math.sin(g-1))):(o+=.5*Math.cos(g+Math.PI-1)*-20,d+=c*(.5*Math.sin(g+Math.PI-1)),M+=.5*Math.cos(g+1)*-20,f+=c*(.5*Math.sin(g+1))),(I=s[r].attrs.points)[0]=o,I[1]=d,I[2]=M,I[3]=f,s[r].attrs.points=I}}if(s[r].attrs.endid===a){n=e.findOne("#"+s[r].attrs.startid),i=e.findOne("#"+s[r].attrs.endid),o=n.attrs.x,d=n.attrs.y;var M=i.attrs.x,f=i.attrs.y,p=20;h=0,o=n.attrs.x,d=n.attrs.y;o>=(M=i.attrs.x)&&(h=1);var v=o-M,j=d-(f=i.attrs.y),P=Math.atan2(-j,v);if(s[r].attrs.groupnumber%3===1||!1===s[r].attrs.isgrouped)(I=s[r].attrs.points)[2]=t.target.attrs.x,I[3]=t.target.attrs.y,s[r].attrs.points=I;else if(s[r].attrs.groupnumber%3===2){1!=h?(o+=.5*Math.cos(P+Math.PI-1)*-20,d+=p*(.5*Math.sin(P+Math.PI-1)),M+=.5*Math.cos(P+1)*-20,f+=p*(.5*Math.sin(P+1))):(o+=.5*Math.cos(P+Math.PI+1)*-20,d+=p*(.5*Math.sin(P+Math.PI+1)),M+=.5*Math.cos(P-1)*-20,f+=p*(.5*Math.sin(P-1))),(I=s[r].attrs.points)[0]=o,I[1]=d,I[2]=M,I[3]=f,s[r].attrs.points=I}else if(s[r].attrs.groupnumber%3===0){var I;1!=h?(o+=.5*Math.cos(P+Math.PI+1)*-20,d+=p*(.5*Math.sin(P+Math.PI+1)),M+=.5*Math.cos(P-1)*-20,f+=p*(.5*Math.sin(P-1))):(o+=.5*Math.cos(P+Math.PI-1)*-20,d+=p*(.5*Math.sin(P+Math.PI-1)),M+=.5*Math.cos(P+1)*-20,f+=p*(.5*Math.sin(P+1))),(I=s[r].attrs.points)[0]=o,I[1]=d,I[2]=M,I[3]=f,s[r].attrs.points=I}}}},t.genAdjlist=function(a,e){for(var s=b.current.find("#line"),r={},n=0;n<s.length;n+=1){if(!0===e)var i=[s[n].attrs.startid,s[n].attrs.endid].sort();else i=[s[n].attrs.startid,s[n].attrs.endid];if(null!=r[i[0]]){var h=r[i[0]];null!=h[i[1]]?h[i[1]]+=1:(h[i[1]]=1,r[i[0]]=h)}else{var o={};o[i[1]]=1,r[i[0]]=o}}t.setState({adjList:r},(function(){return t.isBipartite()}))},t.isBipartite=function(){var a=!0;if(0===t.state.lines.length);else{var e={};for(var s in t.state.adjList)if(s in e===!1){var r=[];for(r.push([s,!1]),e[s]=!1;r.length>0;){var n=r.shift();for(var i in t.state.adjList[n[0]]){if(i in e===!0&&e[i]===n[1]){a=!1;break}e[i]=!n[1],r.push([i,!n[1]])}for(var h in t.state.adjList)n[0]in t.state.adjList[h]===!0&&h in e!=1&&(e[h]=!n[1],r.push([h,!n[1]]))}}}t.setState({isBipartite:a})},t.render=function(){return Object(s.jsxs)("div",{children:[t.state.isBipartite?Object(s.jsx)("p",{children:"Bipartite: True"}):Object(s.jsx)("p",{children:"Bipartite: False"}),Object(s.jsx)(f.Stage,{width:window.innerWidth,height:window.innerHeight,onClick:t.handleClick,ref:b,children:Object(s.jsxs)(f.Layer,{children:[t.state.lines.map((function(t,a){var e=t.points,r=t.startid,n=t.endid,i=t.isgrouped,h=t.groupnumber;return Object(s.jsx)(f.Line,{id:"line",startid:r,endid:n,points:e,stroke:"black",strokeWidth:3,isgrouped:i,groupnumber:h},a)})),t.state.canvas.map((function(a,e){var r=a.height,n=a.width,i=a.x,h=a.y,o=a.id;return Object(s.jsx)(f.Circle,{id:o.toString(),x:i,y:h,width:n,height:r,stroke:"black",strokeWidth:3,draggable:"true",fill:"white",onDragStart:t.handleDragStart,onDragMove:t.updateLine,onDragEnd:t.handleDragEnd,onClick:t.addEdge},e)}))]})})]})},t}return e}(r.Component);var I=function(){return Object(s.jsx)("div",{className:"App",children:Object(s.jsx)(P,{})})},x=function(t){t&&t instanceof Function&&e.e(3).then(e.bind(null,86)).then((function(a){var e=a.getCLS,s=a.getFID,r=a.getFCP,n=a.getLCP,i=a.getTTFB;e(t),s(t),r(t),n(t),i(t)}))};h.a.render(Object(s.jsx)(n.a.StrictMode,{children:Object(s.jsx)(I,{})}),document.getElementById("root")),x()}},[[85,1,2]]]);
//# sourceMappingURL=main.5d03cc0b.chunk.js.map