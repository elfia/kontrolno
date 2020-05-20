import React from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';

function App() {
  const [name, setName] = React.useState('');
  const [classNumber, setClassNumber] = React.useState('');
  const [error, setError] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [downloadUrl, setDownloadUrl] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const submit = async () => {
    if (name.length < 2) {
      setError('Въведете двете имена');
      return;
    }
    if (classNumber.length < 1) {
      setError('Изберете клас');
      return;
    }
    if (number.length < 1) {
      setError('Въведете правилно номера в класа');
      return;
    }
    setIsLoading(true);
    setError('');
    const response = await fetch('/start?ime=' + name + '&nomer=' + number + '&klass=' + classNumber, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
    });
    if (response.status >= 400) {
      setError('Нещо се обърка, пробвай пак. Ако видиш това съобщение отново пиши на г-жата');
    } else {
      // const text = await response.blob();
      const text = await response.text();
      // openDownloadLink(text);
      window.location.href = text;
      setIsLoading(false);
      setDownloadUrl(text);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <TextField
            id="name"
            label="Въведете двете си имена"
            required
            variant="outlined"
            value={name}
            fullWidth
            error={error == 'Въведете двете имена' ? true : false}
            onInput={(e) => setName(e.target.value)}
          />
        </p>
        <p>
          <FormControl variant="outlined" error={error == 'Изберете клас' ? true : false}>
            <InputLabel id="demo-simple-select-filled-label">Изберете Клас</InputLabel>
            <Select
              autoWidth
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={classNumber}
              onChange={(e) => {
                setClassNumber(e.target.value);
              }}
              label="Изберете Клас"
            >
              <MenuItem value="9a">9a</MenuItem>
            </Select>
          </FormControl>
        </p>
        <p>
          <TextField
            id="schoolNumber"
            label="Въведете вашият номер в класа"
            required
            variant="outlined"
            fullWidth
            value={number}
            type="number"
            error={error == 'Въведете правилно номера в класа' ? true : false}
            onInput={(e) => setNumber(e.target.value)}
          />
        </p>
        <span id="dynamicContent" />
        {isLoading ? (
          <p>
            <LinearProgress />
          </p>
        ) : downloadUrl ? (
          <>
            <h2>Успех!</h2>
            <a
              // onClick={(e) => {
              //   e.preventDefault();
              //   openDownloadLink(downloadUrl);
              // }}
              href={downloadUrl}
            >
              Ако свалянето не започне автоматично цъкнете тук.
            </a>
          </>
        ) : (
          <>
            <p className="error">{error}</p>
            <Button variant="contained" color="primary" onClick={submit}>
              Започни
            </Button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
