// Nested category hierarchy: Category > Subcategory > Target Area
export const SUBCATEGORY_TREE: Record<string, Record<string, string[]>> = {
  Strength: {
    Land: ["Chest", "Back", "Shoulder", "Arms", "Legs", "Abdominal", "Multipurpose"],
  },
};

export function getSubcategories(category: string): string[] {
  return Object.keys(SUBCATEGORY_TREE[category] ?? {});
}

export function getTargetAreas(category: string, subcategory: string): string[] {
  return SUBCATEGORY_TREE[category]?.[subcategory] ?? [];
}
