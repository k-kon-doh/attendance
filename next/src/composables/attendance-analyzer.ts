import { ReadonlyAttendance } from "@/api/attendance";
import Config from "@/app.config";
import { ReadonlyCurrentEmployeeState } from "@/composables/authenticate";
import { analyze as analyzeFeature, FeatureState } from "@/composables/feature";

const failResult = {
  isMine: false,
  isMyRepresentative: false,
  readonly: true,
  editable: false,
  approvable: false,
  approved: false,
} as const;

/** 勤怠情報解析 */
export function analyze(attendance: ReadonlyAttendance | undefined, feature: FeatureState, currentEmployee: ReadonlyCurrentEmployeeState) {
  if (!attendance || !currentEmployee.isLogin) {
    return failResult;
  }
  const featureSpec = analyzeFeature(feature);
  const choiceIds = attendance.applicants.filter((it) => it.choice && !!it.choiceId).map((it) => it.choiceId);

  const isMine = !attendance.agent.choiceId && choiceIds.length === 1 && choiceIds[0] === currentEmployee.choiceId;
  const isMyRepresentative = !!attendance.agent.choiceId && attendance.agent.choiceId === currentEmployee.choiceId;

  const editable =
    ((featureSpec.isSelfApply && isMine) || (featureSpec.isRepresentativeApply && isMyRepresentative)) && attendance.status === Config.status.making;
  const approvable = featureSpec.isApprove && attendance.status === Config.status.applying && attendance.approver.choiceId === currentEmployee.choiceId;
  const approved = attendance.status === Config.status.accepted || attendance.status === Config.status.rejected;
  const readonly = !editable && !approvable;

  return {
    isMine,
    isMyRepresentative,
    readonly,
    editable,
    approvable,
    approved,
  };
}
