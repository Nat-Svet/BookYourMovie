import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import '../styles/OpenSale.css';

const OpenSale = ({ halls }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedHall, setSelectedHall] = useState('');

    const toggleOpen = () => setIsOpen(!isOpen);

    // При изменении halls устанавливаем первый зал как выбранный, если он не выбран
    useEffect(() => {
        if (halls.length && !halls.find(h => h.name === selectedHall)) {
            setSelectedHall(halls[0].name);
        }
    }, [halls, selectedHall]);

    return (
        <section className="open-sale">
            <AccordionHeader
                title="ОТКРЫТЬ ПРОДАЖИ"
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />

            <div className="vertical-line-container">
                <div className="vertical-line top-part"></div>
            </div>

            {isOpen && (
                <div className="open-sale-content">
                    <div className="open-sale-select">
                        <span className="open-sale-select-label">Выберите зал для открытия/закрытия продаж:</span>
                        <div className="open-sale-select-buttons">
                            {halls.map(hall => (
                                <button
                                    key={hall.id}
                                    className={`open-sale-select-btn ${selectedHall === hall.name ? 'active' : ''}`}
                                    onClick={() => setSelectedHall(hall.name)}
                                >
                                    {hall.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sale-is-open">
                        <p className="open-sale-instruction">Всё готово к открытию</p>
                    </div>

                    <div className="button-container">
                        <button className="open-sale-final-button">ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default OpenSale;
