import {useState, useCallback} from 'react';

export const useKeyboard = state => {
  const [items, setItems] = useState(state);

  /**
   * @author Juan de Dios
   * @description agrega el valor del número presionado al array de código de verificación
   * @param {string} value valor del botón presionado
   */
  const pressButtonKeyboard = value => {
    const withoutValueIndex = items.findIndex(item => !item.number);

    let itemsCopy = [...items];

    if (withoutValueIndex !== -1) {
      itemsCopy[withoutValueIndex].number = value;
    }

    setItems(itemsCopy);
  };

  /**
   * @author Juan de Dios
   * @date 2020-01-10 09:52:03
   * @description elimina un número del array de números
   */
  const deleteNumber = () => {
    let itemsCopy = [...items];

    if (itemsCopy[itemsCopy.length - 1].number) {
      itemsCopy[itemsCopy.length - 1].number = null;
    } else {
      const withoutValueIndex = itemsCopy.findIndex(item => !item.number);

      if (withoutValueIndex > 0) {
        itemsCopy[withoutValueIndex - 1].number = null;
      }
    }

    setItems(itemsCopy);
  };

  const cancelAction = () => {
    let itemsCopy = [...items];

    for (let i = 0; i < itemsCopy.length; i++) {
      itemsCopy[i].number = null;
      setItems(itemsCopy);
    }
  };

  return {
    pressButtonKeyboard: pressButtonKeyboard,
    deleteNumber: deleteNumber,
    cancelAction: cancelAction,
    items,
  };
};
