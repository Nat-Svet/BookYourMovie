import React, { useRef } from 'react';
import hintIcon from '../../assets/icons/hint.png';
import '../styles/Tooltip.css';

export default function Tooltip({ onDoubleTap }) {
  const lastTapRef = useRef(0); // Ref для хранения времени последнего касания (для определения двойного тапа)
  const lastZoomToggleRef = useRef(0); // Ref для предотвращения повторного срабатывания зума за короткий интервал

  // Безопасный вызов функции зума (onDoubleTap), не чаще одного раза в 500мс
  const toggleZoomOnce = () => {
    const now = Date.now();
    if (now - lastZoomToggleRef.current < 500) return; // если вызов был менее 500мс назад — игнорируем
    lastZoomToggleRef.current = now;
    onDoubleTap?.(); // вызываем callback, если он передан
  };

  // Отключенный код: Обработчик двойного клика мышью (нужно  для тестов на компе в devtools) (только если pointerType !== 'touch')
  //const handleDoubleClick = (e) => {
    //if (e.pointerType === 'touch') return; // защита от срабатывания на тач
    //e.stopPropagation();
    //console.log("🖱️ DOUBLE CLICK DETECTED");
   // toggleZoomOnce();
  //};

  // Обработчик двойного тапа через pointer события
  const handlePointerDown = (e) => {
    if (e.pointerType !== 'touch') return; // Обрабатываем только касания (touch), игнорируем мышь и стилус
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapRef.current;

    if (tapLength < 300 && tapLength > 0) {
      // Если интервал между касаниями меньше 300мс — считаем двойным тапом
      console.log("👆 DOUBLE TAP DETECTED via pointer");
      toggleZoomOnce();
    }

    lastTapRef.current = currentTime;
  };

  return (
    <div
      className="tooltip-container"
      //onDoubleClick={handleDoubleClick} (нужно  для тестов на компе в devtools)
      onPointerDown={handlePointerDown}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={hintIcon}
        alt="Двойное касание или клик"
        className="tooltip-icon"
      />
      <div className="tooltip-text">
        Кликните/тапните<br />дважды,<br />чтобы<br />увеличить
      </div>
    </div>
  );
}


// Вернуть поддержку мыши: раскомментировать handleDoubleClick и строку onDoubleClick={...}. //