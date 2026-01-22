/**
 * Gradient Editor
 *
 * Visual editor for creating and editing color gradients for particle systems.
 * Allows users to add/remove gradient stops and edit colors/alpha values.
 */

import type { GradientStop } from './gradient-to-bezier';
import { defaultGradients } from './default-gradients';

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
 * Gets the actual displayed width of the gradient canvas
 */
const getDisplayWidth = (): number => {
  return gradientCanvas?.clientWidth || EDITOR_SIZE.width;
};

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
  handle.style.cursor = index === 0 || index === currentStops.length - 1 ? 'default' : 'move';
  handle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  handle.style.backgroundColor = `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a / 255})`;

  // Position edge stops at the exact edges, middle stops centered on their position
  if (!gradientCanvas || !wrapper) return handle;

  const canvasRect = gradientCanvas.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  const displayWidth = canvasRect.width;

  // Calculate padding offset (canvas position relative to wrapper)
  const paddingLeft = canvasRect.left - wrapperRect.left;

  let leftPosition: number;
  if (index === 0) {
    // First stop: align to left edge of canvas
    leftPosition = paddingLeft;
  } else if (index === currentStops.length - 1) {
    // Last stop: align to right edge of canvas
    leftPosition = paddingLeft + displayWidth - STOP_HANDLE_SIZE;
  } else {
    // Middle stops: center on position
    leftPosition = paddingLeft + stop.position * displayWidth - STOP_HANDLE_SIZE / 2;
  }

  handle.style.left = `${leftPosition}px`;
  // Position below the gradient bar, accounting for padding
  const paddingTop = canvasRect.top - wrapperRect.top;
  const displayHeight = canvasRect.height;
  // Add a small gap (4px) between the gradient bar and the handle
  handle.style.top = `${paddingTop + displayHeight + 4}px`;
  handle.dataset.index = index.toString();

  // Drag functionality (only for middle stops)
  if (index !== 0 && index !== currentStops.length - 1) {
    handle.addEventListener('mousedown', onStopMouseDown);
  }

  // Double click to edit color (all stops can be edited)
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
 * Opens a compact inline color picker for a specific stop
 */
const openColorPicker = (index: number): void => {
  const stop = currentStops[index];
  if (!stop || !wrapper) return;

  // Remove any existing color picker
  const existingPicker = wrapper.querySelector('.gradient-color-picker');
  if (existingPicker) {
    existingPicker.remove();
  }

  // Create inline color picker
  const picker = document.createElement('div');
  picker.className = 'gradient-color-picker';
  picker.style.cssText = `
    position: absolute;
    left: 50%;
    top: ${GRADIENT_BAR_HEIGHT + STOP_HANDLE_SIZE + 10}px;
    transform: translateX(-50%);
    background: #2a2a2a;
    border: 2px solid #444;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 100;
    min-width: 200px;
  `;

  // Color input with label
  const colorRow = document.createElement('div');
  colorRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;';

  const colorLabel = document.createElement('label');
  colorLabel.textContent = 'Color:';
  colorLabel.style.cssText = 'color: #fff; font-size: 11px; min-width: 50px;';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = rgbToHex(stop.color.r, stop.color.g, stop.color.b);
  colorInput.style.cssText = `
    flex: 1;
    height: 32px;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
  `;

  colorRow.appendChild(colorLabel);
  colorRow.appendChild(colorInput);

  // Opacity slider with label
  const opacityRow = document.createElement('div');
  opacityRow.style.cssText = 'display: flex; align-items: center; gap: 8px;';

  const opacityLabel = document.createElement('label');
  opacityLabel.textContent = `Opacity: ${Math.round((stop.color.a / 255) * 100)}%`;
  opacityLabel.style.cssText = 'color: #fff; font-size: 11px; min-width: 80px;';

  const opacityInput = document.createElement('input');
  opacityInput.type = 'range';
  opacityInput.min = '0';
  opacityInput.max = '255';
  opacityInput.value = stop.color.a.toString();
  opacityInput.style.cssText = 'flex: 1;';

  opacityRow.appendChild(opacityLabel);
  opacityRow.appendChild(opacityInput);

  picker.appendChild(colorRow);
  picker.appendChild(opacityRow);

  // Update color on change
  const updateColor = () => {
    const rgb = hexToRgb(colorInput.value);
    if (rgb) {
      stop.color.r = rgb.r;
      stop.color.g = rgb.g;
      stop.color.b = rgb.b;
      stop.color.a = parseInt(opacityInput.value);
      opacityLabel.textContent = `Opacity: ${Math.round((stop.color.a / 255) * 100)}%`;
      renderGradient();
      renderStopHandles();
      notifyChange();
    }
  };

  colorInput.addEventListener('input', updateColor);
  opacityInput.addEventListener('input', updateColor);

  wrapper.appendChild(picker);

  // Close picker when clicking outside
  const closePickerOnClickOutside = (e: MouseEvent) => {
    if (!picker.contains(e.target as Node)) {
      picker.remove();
      document.removeEventListener('mousedown', closePickerOnClickOutside);
    }
  };

  // Add click outside listener after a short delay to prevent immediate closing
  setTimeout(() => {
    document.addEventListener('mousedown', closePickerOnClickOutside);
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
  if (!selectedStop || !gradientCanvas) return;

  const canvasRect = gradientCanvas.getBoundingClientRect();
  const displayWidth = canvasRect.width;
  let x = e.clientX - canvasRect.left;
  x = Math.max(0, Math.min(displayWidth, x));

  const index = parseInt(selectedStop.dataset.index || '0', 10);

  // Don't allow first and last stops to move horizontally
  if (index === 0 || index === currentStops.length - 1) {
    return;
  }

  let position = x / displayWidth;

  // Calculate exact margin based on handle positioning:
  // - Left edge stop: left edge at paddingLeft (0px relative to canvas)
  //   Its center is at: paddingLeft + STOP_HANDLE_SIZE / 2
  // - Right edge stop: right edge at paddingLeft + displayWidth - STOP_HANDLE_SIZE
  //   Its center is at: paddingLeft + displayWidth - STOP_HANDLE_SIZE / 2
  // - Middle stops are centered on their position: position * displayWidth - STOP_HANDLE_SIZE / 2
  //
  // For middle stop to just touch left edge stop center:
  //   position * displayWidth = STOP_HANDLE_SIZE / 2
  //   position = STOP_HANDLE_SIZE / (2 * displayWidth)
  //
  // For middle stop to just touch right edge stop center:
  //   position * displayWidth = displayWidth - STOP_HANDLE_SIZE / 2
  //   position = 1 - STOP_HANDLE_SIZE / (2 * displayWidth)

  const minMargin = STOP_HANDLE_SIZE / (2 * displayWidth);

  // Clamp position to prevent overlap with edge stops
  position = Math.max(minMargin, Math.min(1 - minMargin, position));

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

  // Set initial stops and ensure first/last are at 0 and 1
  currentStops = initialStops || [
    { position: 0, color: { r: 255, g: 255, b: 255, a: 255 } },
    { position: 1, color: { r: 255, g: 255, b: 255, a: 0 } },
  ];

  // Ensure first and last positions are exactly 0 and 1
  if (currentStops.length > 0) {
    currentStops[0].position = 0;
    currentStops[currentStops.length - 1].position = 1;
  }

  onChangeCallback = onChange || null;

  // Click on gradient bar to add stop
  gradientCanvas.addEventListener('click', (e) => {
    const rect = gradientCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const displayWidth = getDisplayWidth();
    const position = x / displayWidth;
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

  // Ensure first and last positions are exactly 0 and 1
  if (currentStops.length > 0) {
    currentStops[0].position = 0;
    currentStops[currentStops.length - 1].position = 1;
  }

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
