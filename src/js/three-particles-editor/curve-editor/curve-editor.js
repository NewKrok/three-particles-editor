const EDITOR_SIZE = { x: 300, y: 200 };
const DEFAULT_CONTROL_OFFSET = 100;

let wrapper, ctx, selectedPoint, affectedControlPoint;

const getPosition = (target) => ({
  left: parseFloat(target.style.left.replace("px", "")),
  top: parseFloat(target.style.top.replace("px", "")),
});

const createControlPoint = ({ parent, className, offset = { x: 0, y: 0 } }) => {
  const controlPoint = createDraggablePoint();
  controlPoint.className += ` control-point ${className}`;
  controlPoint.style.left = `${offset.x}px`;
  controlPoint.style.top = `${offset.y}px`;
  parent.appendChild(controlPoint);
};

const updateSelectedPoint = (e) => {
  if (selectedPoint) {
    const rect = wrapper.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (selectedPoint.className.includes("control-point")) {
      const bezierPointPosition = getPosition(selectedPoint.parentElement);
      x -= bezierPointPosition.left;
      y -= bezierPointPosition.top;
    } else {
      x = Math.min(Math.max(x, 0), EDITOR_SIZE.x);
      y = Math.min(Math.max(y, 0), EDITOR_SIZE.y);
    }

    if (selectedPoint.className.includes("bezier-point--first")) {
      x = 0;
    } else if (selectedPoint.className.includes("bezier-point--last")) {
      x = EDITOR_SIZE.x;
    }

    selectedPoint.style.left = `${x}px`;
    selectedPoint.style.top = `${y}px`;

    if (affectedControlPoint) {
      const selectedAngle = Math.atan2(y, x);
      const oppositeAngle = selectedAngle + Math.PI;
      const oppositePositon = getPosition(affectedControlPoint);
      const oppositeDistance = Math.sqrt(
        Math.pow(oppositePositon.left, 2) + Math.pow(oppositePositon.top, 2)
      );
      affectedControlPoint.style.left = `${
        oppositeDistance * Math.cos(oppositeAngle)
      }px`;
      affectedControlPoint.style.top = `${
        oppositeDistance * Math.sin(oppositeAngle)
      }px`;
    }

    render();
  }
};

const selectPoint = (e) => {
  selectedPoint = e.currentTarget;
  if (selectedPoint.className.includes("control-point"))
    affectedControlPoint = selectedPoint.parentElement.querySelector(
      selectedPoint.className.includes("control-point--right")
        ? ".control-point--left"
        : ".control-point--right"
    );
  else affectedControlPoint = null;
  wrapper.addEventListener("mousemove", updateSelectedPoint, false);
  e.stopPropagation();
};

const createDraggablePoint = () => {
  const point = document.createElement("div");
  point.className = "draggable-point";
  point.addEventListener("mousedown", selectPoint);

  return point;
};

const createPoint = ({ wrapper, x, y, isFirst = false, isLast = false }) => {
  const point = createDraggablePoint();
  point.className += ` bezier-point ${isFirst && "bezier-point--first"} ${
    isLast && "bezier-point--last"
  }`;
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  wrapper.appendChild(point);

  if (!isFirst)
    createControlPoint({
      parent: point,
      className: "draggable-point control-point--left",
      offset: { x: -DEFAULT_CONTROL_OFFSET, y: 0 },
    });

  if (!isLast)
    createControlPoint({
      parent: point,
      className: "draggable-point control-point--right",
      offset: { x: DEFAULT_CONTROL_OFFSET, y: 0 },
    });

  return point;
};

const onMouseUp = () => {
  if (selectedPoint) {
    wrapper.removeEventListener("mousemove", updateSelectedPoint, false);
    selectedPoint = null;
  }
};

export const createCurveEditor = () => {
  wrapper = document.querySelector(".draggable-points");
  const canvas = document.querySelector(".curve-editor__canvas");
  document.addEventListener("mouseup", onMouseUp);

  // Temporary just 3 point is allowed
  createPoint({ wrapper, x: 0, y: EDITOR_SIZE.y, isFirst: true });
  createPoint({ wrapper, x: EDITOR_SIZE.x / 2, y: 0 });
  createPoint({ wrapper, x: EDITOR_SIZE.x, y: EDITOR_SIZE.y, isLast: true });

  ctx = canvas.getContext("2d");
  render();
};

const render = () => {
  const points = Array.from(document.querySelectorAll(".bezier-point"));

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

  points.forEach(function (point) {
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

const round = (value) => Math.floor(value * 10000) / 10000;

export const setCurveEditorTarget = (target) => {
  const points = Array.from(document.querySelectorAll(".bezier-point"));
  target.bezierPoints = points
    .reduce((prev, current, index) => {
      const position = getPosition(current);
      const leftControlPosition =
        index === 0
          ? null
          : getPosition(current.querySelector(".control-point--left"));
      const rightControlPosition =
        index === points.length - 1
          ? null
          : getPosition(current.querySelector(".control-point--right"));

      if (leftControlPosition)
        prev.push({
          x: (position.left + leftControlPosition.left) / EDITOR_SIZE.x,
          y: 1 - (position.top + leftControlPosition.top) / EDITOR_SIZE.y,
        });
      prev.push({
        x: position.left / EDITOR_SIZE.x,
        y: 1 - position.top / EDITOR_SIZE.y,
        percentage:
          index === 0
            ? 0
            : index === points.length - 1
            ? 1
            : round(position.left / EDITOR_SIZE.x),
      });
      if (rightControlPosition)
        prev.push({
          x: (position.left + rightControlPosition.left) / EDITOR_SIZE.x,
          y: 1 - (position.top + rightControlPosition.top) / EDITOR_SIZE.y,
        });

      return prev;
    }, [])
    .map((entry) => ({ ...entry, x: round(entry.x), y: round(entry.y) }));
};

export const setCurveEditorPositions = ({ bezierPoints }) => {
  const points = Array.from(document.querySelectorAll(".bezier-point"));
  // TODO Temporary only 3 ponts allowed
  if (points.length === 3) {
    let positionIndex = 0;
    points.forEach((point) => {
      const leftPoint = point.querySelector(".control-point--left");
      if (leftPoint) {
        leftPoint.style.left = `${
          (bezierPoints[positionIndex].x - bezierPoints[positionIndex + 1].x) *
          EDITOR_SIZE.x
        }px`;
        leftPoint.style.top = `${
          (bezierPoints[positionIndex].y - bezierPoints[positionIndex + 1].y) *
          -EDITOR_SIZE.y
        }px`;
        positionIndex++;
      }

      point.style.left = `${bezierPoints[positionIndex].x * EDITOR_SIZE.x}px`;
      point.style.top = `${
        (1 - bezierPoints[positionIndex].y) * EDITOR_SIZE.y
      }px`;
      positionIndex++;

      const rightPoint = point.querySelector(".control-point--right");
      if (rightPoint) {
        rightPoint.style.left = `${
          (bezierPoints[positionIndex].x - bezierPoints[positionIndex - 1].x) *
          EDITOR_SIZE.x
        }px`;
        rightPoint.style.top = `${
          (bezierPoints[positionIndex].y - bezierPoints[positionIndex - 1].y) *
          -EDITOR_SIZE.y
        }px`;
        positionIndex++;
      }
    });
    render();
  }
};
