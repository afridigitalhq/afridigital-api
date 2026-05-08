const subs=[];

function subscribe(fn){subs.push(fn);}

function publish(event){
subs.forEach(fn=>fn(event));
}

module.exports={subscribe,publish};