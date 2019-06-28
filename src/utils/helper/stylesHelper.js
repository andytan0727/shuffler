/**
 * Get global CSS custom property (variable) from :root (root element)
 *
 * @param {string} propertyName Name of custom CSS property to get
 */
export const getRootCssVariable = (propertyName) =>
  getComputedStyle(document.documentElement).getPropertyValue(propertyName);

/**
 * Set global CSS custom property to :root (root element)
 *
 * @param {string} propertyName Name of custom CSS property to set
 * @param {string} propertyValue Value to set to the specified custom CSS property
 */
export const setRootCssVariable = (propertyName, propertyValue) => {
  document.documentElement.style.setProperty(propertyName, propertyValue);
};
