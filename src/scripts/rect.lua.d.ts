/**
 * x1, y1 designate lower left corner
 * x2, y2 designate upper right corner
 */
type rectangle = [number, number, number, number]

/** @noSelf **/
declare module rect {
  //SOURCE: /assets/scripts/rect.lua
  /**
   * @returns zeroed rectangle ([x1, y1, x2, y2] with all coords = 0))
   */
  function zero(): [0, 0, 0, 0]

  /**
   * Shifts rectangle to offset (adds offset X to all x coords, offset Y to all y coord)
   * @param rectangle 
   * @param offset 
   */
  function translate(rectangle:rectangle, offset: Vec2F): rectangle;
    
  /**
   * @returns coords for lower left corner (first 2 elements)
   * @param rectangle 
   */
  function ll(rectangle:rectangle): Vec2F;

  /**
   * @returns coords for upper right corner (last 2 elements)
   * @param rectangle 
   */
  function ur(rectangle: rectangle): Vec2F;

  /**
   * Creates rectangle from two points. Makes no checks of coords.
   * @param min 
   * @param max 
   */
  function fromVec2(min: Vec2F, max: Vec2F):rectangle;

  /**
   * Creates rectangle from starting point and 2D size dimensions
   * @param min 
   * @param size 
   */
  function withSize(min: Vec2F, size: Vec2F):rectangle;

  /**
   * Creates rectangle of certain size with senter at point
   * @param center 
   * @param size 
   */
  function withCenter(center: Vec2F, size: Vec2F): rectangle;

  /**
   * @returns Size vector (coords may be negative)
   */
  function size(rectangle:rectangle): Vec2F;

  /**
   * @returns center of the rectangle
   */
  function center(rectangle: rectangle): Vec2F;
  
  /**
   * @returns Random point within the rectangle
   */
  function randomPoint(rectangle: rectangle): Vec2F;

  /**
   * @returns whether two rectangles intersect 
   */
  function intersects(first: rectangle, second: rectangle):boolean;

  /**
   * Applies rotation to rectangle. FIXME describe rotation center
   * @param rectangle 
   * @param angle 
   */
  function rotate(rectangle: rectangle, angle): rectangle;
    
  /**
   * Flips the rectangle on X axis
   * @param rectangle 
   */
  function flipX(rectangle:rectangle):rectangle;

  /**
   * Scales the rectangle symmetrically or asymmetrically.
   * @param rectangle 
   * @param scale If Vec2F, separate components apply along respective axii
   */
  function scale(rectangle: rectangle, scale: number|Vec2F):rectangle;
  
  /**
   * Linearly increases/decreases rectangle in every dimension on the value of padding
   * @param rectangle 
   * @param padding If Vec2F, separate components apply along respective axii, 
   */
  function pad(rectangle: rectangle, padding: number|Vec2F):rectangle;

  /**
   * @returns if a point lies within the rectangle.
   */
  function contains(rectangle: rectangle, point: Vec2F): boolean;

  /**
   * Returns point coords "snapped" to the side of the rectangle in required direction
   * @param rect 
   * @param point 
   * @param direction FIXME needs better description
   */
  function snap(rect: rectangle, point: Vec2F, direction: Vec2F): Vec2F;

  /**
   * FIXME description
   * @param inner 
   * @param outer 
   */
  function bound(inner: rectangle, outer: rectangle): rectangle;
}

