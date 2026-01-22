/**
 * Gradient Editor
 *
 * Visual editor for creating and editing color gradients for particle systems.
 * Allows users to add/remove gradient stops and edit colors/alpha values.
 */

import type { GradientStop } from './gradient-to-bezier';
import { defaultGradients } from './default-gradients';

type Position = {
  left: number;
  top: number;
};

type Size = {
  width: number;
  height: number;
};

const EDITOR_SIZE: Size = { width: 400, height: 60 };
const GRADIENT_BAR_HEIGHT = 40;
const STOP_HANDLE_SIZE = 16;

let wrapper: HTMLElement | null = null;
let gradientCanvas: HTMLCanvasElement | null = null;
let gradientCtx: CanvasRenderingContext2D | null = null;
let currentStops: GradientStop[] = [];
let selectedStop: HTMLElement | null = null;
let onChangeCallback: ((stops: GradientStop[]) => void) | null = null;

/**
 * Creates a gradient stop handle element
 */
const createStopHandle = (stop: GradientStop, index: number): HTMLElement => {
  const handle = document.createElement('div');
  handle.className = 'gradient-stop-handle';
  handle.style.position = 'absolute';
  handle.style.width = `${STOP_HANDLE_SIZE}px`;
  handle.style.height = `${STOP_HANDLE_SIZE}px`;
  handle.style.borderRadius = '50%';
  handle.style.border = '2px solid white';
  handle.style.cursor = 'pointer';
  handle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  handle.style.backgroundColor = `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a / 255})`;
  handle.style.left = `${stop.position * EDITOR_SIZE.width - STOP_HANDLE_SIZE / 2}px`;
  handle.style.top = `${GRADIENT_BAR_HEIGHT}px`;
  handle.dataset.index = index.toString();

  // Drag functionality
  handle.addEventListener('mousedown', onStopMouseDown);

  // Double click to edit color
  handle.addEventListener('dblclick', () => openColorPicker(index));

  // Right click to delete (if not first or last)
  handle.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (index > 0 && index < currentStops.length - 1) {
      deleteStop(index);
    }
  });

  return handle;
};

/**
 * Opens a color picker for a specific stop
 */
const openColorPicker = (index: number): void => {
  const stop = currentStops[index];
  if (!stop) return;

  // Create a temporary color input
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  const hexColor = rgbToHex(stop.color.r, stop.color.g, stop.color.b);
  colorInput.value = hexColor;

  colorInput.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const rgb = hexToRgb(target.value);
    if (rgb) {
      stop.color.r = rgb.r;
      stop.color.g = rgb.g;
      stop.color.b = rgb.b;
      renderGradient();
      renderStopHandles();
      notifyChange();
    }
  });

  colorInput.click();

  // Also prompt for alpha
  setTimeout(() => {
    const alphaInput = prompt(
      `Enter alpha value (0-255) for this stop:`,
      stop.color.a.toString()
    );
    if (alphaInput !== null) {
      const alpha = Math.max(0, Math.min(255, parseInt(alphaInput, 10) || 255));
      stop.color.a = alpha;
      renderGradient();
      renderStopHandles();
      notifyChange();
    }
  }, 100);
};

/**
 * Deletes a gradient stop
 */
const deleteStop = (index: number): void => {
  if (index <= 0 || index >= currentStops.length - 1) {
    alert('Cannot delete first or last stop');
    return;
  }

  currentStops.splice(index, 1);
  renderGradient();
  renderStopHandles();
  notifyChange();
};

/**
 * Mouse down handler for stop handles
 */
const onStopMouseDown = (e: MouseEvent): void => {
  selectedStop = e.currentTarget as HTMLElement;
  document.addEventListener('mousemove', onStopMouseMove);
  document.addEventListener('mouseup', onStopMouseUp);
  e.stopPropagation();
};

/**
 * Mouse move handler for dragging stops
 */
const onStopMouseMove = (e: MouseEvent): void => {
  if (!selectedStop || !wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(EDITOR_SIZE.width, x));

  const index = parseInt(selectedStop.dataset.index || '0', 10);

  // Don't allow first and last stops to move horizontally
  if (index === 0 || index === currentStops.length - 1) {
    return;
  }

  const position = x / EDITOR_SIZE.width;
  currentStops[index].position = position;

  // Sort stops by position
  currentStops.sort((a, b) => a.position - b.position);

  renderGradient();
  renderStopHandles();
  notifyChange();
};

/**
 * Mouse up handler
 */
const onStopMouseUp = (): void => {
  selectedStop = null;
  document.removeEventListener('mousemove', onStopMouseMove);
  document.removeEventListener('mouseup', onStopMouseUp);
};

/**
 * Adds a new gradient stop at a specific position
 */
const addStopAt = (position: number): void => {
  // Clamp position
  position = Math.max(0, Math.min(1, position));

  // Interpolate color at this position
  const color = interpolateColorAt(position);

  currentStops.push({
    position,
    color,
  });

  // Sort stops by position
  currentStops.sort((a, b) => a.position - b.position);

  renderGradient();
  renderStopHandles();
  notifyChange();
};

/**
 * Interpolates color at a specific position based on existing stops
 */
const interpolateColorAt = (position: number): { r: number; g: number; b: number; a: number } => {
  // Find the two stops this position is between
  let leftStop: GradientStop | null = null;
  let rightStop: GradientStop | null = null;

  for (let i = 0; i < currentStops.length - 1; i++) {
    if (currentStops[i].position <= position && currentStops[i + 1].position >= position) {
      leftStop = currentStops[i];
      rightStop = currentStops[i + 1];
      break;
    }
  }

  if (!leftStop || !rightStop) {
    // Fallback to white
    return { r: 255, g: 255, b: 255, a: 255 };
  }

  // Linear interpolation
  const t = (position - leftStop.position) / (rightStop.position - leftStop.position);

  return {
    r: Math.round(leftStop.color.r + (rightStop.color.r - leftStop.color.r) * t),
    g: Math.round(leftStop.color.g + (rightStop.color.g - leftStop.color.g) * t),
    b: Math.round(leftStop.color.b + (rightStop.color.b - leftStop.color.b) * t),
    a: Math.round(leftStop.color.a + (rightStop.color.a - leftStop.color.a) * t),
  };
};

/**
 * Renders the gradient bar
 */
const renderGradient = (): void => {
  if (!gradientCtx || !gradientCanvas) return;

  gradientCtx.clearRect(0, 0, EDITOR_SIZE.width, GRADIENT_BAR_HEIGHT);

  // Create gradient
  const gradient = gradientCtx.createLinearGradient(0, 0, EDITOR_SIZE.width, 0);

  // Sort stops and add to gradient
  const sortedStops = [...currentStops].sort((a, b) => a.position - b.position);
  sortedStops.forEach((stop) => {
    gradient.addColorStop(
      stop.position,
      `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a / 255})`
    );
  });

  // Draw gradient bar
  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, EDITOR_SIZE.width, GRADIENT_BAR_HEIGHT);

  // Draw checkerboard background (to show alpha)
  const checkSize = 10;
  gradientCtx.globalCompositeOperation = 'destination-over';
  for (let y = 0; y < GRADIENT_BAR_HEIGHT; y += checkSize) {
    for (let x = 0; x < EDITOR_SIZE.width; x += checkSize) {
      if ((x / checkSize + y / checkSize) % 2 === 0) {
        gradientCtx.fillStyle = '#ccc';
      } else {
        gradientCtx.fillStyle = '#fff';
      }
      gradientCtx.fillRect(x, y, checkSize, checkSize);
    }
  }
  gradientCtx.globalCompositeOperation = 'source-over';

  // Draw border
  gradientCtx.strokeStyle = '#666';
  gradientCtx.lineWidth = 1;
  gradientCtx.strokeRect(0, 0, EDITOR_SIZE.width, GRADIENT_BAR_HEIGHT);
};

/**
 * Renders stop handles
 */
const renderStopHandles = (): void => {
  if (!wrapper) return;

  // Remove existing handles
  const existingHandles = wrapper.querySelectorAll('.gradient-stop-handle');
  existingHandles.forEach((handle) => handle.remove());

  // Create new handles
  currentStops.forEach((stop, index) => {
    const handle = createStopHandle(stop, index);
    wrapper.appendChild(handle);
  });
};

/**
 * Notifies the change callback
 */
const notifyChange = (): void => {
  if (onChangeCallback) {
    onChangeCallback([...currentStops]);
  }
};

/**
 * Converts RGB to hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

/**
 * Converts hex to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Initializes the gradient editor
 */
export const createGradientEditor = (
  initialStops?: GradientStop[],
  onChange?: (stops: GradientStop[]) => void
): void => {
  wrapper = document.querySelector('.gradient-editor-wrapper');
  gradientCanvas = document.querySelector('.gradient-editor-canvas') as HTMLCanvasElement;

  if (!wrapper || !gradientCanvas) {
    console.error('Gradient editor elements not found');
    return;
  }

  gradientCanvas.width = EDITOR_SIZE.width;
  gradientCanvas.height = GRADIENT_BAR_HEIGHT;
  gradientCtx = gradientCanvas.getContext('2d');

  // Set initial stops
  currentStops = initialStops || [
    { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
    { position: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
  ];

  onChangeCallback = onChange || null;

  // Click on gradient bar to add stop
  gradientCanvas.addEventListener('click', (e) => {
    const rect = gradientCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = x / EDITOR_SIZE.width;
    addStopAt(position);
  });

  // Close button functionality
  const closeButton = document.querySelector('.gradient-editor-modal__close');
  const infoButton = document.querySelector('.gradient-editor-modal__info');
  const infoPanel = document.querySelector('.gradient-editor-info') as HTMLElement;
  const modal = document.querySelector('.gradient-editor-modal') as HTMLElement;
  const modalContent = document.querySelector('.gradient-editor-modal__content') as HTMLElement;
  const modalHeader = document.querySelector('.gradient-editor-modal__header') as HTMLElement;

  const closeModal = () => {
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const toggleInfo = () => {
    if (infoPanel) {
      infoPanel.style.display = infoPanel.style.display === 'none' ? 'block' : 'none';
    }
  };

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (infoButton) {
    infoButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag from starting
      toggleInfo();
    });
  }

  // Draggable modal functionality
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;

  const onDragStart = (e: MouseEvent) => {
    if (e.target === modalHeader || modalHeader.contains(e.target as Node)) {
      // Don't start drag if clicking on close or info button
      const target = e.target as HTMLElement;
      if (
        target.classList.contains('gradient-editor-modal__close') ||
        target.classList.contains('gradient-editor-modal__info')
      ) {
        return;
      }

      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
    }
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
    isDragging = false;
  };

  if (modalHeader) {
    modalHeader.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDragEnd);
  }

  createPresetButtons();

  renderGradient();
  renderStopHandles();
};

/**
 * Sets the current gradient stops
 */
export const setGradientStops = (stops: GradientStop[]): void => {
  currentStops = [...stops];
  renderGradient();
  renderStopHandles();
};

/**
 * Gets the current gradient stops
 */
export const getGradientStops = (): GradientStop[] => {
  return [...currentStops];
};

/**
 * Creates preset gradient buttons
 */
const createPresetButtons = (): void => {
  const presetContainer = document.querySelector('.gradient-editor-presets');
  if (!presetContainer) return;

  presetContainer.innerHTML = '';

  defaultGradients.forEach((preset) => {
    const button = document.createElement('button');
    button.className = 'gradient-preset-button';
    button.textContent = preset.name;
    button.style.cssText = `
      padding: 4px 8px;
      margin: 2px;
      font-size: 11px;
      cursor: pointer;
      border: 1px solid #666;
      background: #333;
      color: #fff;
      border-radius: 3px;
    `;

    button.addEventListener('click', () => {
      setGradientStops(preset.stops);
      notifyChange();
    });

    presetContainer.appendChild(button);
  });
};
