/**
 * функция сохраняет данные доски планирования в локальном хранилище браузера
 * @param  args массивы с объектами заметок
 */
function saveData(...args) {
  const data = JSON.stringify({ ...args });
  localStorage.setItem('planningBoard', data);
}

/**
 * функция загружает данные доски планирования из локального хранилища браузера
 * @returns сохранённые данные доски планирования
 */
function loadData() {
  let data;
  try {
    data = localStorage.getItem('planningBoard');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    throw new Error('No saved data');
  }
  return data;
}

export { saveData, loadData };
