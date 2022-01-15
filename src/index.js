import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}


  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square 
        value={this.props.squares[i]} 
        onClick={()=>this.props.onClick(i)}/>
        
    }


    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props){
      super(props);
      this.state={
        stepNumber:0,
        history:[
          {
            squares:Array(9).fill(null)
          }
        ],
        lastClickedIndexes:[],
        xIsNext:true
      }
    }

    jumpTo(step){
      this.setState({
        stepNumber:step,
        xIsNext:(step % 2) === 0,
      });
    }

    handleClick(i){
      console.log(i)
      const history= this.state.history.slice(0,this.state.stepNumber+1);
      const current = history[history.length-1];
      const squares= current.squares.slice();

      if(calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i]=this.state.xIsNext ? 'X':'O';
      if(this.state.lastClickedIndexes.length> this.state.stepNumber){
        this.state.lastClickedIndexes=this.state.lastClickedIndexes.slice(0,this.state.stepNumber);
      }
      this.setState(
        {
          history:history.concat([{
            squares:squares,
          }]),
          stepNumber:history.length,
          xIsNext:!this.state.xIsNext,
          lastClickedIndexes: [...this.state.lastClickedIndexes, i]
        });
    }


    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step,move)=>{
      let desc='Go to game start';
        if(move){
          const columnIndex = (this.state.lastClickedIndexes[move-1]) % 3;
          const rowIndex= Math.floor((this.state.lastClickedIndexes[move-1]) / 3);
          desc= 'Go to move #'+ move+"("+columnIndex+","+rowIndex+")";
        }
        return (
          <li key={move}>
            <button onClick={()=> this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        );
      });
      let status;
      if(winner)
        status="Winner: "+winner;
      else
        status = 'Next player: '+(this.setState.xIsNext ? 'X': 'O');
      

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  
  // ========================================
  
  ReactDOM.render(
    <Game/>,
    document.getElementById('root')
  );

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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


  