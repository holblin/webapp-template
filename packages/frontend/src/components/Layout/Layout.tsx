import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Header } from "../Header/Header";
import { Navigation } from "../Navigation/Navigation";
import type { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => {

  return <div className={style({display: 'flex', height: 'screen', flexDirection: 'column', overflow: 'hidden'})}>
    <Header />
    <div className={style({
      display: 'flex', flexGrow: 1, minHeight: 0,
      borderWidth: 0, borderTopWidth: 2, borderColor: 'gray-300', borderStyle: 'solid',
    })}>
      <div className={style({
        width: 200, padding: 16, overflow: 'auto', height: 'full',
        borderWidth: 0, borderEndWidth: 2, borderColor: 'gray-300', borderStyle: 'solid'
      })}>
        <Navigation />
      </div>
      <div className={style({flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'})}>
        {children}
      </div>
    </div>
  </div>
}
