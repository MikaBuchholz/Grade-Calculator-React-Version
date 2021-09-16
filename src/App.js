import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppsSharpIcon from "@material-ui/icons/AppsSharp";
import TextField from "@material-ui/core/TextField";
import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ClearIcon from "@material-ui/icons/Clear";
import Fab from "@material-ui/core/Fab";

function App() {
  const [grades, setGrades] = useState([]);
  const [text, setTextField] = useState("");
  const [status, setStatus] = useState("");
  const [color, setColor] = useState("black");
  const [checked, setChecked] = useState(false);
  const [gridColor, setGridColor] = useState([]);
  const [hiddenGrades, setHiddenGrades] = useState([]);
  const [pointAverage, setPointAverage] = useState(0);
  const [realGrades, setRealGrades] = useState([]);
  const [gradeAverage, setGradeAverage] = useState(0);

  const LKCOLOR = "coral";
  const BASICCOLOR = "#3f51b5";

  var gradeDict = {
    15: 1.0,
    14: 1.0,
    13: 1.3,
    12: 1.7,
    11: 2.0,
    10: 2.3,
    9: 2.7,
    8: 3.0,
    7: 3.3,
    6: 3.7,
    5: 4.0,
    4: 4.3,
    3: 4.6,
    2: 5.0,
    1: 5.3,
    0: 6.0,
  };

  useEffect(() => {
    calculateAverages();
  }, [grades, hiddenGrades, checked, gridColor, realGrades]);

  const add = (number, startValue) => {
    return number + startValue;
  };

  const clear = () => {
    setGrades([]);
    setHiddenGrades([]);
    setPointAverage();
    setChecked(false);
    setGridColor([]);
    setStatus("");
    setRealGrades([]);
    setGradeAverage();
  };

  const calculateAverages = () => {
    var summedUpPoints = hiddenGrades.reduce(add, 0);
    var summedUpGrades = realGrades.reduce(add, 0);

    var pointAverage = summedUpPoints / hiddenGrades.length;
    var gradeAverage = summedUpGrades / realGrades.length;

    if (!isNaN(pointAverage)) {
      setPointAverage(pointAverage.toFixed(2));
      setGradeAverage(gradeAverage.toFixed(1));
    } else {
      setPointAverage();
      setGradeAverage();
    }
  };

  const removeElement = (e) => {
    const elementGrade = parseInt(e.target.innerHTML);
    var spliceAmount = 0;
    var elementColor = window
      .getComputedStyle(e.target, null)
      .getPropertyValue("background-color");
    var searchedIndex = grades.indexOf(elementGrade);

    gridColor.splice(searchedIndex, 1);
    grades.splice(searchedIndex, 1);

    for (var index = 0; index < hiddenGrades.length; index++) {
      if (hiddenGrades[index] === elementGrade) {
        if (elementColor === "rgb(255, 127, 80)") {
          spliceAmount = 2;
          hiddenGrades.splice(index, spliceAmount);
          realGrades.splice(index, spliceAmount);
        }

        if (elementColor === "rgb(63, 81, 181)") {
          spliceAmount = 1;
          hiddenGrades.splice(index, spliceAmount);
          realGrades.splice(index, spliceAmount);
        }

        var extension = elementGrade > 1 ? (extension = "e") : (extension = "");
        var extension2 =
          elementGrade > 1 ? (extension2 = "n") : (extension2 = "");

        setStatus(
          `${elementGrade} Punkt${extension} wurde${extension2} entfernt`
        );

        break;
      }
    }

    setChecked(false);
    setHiddenGrades([...hiddenGrades]);
    setGrades([...grades]);
    setGridColor([...gridColor]);
  };

  const handleChangeCheck = (e) => {
    setChecked(e.target.checked);
  };

  const handleTextField = (e) => {
    e.preventDefault();
    setTextField(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.length > 0) {
      if (text < 0) {
        setStatus("Nicht weniger als 0 angeben!");
        setTextField("");
        setColor("firebrick");
      } else if (text > 15) {
        setStatus("Nicht mehr als 15 angeben!");
        setTextField("");
        setColor("firebrick");
      } else {
        if (checked) {
          setGridColor([...gridColor, LKCOLOR]);
          setHiddenGrades([...hiddenGrades, parseInt(text), parseInt(text)]);
          setRealGrades([
            ...realGrades,
            gradeDict[parseInt(text)],
            gradeDict[parseInt(text)],
          ]);
        }

        if (!checked) {
          setGridColor([...gridColor, BASICCOLOR]);
          setHiddenGrades([...hiddenGrades, parseInt(text)]);
          setRealGrades([...realGrades, gradeDict[parseInt(text)]]);
        }

        setGrades([...grades, parseInt(text)]);
        setColor("forestgreen");

        var extension =
          parseInt(text) > 1 ? (extension = "e") : (extension = "");

        setStatus(`${text} Punkt${extension} hinzugefügt!`);
        setTextField("");
        setChecked(false);
      }
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar style={{ background: BASICCOLOR }}>
          <AppsSharpIcon
            edge="start"
            color="inherit"
            aria-label="menu"
          ></AppsSharpIcon>
          <Typography variant="button">
            <p className="applyFont">Grade Calculator</p>
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="displayContainer">
        <div className="displayWrapper">
          <p className="displayStatus">Punkte Durchschnitt: {pointAverage}</p>
        </div>
        <div className="displayWrapper">
          <p className="displayStatus">Noten Durchschnitt: {gradeAverage}</p>
        </div>
      </div>
      <form className="inputForm" onSubmit={handleSubmit} autoComplete="off">
        <TextField
          id="filled-basic"
          label="Grade"
          variant="outlined"
          type="number"
          className="textField"
          value={text}
          onChange={handleTextField}
        />
        <FormControlLabel
          color="secondary"
          control={
            <Checkbox
              checked={checked}
              onChange={handleChangeCheck}
              name="checkedA"
            />
          }
          label={<p className="applyFont">LK</p>}
        />
      </form>
      <p className="displayStatus" style={{ color: color }}>
        {status}
      </p>

      <Grid container className="gridContainer">
        {grades.map((grade, index) => {
          return (
            <Grid
              item
              key={index}
              className="gridItem"
              style={{ backgroundColor: gridColor[index] }}
              onClick={removeElement}
            >
              {grade}
            </Grid>
          );
        })}
      </Grid>
      <div className="buttonDiv">
        <Fab
          color="primary"
          size="medium"
          variant="extended"
          className="clearButton"
          onClick={clear}
        >
          <ClearIcon />
          Clear
        </Fab>
      </div>
    </div>
  );
}

export default App;
