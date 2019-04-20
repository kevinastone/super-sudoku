import * as React from "react";

import {connect} from "react-redux";
import {setSudoku} from "src/ducks/sudoku";
import {continueGame, resetGame, newGame, setGameState, toggleShowHints, GameStateMachine} from "src/ducks/game";
import {DIFFICULTY} from "src/engine/utility";

import THEME from "src/theme";
import styled from "styled-components";
import {RootState} from "src/ducks";
import Checkbox from "src/components/modules/Checkbox";
import {changeSudoku, setDifficulty, previousSudoku, nextSudoku} from "src/ducks/game/choose";

export const GameMenuContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  z-index: 20;
  padding-top: 90px;
  border-radius: ${THEME.borderRadius}px;
  top: -${THEME.spacer.x3}px;
  bottom: -${THEME.spacer.x3}px;
  left: -${THEME.spacer.x3}px;
  right: -${THEME.spacer.x3}px;
  display: flex;
  justify-content: space-around;
`;

const GameMenuList = styled.ul`
  padding: 0;
  margin: 0;
`;

const GameMenuListItem = styled.li`
  color: white;
  background-color: ${THEME.colors.primary};
  list-style-type: none;
  margin: 0;
  margin-top: ${THEME.spacer.x2}px;
  padding: ${THEME.spacer.x2}px;
  border-radius: ${THEME.borderRadius}px;
  box-shadow: ${THEME.boxShadow};

  &:hover {
    cursor: pointer;
    background-color: $color__dark-blue;
  }
`;

const GameWonText = styled.div`
  color: black;
  font-size: 32px;
  padding-bottom: ${THEME.spacer.x3};
`;

const GameMenuRunning = ({continueGame, toggleShowHints, showHints}) => {
  return (
    <GameMenuContainer>
      <GameMenuList>
        <Checkbox id="hints" checked={showHints} onChange={toggleShowHints}>
          {"Show all hints"}
        </Checkbox>
        <GameMenuListItem onClick={continueGame} key="continue">
          {"Continue"}
        </GameMenuListItem>
      </GameMenuList>
    </GameMenuContainer>
  );
};

const WonGame = ({chooseGame}) => {
  return (
    <GameMenuContainer>
      <GameMenuList>
        <GameWonText>{"Congratulations, You won!"}</GameWonText>
        <GameMenuListItem onClick={chooseGame} key="reset-game">
          {"New Game"}
        </GameMenuListItem>
      </GameMenuList>
    </GameMenuContainer>
  );
};

interface GameMenuDispatchProps {
  continueGame: typeof continueGame;
  resetGame: typeof resetGame;
  newGame: typeof newGame;
  setSudoku: typeof setSudoku;
  changeSudoku: typeof changeSudoku;
  nextSudoku: typeof nextSudoku;
  previousSudoku: typeof previousSudoku;
  setGameState: typeof setGameState;
  setDifficulty: typeof setDifficulty;
  toggleShowHints: typeof toggleShowHints;
}

interface GameMenuStateProps {
  showHints: boolean;
  sudokuIndex: number;
  state: GameStateMachine;
  difficulty: DIFFICULTY;
}

const GameMenu = connect<GameMenuStateProps, GameMenuDispatchProps>(
  (state: RootState) => {
    return {
      sudokuIndex: state.choose.sudokuIndex,
      state: state.game.state,
      difficulty: state.choose.difficulty,
      showHints: state.game.showHints,
    };
  },
  {
    continueGame,
    resetGame,
    newGame,
    setSudoku,
    changeSudoku,
    nextSudoku,
    previousSudoku,
    setGameState,
    setDifficulty,
    toggleShowHints,
  },
)(
  class GameMenu extends React.Component<GameMenuStateProps & GameMenuDispatchProps> {
    constructor(props) {
      super(props);
      this.newGame = this.newGame.bind(this);
    }
    newGame(_, sudoku, solution) {
      this.props.setSudoku(this.props.difficulty, sudoku, solution);
      this.props.newGame();
      this.props.continueGame();
      this.props.setGameState(GameStateMachine.running);
    }
    render() {
      const {
        showHints,
        continueGame,
        toggleShowHints,
      } = this.props;

      const chooseGame = () => this.props.setGameState(GameStateMachine.chooseGame);

      switch (this.props.state) {
        case GameStateMachine.settings: {
          return (
            <GameMenuRunning continueGame={continueGame} toggleShowHints={toggleShowHints} showHints={showHints} />
          );
        }
        case GameStateMachine.wonGame: {
          return <WonGame chooseGame={chooseGame} />;
        }
        default:
          return null;
      }
    }
  },
);

export default GameMenu;
