/**
 * Gradient Editor
 *
 * Visual editor for creating and editing color gradients for particle systems.
 * Allows users to add/remove gradient stops and edit colors/alpha values.
 */

import type { GradientStop } from './gradient-to-bezier';
import type { GradientPreset } from './default-gradients';
import { defaultGradients } from './default-gradients';

type Size = {
  width: number;
  height: number;
};

const EDITOR_SIZE: Size = { width: 400, height: 60 };
const GRADIENT_BAR_HEIGHT = 40;
const STOP_HANDLE_SIZE = 16;
const CUSTOM_PRESETS_STORAGE_KEY = 'three-particles-editor-custom-gradients';

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

  // Draggable modal functionality - whole content is draggable
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;

  const onDragStart = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't start drag if clicking on interactive elements
    if (
      target.classList.contains('gradient-editor-modal__close') ||
      target.classList.contains('gradient-editor-modal__info') ||
      target.classList.contains('gradient-editor-canvas') ||
      target.classList.contains('gradient-stop-handle') ||
      target.classList.contains('gradient-preset-button') ||
      target.classList.contains('gradient-save-button') ||
      target.classList.contains('gradient-preset-delete') ||
      target.classList.contains('gradient-color-picker') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.closest('.gradient-editor-presets') ||
      target.closest('.gradient-editor-wrapper') ||
      target.closest('.gradient-color-picker')
    ) {
      return;
    }

    isDragging = true;
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
    if (modalContent) {
      modalContent.style.cursor = 'grabbing';
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
    if (isDragging) {
      isDragging = false;
      if (modalContent) {
        modalContent.style.cursor = '';
      }
    }
  };

  if (modalContent) {
    modalContent.addEventListener('mousedown', onDragStart);
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
 * Load custom presets from LocalStorage
 */
const loadCustomPresets = (): GradientPreset[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
};

/**
 * Save custom presets to LocalStorage
 */
const saveCustomPresets = (presets: GradientPreset[]): void => {
  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save custom presets:', error);
  }
};

/**
 * Saves the current gradient as a custom preset
 */
const saveCurrentAsPreset = (): void => {
  const name = prompt('Enter a name for this gradient preset:');
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

  const newPreset: GradientPreset = {
    name: name.trim(),
    stops: [...currentStops],
  };

  customPresets.unshift(newPreset);
  saveCustomPresets(customPresets);
  createPresetButtons();
};

/**
 * Deletes a custom preset
 */
const deleteCustomPreset = (name: string): void => {
  if (!confirm(`Delete preset "${name}"?`)) return;

  const customPresets = loadCustomPresets();
  const filtered = customPresets.filter((p) => p.name !== name);
  saveCustomPresets(filtered);
  createPresetButtons();
};

/**
 * Generates a gradient preview canvas for a given set of stops
 */
const generateGradientPreview = (
  stops: GradientStop[],
  width: number = 80,
  height: number = 30
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create checkerboard background (to show alpha)
  const checkSize = 4;
  for (let y = 0; y < height; y += checkSize) {
    for (let x = 0; x < width; x += checkSize) {
      if ((x / checkSize + y / checkSize) % 2 === 0) {
        ctx.fillStyle = '#ccc';
      } else {
        ctx.fillStyle = '#999';
      }
      ctx.fillRect(x, y, checkSize, checkSize);
    }
  }

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  // Sort stops and add to gradient
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  sortedStops.forEach((stop) => {
    gradient.addColorStop(
      stop.position,
      `rgba(${stop.color.r}, ${stop.color.g}, ${stop.color.b}, ${stop.color.a / 255})`
    );
  });

  // Draw gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw border
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  return canvas.toDataURL();
};

/**
 * Creates a preset button element
 */
const createPresetButton = (preset: GradientPreset, isCustom: boolean = false): HTMLElement => {
  const buttonWrapper = document.createElement('div');
  buttonWrapper.style.cssText = 'position: relative;';

  const button = document.createElement('button');
  button.className = 'gradient-preset-button';
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
  previewImg.src = generateGradientPreview(preset.stops, 60, 20);
  previewImg.style.cssText = `
    width: 60px;
    height: 20px;
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
    setGradientStops(preset.stops);
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
    deleteBtn.className = 'gradient-preset-delete';
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

  return buttonWrapper;
};

/**
 * Creates preset gradient buttons
 */
const createPresetButtons = (): void => {
  const presetContainer = document.querySelector('.gradient-editor-presets');
  if (!presetContainer) return;

  presetContainer.innerHTML = '';

  // Load custom presets
  const customPresets = loadCustomPresets();

  // Add save current button
  const saveButton = document.createElement('button');
  saveButton.className = 'gradient-preset-button gradient-save-button';
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
    min-height: 56px;
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
    const button = createPresetButton(preset, true);
    presetContainer.appendChild(button);
  });

  // Add default presets
  defaultGradients.forEach((preset) => {
    const button = createPresetButton(preset, false);
    presetContainer.appendChild(button);
  });
};
