import React, {memo, useState} from "react";
import '../assets/styles/GameBoard.css'
import Square from "./Square";
import {getPlayerName} from "../utilities/Utilities";

const MaxPick = 3 // the maximum of pick for a winner
export const TableSize = 8 // the size of table

// components in memo
const NextPlayer = memo(({currentPlayer})=><p>Next Player {getPlayerName(currentPlayer)}</p>)
const Winner = memo(({winner})=> <p>Player {getPlayerName(winner)} win</p>)
const ResetButton = memo(({resetButtonClick}) => <button className='ResetStyle' onClick={resetButtonClick}>Reset</button>)

// generate initial pick
function generateInitialPick() {
    return new Array(TableSize).fill([]).map(() => new Array(TableSize).fill(0))
}
// check winner at [indexRow, indexColumn]
function win(pick, indexRow, indexColumn) {
    let value = pick[indexRow][indexColumn]
    if (indexRow < TableSize - MaxPick)
        for(let index = 0; index < MaxPick; ++index) {
            if (value != pick[indexRow + index][indexColumn]) break;
            if (index == MaxPick - 1) {
                return value
            }
        }
    if (indexColumn < TableSize - MaxPick)
        for(let index = 0; index < MaxPick; ++index) {
            if (value != pick[indexRow][indexColumn + index]) break;
            if (index == MaxPick - 1) return value
        }
    if (indexRow < TableSize - MaxPick && indexColumn < TableSize - MaxPick)
        for(let index = 0; index < MaxPick; ++index) {
            if (value != pick[indexRow + index][indexColumn + index]) break;
            if (index == MaxPick - 1) {
                return value
            }
        }
    if (indexRow < TableSize - MaxPick && indexColumn >= 4)
        for(let index = 0; index < MaxPick; ++index) {
            if (value != pick[indexRow + index][indexColumn - index]) break
            if (index == MaxPick - 1) {
                return value
            }
        }
    return 0;
}
// check winner
function checkWin(pick) {
    for (let i = 0; i < TableSize; ++i) {
        for (let j = 0; j < TableSize; ++j) {
            if (pick[i][j] > 0 && win(pick, i, j) > 0)
                return pick[i][j]
        }
    }
    return 0
}
// main ui
function GameBoard() {
    const [currentPlayer, setCurrentPlayer] = useState(1)
    const [pick, setPick] = useState(generateInitialPick())
    const [winner, setWinner] = useState(0)
    // generate row which include squares
    function generateRow(row, indexRow) {
        return row.map((item, index) => {
            return generateSquare(index, indexRow)
        })
    }
    // generate square
    function generateSquare(index, indexRow) {
        return <Square key={'square' + indexRow * TableSize + index} value = {pick[indexRow][index]}
                       buttonSquareClick = {buttonSquareClick} indexRow = {indexRow} index = {index} />
    }
    // when a square clicked
    function buttonSquareClick(indexRow, index) {
        if (winner > 0) return;
        if (pick[indexRow][index] == 0) {
            pick[indexRow][index] = currentPlayer;
            setPick((pick) => [...pick])
            setCurrentPlayer(currentPlayer == 1 ? 2 : 1)
            let w = checkWin(pick)
            if (w > 0) setWinner(w)
        }
    }
    // when the reset button is clicked
    function resetButtonClick() {
        setCurrentPlayer(1)
        setPick(generateInitialPick())
        setWinner(0)
    }
    // generate ui
    return (
        <>
            <div className='MainDivStyle'>
                {/*Current player*/}
                {winner == 0 && <NextPlayer currentPlayer={currentPlayer}/> }
                {winner > 0 && <Winner winner = {winner} /> }
                {/*reset button */}
                <ResetButton resetButtonClick = {resetButtonClick} />
            </div>
            {/*Board of game*/}
            { pick.map((row, indexRow) => {
                return  <div key = {'div' + indexRow} className='RowDivStyle'>{generateRow(row, indexRow)}</div>
                })
            }
        </>
    );
}

export default GameBoard;

