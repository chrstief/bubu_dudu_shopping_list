const MAX_ITEM_LENGTH = 80;
const MIN_ITEM_LENGTH = 1;
const CONTROL_CHARACTERS_REGEX = /[\u0000-\u001F\u007F]/;

export function normalizeItemInput(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isValidNormalizedItem(value: string): boolean {
  if (value.length < MIN_ITEM_LENGTH || value.length > MAX_ITEM_LENGTH) {
    return false;
  }

  if (CONTROL_CHARACTERS_REGEX.test(value)) {
    return false;
  }

  return true;
}
