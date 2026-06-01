/**
 * Валидация текстовых полей для защиты от символьного спама и пустых строк.
 * @param text Исходный текст для проверки
 * @param isOptional Если true, то пустая строка считается валидной (поле необязательно)
 */
export const validateInput = (text: string, isOptional = false): boolean => {
  const trimmed = text.trim();
  
  // Если поле необязательное и оно пустое — пропускаем
  if (isOptional && trimmed.length === 0) {
    return true;
  }
  
  // Обязательное поле не должно быть пустым
  if (trimmed.length === 0) {
    return false;
  }

  // Регулярка требует наличие хотя бы одного алфавитно-цифрового символа.
  // Это автоматически отсекает строки, состоящие целиком из знаков препинания и валют.
  return /[a-zA-Zа-яА-ЯёЁ0-9]/.test(trimmed);
};
