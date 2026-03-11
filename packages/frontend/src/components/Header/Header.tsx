import {Popover, DialogTrigger, ActionButton, Divider, LinkButton} from '@react-spectrum/s2';
import IconLight from "@react-spectrum/s2/icons/Contrast";
import IconDark from "@react-spectrum/s2/icons/Lighten";
import { style, iconStyle } from "@react-spectrum/s2/style" with { type: "macro" };
import { useTheme } from "src/providers/Theme";
import App from '@react-spectrum/s2/icons/App';
import {Avatar} from '@react-spectrum/s2';

export const Header = () => {
  const {theme, setTheme} = useTheme()
  return <div className={style({display: 'flex', justifyContent: 'space-between', padding: 12, gap: 8, height: 56})}>
    <div className={style({ display: 'flex', alignItems: 'center', gap: 8})}>
      <App styles={iconStyle({size: 'XL'})}/>
      Template App
    </div>
    <div className={style({ display: 'flex', alignItems: 'center', gap: 8})}>
      <DialogTrigger>
        <ActionButton aria-label="Profile" isQuiet>
          <Avatar
            src="https://i.imgur.com/xIe7Wlb.png"
            alt="Avatar" />
        </ActionButton>
        <Popover size="S" padding='none'>
          <div className={style({padding: 12, display: 'flex', flexDirection: 'column', gap: 8})}>
            <div className={style({display: 'flex', alignItems: 'center', gap: 12})}>
              <Avatar
                size={80}
                src="https://i.imgur.com/xIe7Wlb.png"
                alt="Avatar" />
              <div className={style({display: 'flex', flexDirection: 'column', gap: 4})}>
                <div className={style({fontWeight: 'bold' })}>Jean-Philippe Zolesio</div>
                <div className={style({color: 'GrayText'})}>holblin@gmail.com</div>
              </div>
            </div>
          </div>
          <Divider />
          <div className={style({padding: 12, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'end'})}>
            <LinkButton href='mailto:holblin@gmail.com' target='_blank'>Contact me</LinkButton>
          </div>
        </Popover>
      </DialogTrigger>
      <ActionButton onPress={() => {
        if (theme == 'dark') {
          setTheme('light')
        } else {
          setTheme('dark')
        }
      }} >
        {theme == 'light' ? <IconLight /> : <IconDark />}
      </ActionButton>
    </div>
  </div>
}
