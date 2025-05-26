import { defineComponent, Types } from 'bitecs';
export var TrailType;
(function (TrailType) {
    TrailType[TrailType["BEADS"] = 0] = "BEADS";
    TrailType[TrailType["BEADS_ON_A_STRING"] = 1] = "BEADS_ON_A_STRING";
    TrailType[TrailType["MANY_BEADS"] = 2] = "MANY_BEADS";
})(TrailType || (TrailType = {}));
const MAX_STRING_DIST = 10;
export const MAX_STRING_DIST_SQ = MAX_STRING_DIST * MAX_STRING_DIST;
export const LeavesTrail = defineComponent({
    type: Types.ui8,
    col: Types.ui32,
});
