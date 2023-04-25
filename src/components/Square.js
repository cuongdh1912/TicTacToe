import '../assets/styles/Square.css';
import {getPlayerName} from "../utilities/Utilities"

// generate ui for a square
export default function Square({value, buttonSquareClick, indexRow, index}) {
    let char = value == 0 ? "" : getPlayerName(value)
    return (
        <button className='ButtonStyle' onClick={() => buttonSquareClick(indexRow, index)}>{char}</button>
    )
}
