import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.winner ? "square winner" : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        value={this.props.squares[i]}
        winner={winner}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let board = [];

    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        let number = j + i * 3;
        let winner;
        if (this.props.line && this.props.line.includes(number)) {
          winner = true;
        } else {
          winner = false;
        }
        children.push(this.renderSquare(number, winner));
      }
      board.push(<div className="board-row">{children}</div>)
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      historyDescending: true,
    };
  }

  toggleHistory() {
    this.setState({
      historyDescending: !this.state.historyDescending,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coordinates: getCoordinates(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' at (' + step.coordinates.x + ', ' + step.coordinates.y + ')':
        'Go to game start';
      if (step == current) {
        return (
          <strong><li key={move}>
            <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
          </li></strong>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (!this.state.historyDescending) {
      moves = moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else if (this.state.stepNumber >= 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let historyButton = this.state.historyDescending ? 'Sort Ascending' : 'Sort Descending';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            line={winner ? winner.line : null}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleHistory()}>{historyButton}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return {player: squares[a], line: [a, b, c]};
    }
  }
  return null;
}

function getCoordinates(i) {
  return {x: i % 3, y: Math.floor(i / 3)};
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
