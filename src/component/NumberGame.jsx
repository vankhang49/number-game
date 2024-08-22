import "./NumberGame.scss";
import {useEffect, useState} from "react";

export function NumberGame() {
    const [numbers, setNumbers] = useState([]);
    const [clickedOrder, setClickedOrder] = useState([]);
    const [inputNumber, setInputNumber] = useState('');
    const [message, setMessage] = useState('');
    const [positions, setPositions] = useState([]);
    const [time, setTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [hiddenNumbers, setHiddenNumbers] = useState([]);
    const [correctNumbers, setCorrectNumbers] = useState([]); // Các số bấm đúng
    const [hasFailed, setHasFailed] = useState(false);

    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const generateRandomPositions = (count) => {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 90);
            const y = Math.floor(Math.random() * 90);
            positions.push({ x, y });
        }
        return positions;
    };

    const handleStartGame = () => {
        const number = parseInt(inputNumber);
        if (isNaN(number) || number <= 0 || number > 1000) {
            setMessage('Vui lòng nhập một số hợp lệ lớn hơn 0.');
            return;
        }

        const newNumbers = shuffleArray([...Array(number).keys()].map(i => i + 1));
        setNumbers(newNumbers);
        setClickedOrder([]);
        setMessage('');
        setPositions(generateRandomPositions(number));
        setTime(0);
        setHiddenNumbers([]);
        setCorrectNumbers([]);
        setHasFailed(false);

        if (timer) {
            clearInterval(timer);
        }

        const newTimer = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 100);
        setTimer(newTimer);
    };

    const handleClick = (number) => {
        const nextExpectedNumber = clickedOrder.length + 1;

        if (number === nextExpectedNumber) {
            setClickedOrder([...clickedOrder, number]);
            setCorrectNumbers((prevCorrect) => [...prevCorrect, number]);

            setTimeout(() => {
                setHiddenNumbers((prevHiddenNumbers) => [...prevHiddenNumbers, number]);
            }, 1000);

            if (number === numbers.length) {
                setMessage('ALL CLEARED');
                clearInterval(timer);
            }
        } else {
            setMessage('GAME OVER');
            setHasFailed(true);
            clearInterval(timer);
        }
    };

    return (
        <div className="container">
            <div className="container-wrapper">
                <div className="header">
                    <h1
                        className={message ?  message === 'ALL CLEARED' ? "success" : "fail"
                            : "normal"
                    }
                    >
                        {message ? message : "LET'S PLAY"}
                    </h1>
                    <div className="point-number">
                        <p>Points: </p>
                        <input type="number"
                               value={inputNumber}
                               onChange={(e) => setInputNumber(e.target.value)}
                        />
                    </div>
                    <div className="time-play">
                        <p>Time: </p>
                        <p>{(time / 10).toFixed(1)} s</p>
                    </div>
                    <button onClick={handleStartGame}>Restart</button>
                </div>

                <div className="game-area">
                    {numbers.map((number, index) => (
                        !hiddenNumbers.includes(number) && (
                        <button
                            key={index}
                            onClick={() => handleClick(number)}
                            className="number-button"
                            disabled={clickedOrder.includes(number) || message !== ''}
                            style={{
                                top: `${positions[index]?.y}%`,
                                left: `${positions[index]?.x}%`,
                                backgroundColor: hasFailed ? 'red' : correctNumbers.includes(number) ? '#5cea07' : '#ffcc00',
                                z-index: {number - index}
                            }}
                        >
                            {number}
                        </button>
                        )))}
                </div>
            </div>
        </div>
    )
}
