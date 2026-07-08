export class EvidenceExportGateway{

 export(request){

  return {
   format:request.format,
   owner:request.owner,
   status:"AUTHORIZED_EXPORT"
  };

 }

}

export const evidenceExportGateway =
new EvidenceExportGateway();
