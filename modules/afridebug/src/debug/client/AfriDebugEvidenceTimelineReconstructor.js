const Timeline={

build(events=[]){

const timeline=[...events].sort((a,b)=>a.timestamp-b.timestamp);

return{
timelineId:"TIMELINE-"+Date.now(),
events:timeline,
totalEvents:timeline.length,
generatedAt:Date.now(),
generatedAtISO:new Date().toISOString()
};

},

health(){

return{
service:"AfriDebugEvidenceTimelineReconstructor",
status:"healthy"
};

}

};

export default Timeline;
