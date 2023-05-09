let items = ["Oranges", "Minced Meat", "Milk", "Kiwis"];

function getItems() {
  return items;
}

function addItem(item: string) {
  items.push(item);
}

function removeItem(itemToDelete: string) {
  items = items.filter((item) => item !== itemToDelete);
}

const db = {
  getItems,
  addItem,
  removeItem,
};

export default db;
