import { defineComponent, Types } from 'bitecs';
export const HasGravity = defineComponent({
    strength: Types.f32,
    radius: Types.f32,
    falloffType: Types.ui8,
});
export var GravityFalloffType;
(function (GravityFalloffType) {
    GravityFalloffType[GravityFalloffType["INVERSE_SQUARE"] = 0] = "INVERSE_SQUARE";
    GravityFalloffType[GravityFalloffType["LINEAR"] = 1] = "LINEAR";
    GravityFalloffType[GravityFalloffType["CONSTANT"] = 2] = "CONSTANT";
})(GravityFalloffType || (GravityFalloffType = {}));
