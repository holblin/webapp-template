import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { useState } from 'react'
import './Homepage.css'
import { ActionButton, Checkbox, CheckboxGroup } from '@react-spectrum/s2'
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

export const HomePage = () => {
  const [count, setCount] = useState(0)
  return <>
    <div>
      <CheckboxGroup label="TODO" >
        <Checkbox>Configure Apollo Client</Checkbox>
      </CheckboxGroup>
    </div>
    <div>
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
    </div>
    <h1>Vite + React</h1>
    <div className={style({padding: 'text-to-visual', justifyItems: 'center'})}>
      <ActionButton onPress={() => setCount((count) => count + 1)}>
        count is {count}
      </ActionButton>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
    <p className={style({color: 'GrayText'})}>
      Click on the Vite and React logos to learn more
    </p>
  </>;
}
