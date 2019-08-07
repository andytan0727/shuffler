/**
 * Get global CSS custom property (variable) from :root (root element)
 *
 * @param propertyName Name of custom CSS property to get
 */
export const getRootCssVariable = (propertyName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(propertyName);

/**
 * Set global CSS custom property to :root (root element)
 *
 * @param propertyName Name of custom CSS property to set
 * @param propertyValue Value to set to the specified custom CSS property
 */
export const setRootCssVariable = (
  propertyName: string,
  propertyValue: string
) => {
  document.documentElement.style.setProperty(propertyName, propertyValue);
};
