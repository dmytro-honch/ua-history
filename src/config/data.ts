const basePath = import.meta.env.env.REACT_APP_BASE_PATH || '/';

export const getDataBaseUrl = (filename: string) => {
  return `${basePath}data/territories/${filename}`;
};

export const loadGeoJSON = async (filename: string) => {
  try {
    const url = getDataBaseUrl(filename);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
};

export const getI18nJson = async (filename: string) => {
  try {
    const url = `${basePath}data/i18n/${filename}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    throw error;
  }
};
