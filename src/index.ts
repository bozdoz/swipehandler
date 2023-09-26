import angleFromSlope from "./angleFromSlope";
import lineOfBestFit from "./lineOfBestFit";
import Vec from "./vec";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => void;
type Events = "swipe";

/**
 * SwipeHandler adds event listeners to a given target element
 * So that you can listen for swipe events.
 */
class SwipeHandler {
  /** event listener target */
  private target = document;
  /** min number of touch points to call it a swipe */
  private minPoints = 4;
  /** stop counting points after this number of touches */
  private maxPoints = 20;
  /** record all points in a swipe */
  private points: Vec[] = [];
  /** don't fire move events unless pointer is down */
  private isPointerDown = false;
  /** internal event listeners and dispatchers */
  private _events: Record<string, Record<string, Callback>> = {};

  public constructor(target = document) {
    this.target = target;
    this.events("on");
  }

  public destroy() {
    this.events("off");
    this._events = {};
  }

  private events(onoff: "on" | "off") {
    const method = onoff === "on" ? "addEventListener" : "removeEventListener";

    this.target[method]("mousedown", this.onPointerStart as EventListener);
    this.target[method]("mousemove", this.onPointerMove as EventListener);
    this.target[method]("mouseup", this.onPointerEnd as EventListener);
    this.target[method]("mouseout", this.onPointerEnd as EventListener);

    this.target[method]("touchstart", this.onPointerStart as EventListener);
    this.target[method]("touchmove", this.onPointerMove as EventListener);
    this.target[method]("touchend", this.onPointerEnd as EventListener);
    this.target[method]("touchcancel", this.onPointerEnd as EventListener);
  }

  private onPointerStart = (e: TouchEvent | MouseEvent) => {
    const target = "changedTouches" in e ? e.changedTouches[0] : e;

    this.isPointerDown = true;
    this.points = [new Vec(target.screenX, target.screenY)];
  };

  private onPointerMove = (e: TouchEvent | MouseEvent) => {
    if (!this.isPointerDown) {
      return;
    }

    const target = "changedTouches" in e ? e.changedTouches[0] : e;

    const [x, y] = [target.screenX, target.screenY];
    const len = this.points.length;

    if (len >= this.maxPoints) {
      this.points.shift();
    }

    this.points.push(new Vec(x, y));

    // TODO: add throttle to avoid firing

    // find best fit line across x amount of points
    if (len >= this.minPoints) {
      // get a line
      const xs: number[] = [];
      const ys: number[] = [];

      this.points.forEach((vec) => {
        xs.push(vec.x);
        ys.push(vec.y);
      });

      const [m] = lineOfBestFit(xs, ys);

      let angle;

      // if m is null, it's probably infinite (vertical)
      if (Number.isNaN(m)) {
        const ttb = this.points[0].y < this.points[len - 1].y;
        angle = ttb ? 180 : 0;
      } else {
        // determine if we're moving LTR or RTL (slopes are LTR)
        const ltr = this.points[0].x < this.points[len - 1].x;
        // get the angle of best fit line
        angle = angleFromSlope(m) + 90;

        if (!ltr) {
          angle += 180;
        }
      }

      let dir;

      if (angle > 315 || angle < 45) {
        dir = "up";
      } else if (angle > 45 && angle < 135) {
        dir = "right";
      } else if (angle > 135 && angle < 225) {
        dir = "down";
      } else if (angle > 225 && angle < 315) {
        dir = "left";
      }

      // https://en.wikipedia.org/wiki/Cardinal_direction
      let intercardinal;

      if (angle > 337.5 || angle < 22.5) {
        intercardinal = "N";
      } else if (angle > 22.5 && angle < 67.5) {
        intercardinal = "NE";
      } else if (angle > 67.5 && angle < 112.5) {
        intercardinal = "E";
      } else if (angle > 112.5 && angle < 157.5) {
        intercardinal = "SE";
      } else if (angle > 157.5 && angle < 202.5) {
        intercardinal = "S";
      } else if (angle > 202.5 && angle < 247.5) {
        intercardinal = "SW";
      } else if (angle > 247.5 && angle < 292.5) {
        intercardinal = "W";
      } else if (angle > 292.5 && angle < 337.5) {
        intercardinal = "NW";
      }

      // TODO: should swipe be throttled?
      this.fire("swipe", { angle, dir, intercardinal });
    }
  };

  private onPointerEnd = (e: TouchEvent | MouseEvent) => {
    // seems relatedTarget is null on mouseout
    // when the mouseout is actually happening on the html document
    if (this.isPointerDown && (e as MouseEvent).relatedTarget == null) {
      this.isPointerDown = false;
    }
  };

  // CONSUMER EVENTS

  private stamp = (() => {
    let i = 0;
    const key = Symbol("swipehandler");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (obj: any) => {
      if (!(key in obj)) {
        obj[key] = i++;
      }
      return obj[key];
    };
  })();

  on(event: Events, cb: Callback) {
    this._events[event] = this._events[event] || {};
    this._events[event][this.stamp(cb)] = cb;
  }

  fire(event: Events, data = {}) {
    const events = this._events[event] || {};

    for (const key in events) {
      if (Object.prototype.hasOwnProperty.call(events, key)) {
        events[key](data);
      }
    }
  }

  off(event: Events, cb: Callback) {
    this._events[event] = this._events[event] || {};
    const key = this.stamp(cb);

    delete this._events[event][key];
  }
}

export default SwipeHandler;
