import { TextureId } from '../texture-config';
import { getTexture } from '../assets';
import { getTextureAddedDate } from '../texture-metadata';

type TextureSelectorOptions = {
  currentTextureId: string;
  onSelect: (id: string) => void;
};

let currentOptions: TextureSelectorOptions | null = null;
let isInitialized = false;
let searchFilter = '';

/**
 * Opens the texture selector modal
 */
export const openTextureSelectorModal = (options: TextureSelectorOptions): void => {
  const modal = document.querySelector('.texture-selector-modal') as HTMLElement;
  if (!modal) return;

  currentOptions = options;
  modal.style.display = 'block';

  if (!isInitialized) {
    setupModalControls();
    isInitialized = true;
  }

  renderTextureGrid();
};

/**
 * Sets up modal control buttons (close, drag)
 */
const setupModalControls = (): void => {
  const closeButton = document.querySelector('.texture-selector-modal__close');
  const modal = document.querySelector('.texture-selector-modal') as HTMLElement;
  const modalContent = document.querySelector('.texture-selector-modal__content') as HTMLElement;
  const searchInput = document.querySelector('.texture-selector-search-input') as HTMLInputElement;

  const closeModal = () => {
    if (modal) {
      modal.style.display = 'none';
      currentOptions = null;
      searchFilter = '';
      if (searchInput) searchInput.value = '';
    }
  };

  if (closeButton && !closeButton.hasAttribute('data-listener')) {
    closeButton.setAttribute('data-listener', 'true');
    closeButton.addEventListener('click', closeModal);
  }

  // Setup search input
  if (searchInput && !searchInput.hasAttribute('data-listener')) {
    searchInput.setAttribute('data-listener', 'true');
    searchInput.addEventListener('input', (e) => {
      searchFilter = (e.target as HTMLInputElement).value.toLowerCase();
      renderTextureGrid();
    });
  }

  // Draggable modal functionality
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
        target.classList.contains('texture-selector-modal__close') ||
        target.classList.contains('texture-selector-item') ||
        target.classList.contains('texture-selector-download') ||
        target.closest('.texture-selector-grid')
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
 * Downloads a texture image
 */
const downloadTexture = async (textureId: string, textureName: string): Promise<void> => {
  try {
    const texture = getTexture(textureId);
    if (!texture || !texture.url) return;

    const response = await fetch(texture.url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${textureName}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download texture:', error);
  }
};

/**
 * Renders the texture grid
 */
const renderTextureGrid = (): void => {
  const grid = document.querySelector('.texture-selector-grid');
  if (!grid) return;

  grid.innerHTML = '';

  // Get custom assets from localStorage
  const customAssetList =
    JSON.parse(localStorage.getItem('particle-system-editor/library') || '[]') || [];

  // Custom textures (newest first - reverse order)
  const customTextures = customAssetList
    .map(({ name }: { name: string }) => ({
      id: name,
      name: name,
      isCustom: true,
    }))
    .reverse();

  // Built-in textures sorted by date (newest first)
  const builtInTextures = [
    TextureId.POINT,
    TextureId.GRADIENT_POINT,
    TextureId.CIRCLE,
    TextureId.CLOUD,
    TextureId.FLAME,
    TextureId.FLARE,
    TextureId.STAR,
    TextureId.STAR_TOON,
    TextureId.PLUS,
    TextureId.PLUS_TOON,
    TextureId.MOON,
    TextureId.RAINDROP,
    TextureId.LEAF_TOON,
    TextureId.SNOWFLAKE,
    TextureId.SNOWFLAKE_DETAILED,
    TextureId.NUMBERS,
    TextureId.NUMBERS_TOON,
    TextureId.CONFETTI,
    TextureId.CONFETTI_TOON,
    TextureId.MAGIC_EXPLOSION,
    TextureId.FEATHER,
    TextureId.SKULL,
    TextureId.HEART,
    TextureId.ROCKS,
    TextureId.SQUARE,
    TextureId.LIGHT_STREAK,
    TextureId.RADIAL_BURST,
    TextureId.STARBURST,
    TextureId.SOFT_SMOKE,
    TextureId.VORTEX,
    TextureId.BUBBLES,
  ]
    .map((id) => ({
      id,
      name: id,
      isCustom: false,
      addedDate: getTextureAddedDate(id),
    }))
    .sort((a, b) => {
      // Sort by date descending (newest first)
      return b.addedDate.localeCompare(a.addedDate);
    });

  // Combine: custom textures first (newest first), then built-in (by date, newest first)
  const allTextures = [...customTextures, ...builtInTextures];

  allTextures.forEach(({ id, name }) => {
    // Apply search filter
    if (searchFilter && !name.toLowerCase().includes(searchFilter)) {
      return;
    }

    const texture = getTexture(id);
    if (!texture) return;

    const item = document.createElement('div');
    item.className = 'texture-selector-item';
    if (currentOptions && currentOptions.currentTextureId === id) {
      item.classList.add('texture-selector-item--selected');
    }

    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'texture-selector-preview';

    // Add transparent background
    const transparentBg = document.createElement('div');
    transparentBg.className = 'texture-selector-transparent-bg';
    previewContainer.appendChild(transparentBg);

    // Add texture image
    const img = document.createElement('img');
    img.src = texture.url;
    img.className = 'texture-selector-image';
    previewContainer.appendChild(img);

    // Add circle preview overlay
    const circlePreview = document.createElement('div');
    circlePreview.className = 'texture-selector-circle-preview';
    previewContainer.appendChild(circlePreview);

    item.appendChild(previewContainer);

    // Create bottom section with name and buttons
    const bottomSection = document.createElement('div');
    bottomSection.className = 'texture-selector-bottom';

    const nameLabel = document.createElement('div');
    nameLabel.className = 'texture-selector-name';
    nameLabel.textContent = name;
    nameLabel.title = name;
    bottomSection.appendChild(nameLabel);

    // Add download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'texture-selector-download';
    downloadBtn.innerHTML = '⬇';
    downloadBtn.title = 'Download texture';
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadTexture(id, name);
    });
    bottomSection.appendChild(downloadBtn);

    item.appendChild(bottomSection);

    // Add click handler to select texture
    item.addEventListener('click', () => {
      if (currentOptions) {
        currentOptions.currentTextureId = id;
        currentOptions.onSelect(id);
        // Re-render to update the selected state
        renderTextureGrid();
      }
    });

    grid.appendChild(item);
  });
};
