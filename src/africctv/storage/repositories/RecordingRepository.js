export class RecordingRepository {

  constructor(){
    this.records=[];
  }

  save(record){
    this.records.push(record);
    return record;
  }

  findAll(){
    return this.records;
  }

  findByCamera(cameraId){
    return this.records.filter(
      r=>r.cameraId===cameraId
    );
  }

}

export const recordingRepository =
new RecordingRepository();

console.log("💾 Recording Repository READY");
