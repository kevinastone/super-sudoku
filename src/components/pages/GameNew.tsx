import * as React from "react";
import LazyLoad from "react-lazyload";
import {navigate} from "@reach/router";
import SUDOKUS from "src/assets/sudokus-new";
import {connect} from "react-redux";
import {RootState} from "src/ducks";
import {DIFFICULTY} from "src/engine/utility";
import {Container} from "../modules/Layout";
import styled from "styled-components";
import SmallSudokuComponent from "../modules/Sudoku/SudokuSmall";
import {setDifficulty} from "src/ducks/game/choose";
import {newGame} from "src/ducks/game";
import {setSudoku} from "src/ducks/sudoku";

const TabBar = styled.div`
  width: 100%;
  background: red;
  display: flex;
  background: #ddd;
  border: 1px solid #ccc;
  border-bottom: none;
  color: white;
`;

const TabItem = styled.div<{
  active: boolean;
}>`
  padding: 10px 10px;
  background: ${p => (p.active ? "black" : "transparent")};
  color: ${p => (p.active ? "white" : "black")};
  cursor: pointer;
  text-transform: capitalize;
`;

const Grid = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header"
    "main";
`;

const MainArea = styled.div`
  grid-area: main;
  padding-top: 30px;
  background: black;
  position: relative;
`;

const SudokusContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 -10px;
`;

const SudokuContainer = styled.div`
  padding: 10px;
`;

const Header = styled.div`
  grid-area: header;
`;

const SudokuSmallPlaceholder: React.StatelessComponent<{size: number}> = ({size}) => (
  <SudokuContainer>
    <div style={{height: size, width: size, background: "grey"}} />
  </SudokuContainer>
);

class GameIndex extends React.Component<{
  difficulty: DIFFICULTY;
  chooseSudoku: (sudoku, solution) => void;
}> {
  constructor(props) {
    super(props);
  }
  render() {
    let {difficulty, chooseSudoku} = this.props;
    const sudokus = SUDOKUS[difficulty];

    const size = 170;

    return (
      <SudokusContainer>
        {sudokus.map(sudoku => {
          return (
            <LazyLoad height={size} key={sudoku.id} placeholder={<SudokuSmallPlaceholder size={size} />}>
              <SudokuContainer>
                <SmallSudokuComponent
                  onClick={() => chooseSudoku(sudoku.sudoku, sudoku.solution)}
                  size={size}
                  id={sudoku.id + 1}
                  sudoku={sudoku.sudoku}
                  darken
                />
              </SudokuContainer>
            </LazyLoad>
          );
        })}
      </SudokusContainer>
    );
  }
}

interface GameNewProps {
  difficulty: DIFFICULTY;
}

interface GameNewDispatchProps {
  setDifficulty: typeof setDifficulty;
  setSudoku: typeof setSudoku;
  newGame: typeof newGame;
}

const GameNew: React.StatelessComponent<GameNewProps & GameNewDispatchProps> = ({
  difficulty,
  setDifficulty,
  newGame,
  setSudoku,
}) => {
  const chooseSudoku = (sudoku, solution) => {
    newGame();
    setSudoku(difficulty, sudoku, solution);
    navigate("/");
  };

  return (
    <Grid>
      <Header>
        <Container>
          <h1>New Game</h1>
          <TabBar>
            {[DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD, DIFFICULTY.EVIL].map(d => {
              return (
                <TabItem key={d} active={d === difficulty} onClick={() => setDifficulty(d)}>
                  {d}
                </TabItem>
              );
            })}
          </TabBar>
        </Container>
      </Header>
      <MainArea>
        <Container>
          <GameIndex difficulty={difficulty} chooseSudoku={chooseSudoku} />
        </Container>
      </MainArea>
    </Grid>
  );
};

const GameNewConnected = connect<GameNewProps, GameNewDispatchProps>(
  (state: RootState) => {
    return {
      difficulty: state.choose.difficulty,
    };
  },
  {
    setDifficulty,
    newGame,
    setSudoku,
  },
)(GameNew);

export default GameNewConnected;
