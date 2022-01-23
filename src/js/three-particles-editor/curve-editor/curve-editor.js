const EDITOR_SIZE = { x: 300, y: 200 };
const DEFAULT_CONTROL_OFFSET = 100;

const createControlPoint = ({ parent, className, offset = { x: 0, y: 0 } }) => {
  const controlPoint = document.createElement("div");
  controlPoint.className = `control-point ${className}`;
  controlPoint.style.left = `${offset.x}px`;
  controlPoint.style.top = `${offset.y}px`;
  parent.appendChild(controlPoint);
};

const createPoint = (parent, x, y) => {
  const point = document.createElement("div");
  point.className = "bezier-point";
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  parent.appendChild(point);

  createControlPoint({
    parent: point,
    className: "control-point--left",
    offset: { x: -DEFAULT_CONTROL_OFFSET, y: 0 },
  });
  createControlPoint({
    parent: point,
    className: "control-point--right",
    offset: { x: DEFAULT_CONTROL_OFFSET, y: 0 },
  });

  return point;
};

const getPosition = (target) => ({
  left: parseFloat(target.style.left.replace("px", "")),
  top: parseFloat(target.style.top.replace("px", "")),
});

export const createCurveEditor = (parent) => {
  const wrapper = document.querySelector(".curve-editor");
  const canvas = document.querySelector(".curve-editor__canvas");

  // Temporary just 3 point is allowed
  createPoint(wrapper, 0, EDITOR_SIZE.y);
  createPoint(wrapper, EDITOR_SIZE.x / 2, 0);
  createPoint(wrapper, EDITOR_SIZE.x, EDITOR_SIZE.y);

  const ctx = canvas.getContext("2d");

  render({
    ctx,
    points: Array.from(document.querySelectorAll(".bezier-point")),
  });
};

const render = ({ ctx, points }) => {
  ctx.clearRect(0, 0, EDITOR_SIZE.x, EDITOR_SIZE.y);

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#444";
  for (let x = 0; x <= EDITOR_SIZE.x; x += 10) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, EDITOR_SIZE.y);
  }
  for (let y = 0; y <= EDITOR_SIZE.y; y += 10) {
    ctx.moveTo(0, y);
    ctx.lineTo(EDITOR_SIZE.x, y);
  }
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00FF00";
  points.forEach(function (point, index) {
    if (points[index + 1]) {
      const pointPos = getPosition(point);
      const pointRightPos = getPosition(
        point.querySelector(".control-point--right")
      );
      const next = points[index + 1];
      const nextPos = getPosition(next);
      const nextLeftPos = getPosition(
        next.querySelector(".control-point--left")
      );
      ctx.moveTo(pointPos.left, pointPos.top);
      ctx.bezierCurveTo(
        pointRightPos.left + pointPos.left,
        pointRightPos.top + pointPos.top,
        nextLeftPos.left + nextPos.left,
        nextLeftPos.top + nextPos.top,
        nextPos.left,
        nextPos.top
      );

      ctx.stroke();
    }
  });

  ctx.beginPath();
  ctx.strokeStyle = "#00FF0022";
  ctx.lineWidth = 1;

  points.forEach(function (point, index) {
    const pointPos = getPosition(point);

    Array.from(point.children).forEach((child) => {
      const childPos = getPosition(child);
      ctx.moveTo(pointPos.left, pointPos.top);
      ctx.lineTo(childPos.left + pointPos.left, childPos.top + pointPos.top);
      ctx.stroke();
    });
  });
  ctx.closePath();
};
