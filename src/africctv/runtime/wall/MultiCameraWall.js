export class MultiCameraWall{
  constructor(){
    this.grid=new Map();
  }

  add(camera){
    this.grid.set(camera.id,{
      cameraId:camera.id,
      slot:this.grid.size+1,
      status:"LIVE"
    });
  }

  remove(id){
    this.grid.delete(id);
  }

  view(){
    return [...this.grid.values()];
  }

  rotate(){
    const cameras=[...this.grid.values()];

    if(cameras.length < 2) return cameras;

    const first=cameras.shift();
    cameras.push(first);

    this.grid.clear();

    cameras.forEach((camera,index)=>{
      camera.slot=index+1;
      this.grid.set(camera.cameraId,camera);
    });

    return cameras;
  }
}

export const cameraWall=new MultiCameraWall();

cameraWall.add({id:"cam01"});
cameraWall.add({id:"cam02"});
cameraWall.add({id:"cam03"});
