import * as React from "react";
import { OptionTypeBase } from 'react-select';

type MessageType = { type: string }

const App = () => {
  const [token, setToken] = React.useState('');
  const [data, setData] = React.useState({});
  const [repositories, setRepositories] = React.useState<{ value: string, label: string }[]>([]);
  const [targetRepo, setTargetRepo] = React.useState<OptionTypeBase>();

  const [tabName, setTabName] = React.useState('');

  // バックグラウンドにサインイン状態を問い合わせる
  // 一度サインイン後はポップアップを閉じてもバックグラウンドからサインイン状態を復帰できる
  React.useEffect(() => {

    var textContents = (chrome.extension.getBackgroundPage() as any);
    console.log(textContents)

  }, [])

  React.useEffect(() => {
    if (token !== '') {
      fetch('https://api.github.com/user', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          "Authorization": "token " + token,
        }
      })
        .then(response => response.json()) //Converting the response to a JSON object
        .then(data => {
          setData(data)
          console.log(token)
          console.log(data)
          fetch('https://api.github.com/user/repos', {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              "Authorization": "token " + token,
            },
            method: 'GET'
          })
            .then(response => response.json()) //Converting the response to a JSON object
            .then(repos => {
              setRepositories(repos.map((repo: any) => { return { value: repo.full_name, label: repo.full_name } }))
            })
        })
        .catch(error => console.error(error));
    }

  }, [token])

  return (
    <div style={{ width: 300, padding: '1rem' }}>
      <h3>{tabName}</h3>
      <div>
      </div>
    </div>
  );
};

export default App;