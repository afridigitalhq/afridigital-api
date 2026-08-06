import CoreIntakeEngine from "../../../../core/intake/CoreIntakeEngine.js";
import CoreRepositoryIntake from "../../../../core/intake/CoreRepositoryIntake.js";
import CoreLogCollector from "../../../../core/intake/CoreLogCollector.js";

const AfriDebugIntakeAdapter={
 collect(input){
  return CoreIntakeEngine.collect(input);
 },
 repository(repository){
  return CoreRepositoryIntake.scan(repository);
 },
 logs(source){
  return CoreLogCollector.collect(source);
 }
};

export default AfriDebugIntakeAdapter;
