const AfriDebugCSVEvidenceExporter={

  export(evidence={}){

    const headers=[
      "Evidence ID",
      "Incident ID",
      "Connector",
      "Repository",
      "Component",
      "Issue",
      "Severity",
      "Risk",
      "Integrity Hash",
      "Created At"
    ];

    const values=[
      evidence.evidenceId||"",
      evidence.incidentId||"",
      evidence.connector||"",
      evidence.repository||"",
      evidence.component||"",
      evidence.issue||"",
      evidence.severity||"",
      evidence.risk||"",
      evidence.integrityHash||"",
      evidence.createdAt||""
    ];

    return{
      exportId:"CSV-"+Date.now(),
      format:"csv",
      fileName:`${evidence.evidenceId||"evidence"}.csv`,
      content:headers.join(",")+"\n"+values.join(","),
      exportedAt:Date.now()
    };

  },

  health(){

    return{
      service:"AfriDebugCSVEvidenceExporter",
      status:"healthy"
    };

  }

};

export default AfriDebugCSVEvidenceExporter;
