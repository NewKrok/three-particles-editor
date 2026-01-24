import {
  defaultBezierCurves,
  type BezierCurvePreset,
  type BezierPoint,
} from './predefined-bezier-curve-config';

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

type PredefinedButtonOptions = {
  preset: BezierCurvePreset;
  wrapper: HTMLElement;
  isCustom?: boolean;
};

const EDITOR_SIZE: Size = { x: 300, y: 200 };
const DEFAULT_CONTROL_OFFSET = 100;
const CUSTOM_PRESETS_STORAGE_KEY = 'three-particles-editor-custom-bezier-curves';

let wrapper: HTMLElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let selectedPoint: HTMLElement | null = null;
let affectedControlPoint: HTMLElement | null = null;
let currentTarget: { bezierPoints?: BezierPoint[]; type?: string } | null = null;
let onChangeCallback: (() => void) | null = null;

const getPosition = (target: HTMLElement): Position => ({
  left: parseFloat(target.style.left.replace('px', '')),
  top: parseFloat(target.style.top.replace('px', '')),
});

const createControlPoint = ({
  parent,
  className,
  offset = { x: 0, y: 0 },
}: ControlPointOptions): void => {
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
    if (selectedPoint.className.includes('control-point') && selectedPoint.parentElement) {
      const bezierPointPosition = getPosition(selectedPoint.parentElement);
      x -= bezierPointPosition.left;
      y -= bezierPointPosition.top;
    } else {
      x = Math.min(Math.max(x, 0), EDITOR_SIZE.x);
      y = Math.min(Math.max(y, 0), EDITOR_SIZE.y);
    }

    if (selectedPoint.className.includes('bezier-point--first')) {
      x = 0;
    } else if (selectedPoint.className.includes('bezier-point--last')) {
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
      affectedControlPoint.style.left = `${oppositeDistance * Math.cos(oppositeAngle)}px`;
      affectedControlPoint.style.top = `${oppositeDistance * Math.sin(oppositeAngle)}px`;
    }

    render();
    notifyChange();
  }
};

const selectPoint = (e: MouseEvent): void => {
  selectedPoint = e.currentTarget as HTMLElement;
  if (selectedPoint.className.includes('control-point') && selectedPoint.parentElement) {
    affectedControlPoint = selectedPoint.parentElement.querySelector(
      selectedPoint.className.includes('control-point--right')
        ? '.control-point--left'
        : '.control-point--right'
    ) as HTMLElement | null;
  } else {
    affectedControlPoint = null;
  }

  if (wrapper) {
    wrapper.addEventListener('mousemove', updateSelectedPoint, false);
  }
  e.stopPropagation();
};

const createDraggablePoint = (): HTMLElement => {
  const point = document.createElement('div');
  point.className = 'draggable-point';
  point.addEventListener('mousedown', selectPoint);

  return point;
};

const createPoint = ({
  wrapper,
  x,
  y,
  isFirst = false,
  isLast = false,
}: PointOptions): HTMLElement => {
  const point = createDraggablePoint();
  point.className += ` bezier-point ${isFirst ? 'bezier-point--first' : ''} ${
    isLast ? 'bezier-point--last' : ''
  }`;
  point.style.left = `${x}px`;
  point.style.top = `${y}px`;
  wrapper.appendChild(point);

  if (!isFirst)
    createControlPoint({
      parent: point,
      className: 'draggable-point control-point--left',
      offset: { x: -DEFAULT_CONTROL_OFFSET, y: 0 },
    });

  if (!isLast)
    createControlPoint({
      parent: point,
      className: 'draggable-point control-point--right',
      offset: { x: DEFAULT_CONTROL_OFFSET, y: 0 },
    });

  return point;
};

const onMouseUp = (): void => {
  if (selectedPoint && wrapper) {
    wrapper.removeEventListener('mousemove', updateSelectedPoint, false);
    selectedPoint = null;
  }
};

let isInitialized = false;

export const createCurveEditor = (): void => {
  wrapper = document.querySelector('.draggable-points');
  const canvas = document.querySelector('.bezier-editor__canvas') as HTMLCanvasElement | null;

  if (!isInitialized) {
    document.addEventListener('mouseup', onMouseUp);
    isInitialized = true;
  }

  if (wrapper && canvas) {
    // Clear existing points
    wrapper.innerHTML = '';

    // Temporary just 3 point is allowed
    createPoint({ wrapper, x: 0, y: EDITOR_SIZE.y, isFirst: true });
    createPoint({ wrapper, x: EDITOR_SIZE.x / 2, y: 0 });
    createPoint({ wrapper, x: EDITOR_SIZE.x, y: EDITOR_SIZE.y, isLast: true });

    canvas.width = EDITOR_SIZE.x;
    canvas.height = EDITOR_SIZE.y;
    ctx = canvas.getContext('2d');

    createPredefinedButtons();
    setupModalControls();

    render();
  }
};

/**
 * Sets up modal control buttons (close, info toggle, drag)
 */
const setupModalControls = (): void => {
  const closeButton = document.querySelector('.bezier-editor-modal__close');
  const infoButton = document.querySelector('.bezier-editor-modal__info');
  const infoPanel = document.querySelector('.bezier-editor-info') as HTMLElement;
  const modal = document.querySelector('.bezier-editor-modal') as HTMLElement;
  const modalContent = document.querySelector('.bezier-editor-modal__content') as HTMLElement;

  const closeModal = () => {
    if (modal) {
      modal.style.display = 'none';
      // Clear the onChange callback when modal is closed
      onChangeCallback = null;
    }
  };

  const toggleInfo = () => {
    if (infoPanel) {
      infoPanel.style.display = infoPanel.style.display === 'none' ? 'block' : 'none';
    }
  };

  if (closeButton && !closeButton.hasAttribute('data-listener')) {
    closeButton.setAttribute('data-listener', 'true');
    closeButton.addEventListener('click', closeModal);
  }

  if (infoButton && !infoButton.hasAttribute('data-listener')) {
    infoButton.setAttribute('data-listener', 'true');
    infoButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleInfo();
    });
  }

  // Draggable modal functionality - whole content is draggable
  if (modalContent && !modalContent.hasAttribute('data-drag-listener')) {
    modalContent.setAttribute('data-drag-listener', 'true');

    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    const onDragStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't start drag if clicking on interactive elements
      if (
        target.classList.contains('bezier-editor-modal__close') ||
        target.classList.contains('bezier-editor-modal__info') ||
        target.classList.contains('bezier-editor__canvas') ||
        target.classList.contains('draggable-point') ||
        target.classList.contains('bezier-preset-button') ||
        target.classList.contains('bezier-save-button') ||
        target.classList.contains('bezier-preset-delete') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('.bezier-editor-presets') ||
        target.closest('.draggable-points')
      ) {
        return;
      }

      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      modalContent.style.cursor = 'grabbing';
    };

    const onDrag = (e: MouseEvent) => {
      if (isDragging && modalContent) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        modalContent.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      }
    };

    const onDragEnd = () => {
      if (isDragging) {
        isDragging = false;
        if (modalContent) {
          modalContent.style.cursor = '';
        }
      }
    };

    modalContent.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
  }
};

/**
 * Opens the bezier editor modal
 */
export const openBezierEditorModal = (
  target?: {
    bezierPoints?: BezierPoint[];
    type?: string;
  },
  onChange?: () => void
): void => {
  const modal = document.querySelector('.bezier-editor-modal') as HTMLElement;
  if (!modal) return;

  modal.style.display = 'block';

  if (!isInitialized) {
    createCurveEditor();
  }

  if (target) {
    currentTarget = target;
    if (target.bezierPoints && target.bezierPoints.length > 0) {
      setCurveEditorPositions({ bezierPoints: target.bezierPoints });
    }
  }

  // Store the onChange callback for real-time updates
  onChangeCallback = onChange || null;
};

/**
 * Notifies the change callback
 */
const notifyChange = (): void => {
  if (onChangeCallback && currentTarget) {
    setCurveEditorTarget(currentTarget);
    onChangeCallback();
  }
};

const render = (): void => {
  if (!ctx || !wrapper) return;

  ctx.clearRect(0, 0, EDITOR_SIZE.x, EDITOR_SIZE.y);

  // Draw grid
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#444';
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

  const points = Array.from(document.querySelectorAll('.bezier-point')) as HTMLElement[];

  ctx.beginPath();
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 3;

  points.forEach(function (point, index) {
    const pointPos = getPosition(point);

    if (index === 0) {
      ctx.moveTo(pointPos.left, pointPos.top);
    } else {
      const prevPoint = points[index - 1];
      const prevPos = getPosition(prevPoint);
      const prevRightControl = prevPoint.querySelector(
        '.control-point--right'
      ) as HTMLElement | null;
      const currentLeftControl = point.querySelector('.control-point--left') as HTMLElement | null;

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
    const prevRightControl = prevPoint.querySelector('.control-point--right') as HTMLElement | null;
    const nextPoint = points[i];
    const nextPos = getPosition(nextPoint);
    const nextLeftControl = nextPoint.querySelector('.control-point--left') as HTMLElement | null;

    if (prevRightControl && nextLeftControl) {
      const prevRightPos = getPosition(prevRightControl);
      const nextLeftPos = getPosition(nextLeftControl);

      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF22';
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
  ctx.strokeStyle = '#00FF0022';
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

export const setCurveEditorTarget = (target: {
  bezierPoints?: BezierPoint[];
  type?: string;
}): void => {
  currentTarget = target;

  // Handle the new LifetimeCurve format in v2.0.2
  if (!target.bezierPoints && target.type === 'BEZIER') {
    // Initialize bezierPoints if it doesn't exist
    target.bezierPoints = [
      { x: 0, y: 0, percentage: 0 },
      { x: 1, y: 1, percentage: 1 },
    ];
  }
  const points = Array.from(document.querySelectorAll('.bezier-point')) as HTMLElement[];
  target.bezierPoints = points
    .reduce((prev: BezierPoint[], current, index) => {
      const position = getPosition(current);
      const leftControlPosition =
        index === 0
          ? null
          : getPosition(current.querySelector('.control-point--left') as HTMLElement);
      const rightControlPosition =
        index === points.length - 1
          ? null
          : getPosition(current.querySelector('.control-point--right') as HTMLElement);

      if (leftControlPosition)
        prev.push({
          x: (position.left + leftControlPosition.left) / EDITOR_SIZE.x,
          y: 1 - (position.top + leftControlPosition.top) / EDITOR_SIZE.y,
        });
      prev.push({
        x: position.left / EDITOR_SIZE.x,
        y: 1 - position.top / EDITOR_SIZE.y,
        percentage:
          index === 0 ? 0 : index === points.length - 1 ? 1 : round(position.left / EDITOR_SIZE.x),
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

export const setCurveEditorPositions = ({
  bezierPoints,
}: {
  bezierPoints: BezierPoint[];
}): void => {
  const points = Array.from(document.querySelectorAll('.bezier-point')) as HTMLElement[];
  // TODO Temporary only 3 ponts allowed, it's 7 with control points
  if (points.length === 3 && bezierPoints.length === 7) {
    let positionIndex = 0;
    points.forEach((point) => {
      const leftPoint = point.querySelector('.control-point--left') as HTMLElement | null;
      if (leftPoint) {
        leftPoint.style.left = `${
          (bezierPoints[positionIndex].x - bezierPoints[positionIndex + 1].x) * EDITOR_SIZE.x
        }px`;
        leftPoint.style.top = `${
          (bezierPoints[positionIndex].y - bezierPoints[positionIndex + 1].y) * -EDITOR_SIZE.y
        }px`;
        positionIndex++;
      }

      point.style.left = `${bezierPoints[positionIndex].x * EDITOR_SIZE.x}px`;
      point.style.top = `${(1 - bezierPoints[positionIndex].y) * EDITOR_SIZE.y}px`;
      positionIndex++;

      const rightPoint = point.querySelector('.control-point--right') as HTMLElement | null;
      if (rightPoint) {
        rightPoint.style.left = `${
          (bezierPoints[positionIndex].x - bezierPoints[positionIndex - 1].x) * EDITOR_SIZE.x
        }px`;
        rightPoint.style.top = `${
          (bezierPoints[positionIndex].y - bezierPoints[positionIndex - 1].y) * -EDITOR_SIZE.y
        }px`;
        positionIndex++;
      }
    });
    render();
  }
};

/**
 * Load custom presets from LocalStorage
 */
const loadCustomPresets = (): BezierCurvePreset[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom bezier presets:', error);
    return [];
  }
};

/**
 * Save custom presets to LocalStorage
 */
const saveCustomPresets = (presets: BezierCurvePreset[]): void => {
  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save custom bezier presets:', error);
  }
};

/**
 * Saves the current curve as a custom preset
 */
const saveCurrentAsPreset = (): void => {
  const name = prompt('Enter a name for this curve preset:');
  if (!name || name.trim() === '') return;

  const customPresets = loadCustomPresets();

  // Check if name already exists
  const existingIndex = customPresets.findIndex((p) => p.name === name.trim());
  if (existingIndex !== -1) {
    if (!confirm(`A preset named "${name.trim()}" already exists. Overwrite it?`)) {
      return;
    }
    customPresets.splice(existingIndex, 1);
  }

  const points = Array.from(document.querySelectorAll('.bezier-point')) as HTMLElement[];
  const bezierPoints = points
    .reduce((prev: BezierPoint[], current, index) => {
      const position = getPosition(current);
      const leftControlPosition =
        index === 0
          ? null
          : getPosition(current.querySelector('.control-point--left') as HTMLElement);
      const rightControlPosition =
        index === points.length - 1
          ? null
          : getPosition(current.querySelector('.control-point--right') as HTMLElement);

      if (leftControlPosition)
        prev.push({
          x: (position.left + leftControlPosition.left) / EDITOR_SIZE.x,
          y: 1 - (position.top + leftControlPosition.top) / EDITOR_SIZE.y,
        });
      prev.push({
        x: position.left / EDITOR_SIZE.x,
        y: 1 - position.top / EDITOR_SIZE.y,
        percentage:
          index === 0 ? 0 : index === points.length - 1 ? 1 : round(position.left / EDITOR_SIZE.x),
      });
      if (rightControlPosition)
        prev.push({
          x: (position.left + rightControlPosition.left) / EDITOR_SIZE.x,
          y: 1 - (position.top + rightControlPosition.top) / EDITOR_SIZE.y,
        });

      return prev;
    }, [])
    .map((entry) => ({ ...entry, x: round(entry.x), y: round(entry.y) }));

  const newPreset: BezierCurvePreset = {
    name: name.trim(),
    bezierPoints,
  };

  customPresets.unshift(newPreset);
  saveCustomPresets(customPresets);
  createPredefinedButtons();
};

/**
 * Deletes a custom preset
 */
const deleteCustomPreset = (name: string): void => {
  if (!confirm(`Delete preset "${name}"?`)) return;

  const customPresets = loadCustomPresets();
  const filtered = customPresets.filter((p) => p.name !== name);
  saveCustomPresets(filtered);
  createPredefinedButtons();
};

/**
 * Generates a bezier curve preview canvas for a given set of points
 */
const generateBezierPreview = (
  bezierPoints: BezierPoint[],
  width: number = 80,
  height: number = 40
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw background grid
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  // Draw grid lines
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Scale points to canvas size and flip Y axis
  const scaledPoints = bezierPoints.map((p) => ({
    x: p.x * width,
    y: height - p.y * height,
    percentage: p.percentage,
  }));

  // Find main points (those with percentage property)
  const mainPoints = scaledPoints.filter((p) => p.percentage !== undefined);

  // Draw bezier curve
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  ctx.beginPath();

  if (mainPoints.length >= 2) {
    ctx.moveTo(mainPoints[0].x, mainPoints[0].y);

    // For 3-point curve (7 bezier points total)
    if (mainPoints.length === 3 && scaledPoints.length === 7) {
      // First segment: point 0 to point 3
      ctx.bezierCurveTo(
        scaledPoints[1].x,
        scaledPoints[1].y,
        scaledPoints[2].x,
        scaledPoints[2].y,
        scaledPoints[3].x,
        scaledPoints[3].y
      );
      // Second segment: point 3 to point 6
      ctx.bezierCurveTo(
        scaledPoints[4].x,
        scaledPoints[4].y,
        scaledPoints[5].x,
        scaledPoints[5].y,
        scaledPoints[6].x,
        scaledPoints[6].y
      );
    } else {
      // Fallback: draw lines between main points
      for (let i = 1; i < mainPoints.length; i++) {
        ctx.lineTo(mainPoints[i].x, mainPoints[i].y);
      }
    }
  }

  ctx.stroke();

  // Draw border
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  return canvas.toDataURL();
};

/**
 * Creates a preset button element
 */
const createPresetButton = ({
  preset,
  wrapper,
  isCustom = false,
}: PredefinedButtonOptions): void => {
  const buttonWrapper = document.createElement('div');
  buttonWrapper.style.cssText = 'position: relative;';

  const button = document.createElement('button');
  button.className = 'bezier-preset-button';
  button.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px;
    margin: 2px;
    font-size: 11px;
    cursor: pointer;
    border: 2px solid ${isCustom ? '#4a9eff' : '#666'};
    background: #333;
    color: #fff;
    border-radius: 4px;
    transition: all 0.15s;
    min-width: 70px;
    position: relative;
  `;

  // Create preview image
  const previewImg = document.createElement('img');
  previewImg.src = preset.preview || generateBezierPreview(preset.bezierPoints, 60, 30);
  previewImg.style.cssText = `
    width: 60px;
    height: 30px;
    border-radius: 2px;
    display: block;
  `;

  // Create name label
  const nameLabel = document.createElement('span');
  nameLabel.textContent = preset.name;
  nameLabel.style.cssText = `
    font-size: 9px;
    text-align: center;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;

  button.appendChild(previewImg);
  button.appendChild(nameLabel);

  button.addEventListener('click', () => {
    setCurveEditorPositions({ bezierPoints: preset.bezierPoints });
    if (currentTarget) {
      setCurveEditorTarget(currentTarget);
    }
    notifyChange();
  });

  button.addEventListener('mouseenter', () => {
    button.style.borderColor = isCustom ? '#6bb3ff' : '#888';
    button.style.background = '#3a3a3a';
    button.style.transform = 'translateY(-1px)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.borderColor = isCustom ? '#4a9eff' : '#666';
    button.style.background = '#333';
    button.style.transform = 'translateY(0)';
  });

  buttonWrapper.appendChild(button);

  // Add delete button for custom presets
  if (isCustom) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'bezier-preset-delete';
    deleteBtn.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      width: 18px;
      height: 18px;
      border: none;
      background: #ff4444;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 10;
    `;

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomPreset(preset.name);
    });

    buttonWrapper.addEventListener('mouseenter', () => {
      deleteBtn.style.opacity = '1';
    });

    buttonWrapper.addEventListener('mouseleave', () => {
      deleteBtn.style.opacity = '0';
    });

    buttonWrapper.appendChild(deleteBtn);
  }

  wrapper.appendChild(buttonWrapper);
};

/**
 * Creates preset curve buttons
 */
const createPredefinedButtons = (): void => {
  const presetContainer = document.querySelector('.bezier-editor-presets');
  if (!presetContainer) return;

  presetContainer.innerHTML = '';

  // Load custom presets
  const customPresets = loadCustomPresets();

  // Add save current button
  const saveButton = document.createElement('button');
  saveButton.className = 'bezier-preset-button bezier-save-button';
  saveButton.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px;
    margin: 2px;
    font-size: 11px;
    cursor: pointer;
    border: 2px dashed #4a9eff;
    background: #2a2a2a;
    color: #4a9eff;
    border-radius: 4px;
    transition: all 0.15s;
    min-width: 70px;
    min-height: 60px;
    font-weight: bold;
  `;
  saveButton.innerHTML =
    '<span style="font-size: 20px;">+</span><span style="font-size: 9px;">Save Current</span>';

  saveButton.addEventListener('click', saveCurrentAsPreset);

  saveButton.addEventListener('mouseenter', () => {
    saveButton.style.borderColor = '#6bb3ff';
    saveButton.style.background = '#333';
  });

  saveButton.addEventListener('mouseleave', () => {
    saveButton.style.borderColor = '#4a9eff';
    saveButton.style.background = '#2a2a2a';
  });

  presetContainer.appendChild(saveButton);

  // Add custom presets first
  customPresets.forEach((preset) => {
    createPresetButton({ preset, wrapper: presetContainer as HTMLElement, isCustom: true });
  });

  // Add default presets
  defaultBezierCurves.forEach((preset) => {
    createPresetButton({ preset, wrapper: presetContainer as HTMLElement, isCustom: false });
  });
};
