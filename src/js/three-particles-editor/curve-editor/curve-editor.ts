import { examples } from "./predefined-bezier-curve-config";

type Position = {
  left: number;
  top: number;
};

type Size = {
  x: number;
  y: number;
};

type Offset = {
  x: number;
  y: number;
};

type PointOptions = {
  wrapper: HTMLElement;
  x: number;
  y: number;
  isFirst?: boolean;
  isLast?: boolean;
};

type ControlPointOptions = {
  parent: HTMLElement;
  className: string;
  offset?: Offset;
};

type BezierPoint = {
  x: number;
  y: number;
  percentage?: number;
};

type PredefinedButtonOptions = {
  bezierPoints: BezierPoint[];
  preview: string;
  wrapper: HTMLElement;
};

const EDITOR_SIZE: Size = { x: 300, y: 200 };
const DEFAULT_CONTROL_OFFSET = 100;

let wrapper: HTMLElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let selectedPoint: HTMLElement | null = null;
let affectedControlPoint: HTMLElement | null = null;

const getPosition = (target: HTMLElement): Position => ({
  left: parseFloat(target.style.left.replace("px", "")),
  top: parseFloat(target.style.top.replace("px", "")),
});

const createControlPoint = ({ parent, className, offset = { x: 0, y: 0 } }: ControlPointOptions): void => {
  const controlPoint = createDraggablePoint();
  controlPoint.className += ` control-point ${className}`;
  controlPoint.style.left = `${offset.x}px`;
  controlPoint.style.top = `${offset.y}px`;
  parent.appendChild(controlPoint);
};

const updateSelectedPoint = (e: MouseEvent): void => {
  if (selectedPoint && wrapper) {
    const rect = wrapper.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (selectedPoint.className.includes("control-point") && selectedPoint.parentElement) {
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

const selectPoint = (e: MouseEvent): void => {
  selectedPoint = e.currentTarget as HTMLElement;
  if (selectedPoint.className.includes("control-point") && selectedPoint.parentElement) {
    affectedControlPoint = selectedPoint.parentElement.querySelector(
      selectedPoint.className.includes("control-point--right")
        ? ".control-point--left"
        : ".control-point--right"
    ) as HTMLElement | null;
  } else {
    affectedControlPoint = null;
  }
  
  if (wrapper) {
    wrapper.addEventListener("mousemove", updateSelectedPoint, false);
  }
  e.stopPropagation();
};

const createDraggablePoint = (): HTMLElement => {
  const point = document.createElement("div");
  point.className = "draggable-point";
  point.addEventListener("mousedown", selectPoint);

  return point;
};

const createPoint = ({ wrapper, x, y, isFirst = false, isLast = false }: PointOptions): HTMLElement => {
  const point = createDraggablePoint();
  point.className += ` bezier-point ${isFirst ? "bezier-point--first" : ""} ${
    isLast ? "bezier-point--last" : ""
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

const onMouseUp = (): void => {
  if (selectedPoint && wrapper) {
    wrapper.removeEventListener("mousemove", updateSelectedPoint, false);
    selectedPoint = null;
  }
};

export const createCurveEditor = (): void => {
  wrapper = document.querySelector(".draggable-points");
  const canvas = document.querySelector(".curve-editor__canvas") as HTMLCanvasElement | null;
  document.addEventListener("mouseup", onMouseUp);

  if (wrapper && canvas) {
    // Temporary just 3 point is allowed
    createPoint({ wrapper, x: 0, y: EDITOR_SIZE.y, isFirst: true });
    createPoint({ wrapper, x: EDITOR_SIZE.x / 2, y: 0 });
    createPoint({ wrapper, x: EDITOR_SIZE.x, y: EDITOR_SIZE.y, isLast: true });

    canvas.width = EDITOR_SIZE.x;
    canvas.height = EDITOR_SIZE.y;
    ctx = canvas.getContext("2d");

    createPredefinedButtons();

    render();
  }
};

const render = (): void => {
  if (!ctx || !wrapper) return;

  ctx.clearRect(0, 0, EDITOR_SIZE.x, EDITOR_SIZE.y);

  // Draw grid
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

  const points = Array.from(document.querySelectorAll(".bezier-point")) as HTMLElement[];

  ctx.beginPath();
  ctx.strokeStyle = "#00FF00";
  ctx.lineWidth = 3;

  points.forEach(function (point, index) {
    const pointPos = getPosition(point);

    if (index === 0) {
      ctx.moveTo(pointPos.left, pointPos.top);
    } else {
      const prevPoint = points[index - 1];
      const prevPos = getPosition(prevPoint);
      const prevRightControl = prevPoint.querySelector(
        ".control-point--right"
      ) as HTMLElement | null;
      const currentLeftControl = point.querySelector(
        ".control-point--left"
      ) as HTMLElement | null;

      if (prevRightControl && currentLeftControl) {
        const prevRightPos = getPosition(prevRightControl);
        const currentLeftPos = getPosition(currentLeftControl);

        ctx.bezierCurveTo(
          prevRightPos.left + prevPos.left,
          prevRightPos.top + prevPos.top,
          currentLeftPos.left + pointPos.left,
          currentLeftPos.top + pointPos.top,
          pointPos.left,
          pointPos.top
        );
      }
    }
  });

  ctx.stroke();

  // Draw guidelines
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const prevPos = getPosition(prevPoint);
    const prevRightControl = prevPoint.querySelector(
      ".control-point--right"
    ) as HTMLElement | null;
    const nextPoint = points[i];
    const nextPos = getPosition(nextPoint);
    const nextLeftControl = nextPoint.querySelector(
      ".control-point--left"
    ) as HTMLElement | null;

    if (prevRightControl && nextLeftControl) {
      const prevRightPos = getPosition(prevRightControl);
      const nextLeftPos = getPosition(nextLeftControl);

      ctx.beginPath();
      ctx.strokeStyle = "#FFFFFF22";
      ctx.lineWidth = 1;
      ctx.moveTo(prevPos.left, prevPos.top);
      ctx.bezierCurveTo(
        prevRightPos.left + prevPos.left,
        prevRightPos.top + prevPos.top,
        nextLeftPos.left + nextPos.left,
        nextLeftPos.top + nextPos.top,
        nextPos.left,
        nextPos.top
      );

      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.strokeStyle = "#00FF0022";
  ctx.lineWidth = 1;

  points.forEach(function (point) {
    const pointPos = getPosition(point);

    Array.from(point.children).forEach((child) => {
      const childPos = getPosition(child as HTMLElement);
      ctx.moveTo(pointPos.left, pointPos.top);
      ctx.lineTo(childPos.left + pointPos.left, childPos.top + pointPos.top);
      ctx.stroke();
    });
  });
  ctx.closePath();
};

const round = (value: number): number => Math.floor(value * 10000) / 10000;

export const setCurveEditorTarget = (target: { bezierPoints?: BezierPoint[], type?: string }): void => {
  // Handle the new LifetimeCurve format in v2.0.2
  if (!target.bezierPoints && target.type === 'BEZIER') {
    // Initialize bezierPoints if it doesn't exist
    target.bezierPoints = [
      { x: 0, y: 0, percentage: 0 },
      { x: 1, y: 1, percentage: 1 },
    ];
  }
  const points = Array.from(document.querySelectorAll(".bezier-point")) as HTMLElement[];
  target.bezierPoints = points
    .reduce((prev: BezierPoint[], current, index) => {
      const position = getPosition(current);
      const leftControlPosition =
        index === 0
          ? null
          : getPosition(current.querySelector(".control-point--left") as HTMLElement);
      const rightControlPosition =
        index === points.length - 1
          ? null
          : getPosition(current.querySelector(".control-point--right") as HTMLElement);

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

export const setCurveEditorPositions = ({ bezierPoints }: { bezierPoints: BezierPoint[] }): void => {
  const points = Array.from(document.querySelectorAll(".bezier-point")) as HTMLElement[];
  // TODO Temporary only 3 ponts allowed, it's 7 with control points
  if (points.length === 3 && bezierPoints.length === 7) {
    let positionIndex = 0;
    points.forEach((point) => {
      const leftPoint = point.querySelector(".control-point--left") as HTMLElement | null;
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

      const rightPoint = point.querySelector(".control-point--right") as HTMLElement | null;
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

const createPredefinedButton = ({ bezierPoints, preview, wrapper }: PredefinedButtonOptions): void => {
  const exampleWrapper = document.createElement("div");
  exampleWrapper.className = "curve-editor__predefined-entry";
  exampleWrapper.style.backgroundImage = `url(${preview})`;

  exampleWrapper.onclick = () => setCurveEditorPositions({ bezierPoints });

  wrapper.appendChild(exampleWrapper);
};

const createPredefinedButtons = (): void => {
  const wrapper = document.querySelector(".curve-editor__predefined-list") as HTMLElement | null;
  if (wrapper) {
    examples.forEach((entry) => createPredefinedButton({ ...entry, wrapper }));
  }
};
