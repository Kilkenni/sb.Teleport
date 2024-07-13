/**
 * Helper functions for working with tables as 2 component vectors (Vec2)
 * All functions operate on the given vector in-place
 */

/** @noSelf **/
declare module vec2 {
  //SOURCE: /assets/scripts/vec2.lua
  /**
   * Checks if two Vec2 vectors are equal by values
   */
  function eq(vector1: Vec2, vector2: Vec2):boolean;

  /**
   * @returns length of a Vec2
   */
  function mag(vector: Vec2): number;

  /**
   * "Normalizes" Vec2 by reducing its length to 1. Consequently, new components are in range 0..1
   */
  function norm(vector: Vec2): Vec2;

  /**
   * Multiplies Vec2 by second arg.
   * @param vector 
   * @param scalar_or_vector If Vec2, multiplies component-wise
   */
  function mul(vector: Vec2, scalar_or_vector: Vec2|number): Vec2;

  /**
   * Divides each component of a Vec2 by scalar
   * @param vector 
   * @param scalar If 0, returns original Vec2
   */
  function div(vector: Vec2, scalar: number): Vec2;

  /**
   * Adds second arg to Vec2
   * @param vector 
   * @param scalar_or_vector If Vec2, adds component-wise
   */
  function add(vector: Vec2, scalar_or_vector: number|Vec2):Vec2;

  /**
   * Subtracts second arg from Vec2
   * @param vector 
   * @param scalar_or_vector If Vec2, subtracts component-wise
   */
  function sub(vector: Vec2, scalar_or_vector:number|Vec2):Vec2;

  /**
   * FIXME Returns the angle (in radians) from the X axis to a point. - check if the func description is correct
   * @param vector FIXME Cartesian coordinates
   */
  function angle(vector: Vec2):unknown;
    /*local angle = math.atan(vector[2], vector[1])
    if angle < 0 then angle = angle + 2 * math.pi end
    return angle
  end*/

  /**
   * Rotates Vec2 by angle
   * @param vector 
   * @param angle in radians
   */
  function rotate(vector: Vec2, angle: number): Vec2;

  /**
   * Creates a vector, given angle between vector and X axis, and its length
   * @param angle In radians
   * @param magnitude Default: 1
   */
  function withAngle(angle: number, magnitude?: number): Vec2;

  /**
   * FIXME
   */
  function intersect(a0: Vec2, a1: Vec2, b0: Vec2, b1: Vec2): Vec2|null;
   /* local segment1 = { a1[1] - a0[1], a1[2] - a0[2] }
    local segment2 = { b1[1] - b0[1], b1[2] - b0[2] }

    local s = (-segment1[2] * (a0[1] - b0[1]) + segment1[1] * (a0[2] - b0[2])) / (-segment2[1] * segment1[2] + segment1[1] * segment2[2]);
    local t = ( segment2[1] * (a0[2] - b0[2]) - segment2[2] * (a0[1] - b0[1])) / (-segment2[1] * segment1[2] + segment1[1] * segment2[2]);

    if s < 0 or s > 1 or t < 0 or t > 1 then
      return nil
    end

    return {
      a0[1] + (t * segment1[1]),
      a0[2] + (t * segment1[2])
    }
  end*/

  /**
   * FIXME
   * @param vector1 
   * @param vector2 
   */
  function dot(vector1: Vec2, vector2: Vec2): number;
   /* return vector1[1] * vector2[1] + vector1[2] * vector2[2]
  end*/

  /**
   * Discards fractional part of vector coords
   */
  function floor(vector:Vec2): Vec2I;

  /**
   * FIXME
   * @param vector 
   * @param target 
   * @param rate 
   */
  function approach(vector: Vec2, target: Vec2, rate: number): Vec2;
    /*local maxDist = math.max(math.abs(target[1] - vector[1]), math.abs(target[2] - vector[2]))
    if maxDist <= rate then return target end

    local fractionalRate = rate / maxDist
    return {
      vector[1] + fractionalRate * (target[1] - vector[1]),
      vector[2] + fractionalRate * (target[2] - vector[2])
    }
  end*/

  /**
   * FIXME Stringifies Vec2, preserving fractional part with <precision> - check
   * @param vector 
   * @param precision 
   */
  function print(vector: Vec2, precision: number): string;
    /*local fstring = "%."..precision.."f, %."..precision.."f"
    return string.format(fstring, vector[1], vector[2])
  end*/
}