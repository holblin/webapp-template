import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Header } from "../Header/Header";
import { Navigation } from "../Navigation/Navigation";
import type { PropsWithChildren } from 'react';
import { ActionButton, Button, ButtonGroup, Content, Dialog, DialogContainer, Heading, Tooltip, TooltipTrigger } from '@react-spectrum/s2';
import { useState } from 'react';
import { useIsSmallViewport } from 'src/components/Responsive/useIsSmallViewport';
import ChevronDoubleLeft from '@react-spectrum/s2/icons/ChevronDoubleLeft';
import ChevronDoubleRight from '@react-spectrum/s2/icons/ChevronDoubleRight';

export const Layout = ({ children }: PropsWithChildren) => {
  const isSmallViewport = useIsSmallViewport(900);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const sidebarClassName = isSidebarCollapsed
    ? style({
      width: 80, padding: 12, overflow: 'auto', height: 'full',
      borderWidth: 0, borderEndWidth: 2, borderColor: 'gray-300', borderStyle: 'solid',
      display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0,
    })
    : style({
      width: 220, padding: 12, overflow: 'auto', height: 'full',
      borderWidth: 0, borderEndWidth: 2, borderColor: 'gray-300', borderStyle: 'solid',
      display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0,
    });
  const sidebarNavigationClassName = style({
    flexGrow: 1,
    minHeight: 0,
    overflow: 'auto',
  });

  const isHeaderMenuVisible = isSmallViewport;

  return <div className={style({display: 'flex', height: 'screen', flexDirection: 'column', overflow: 'hidden'})}>
    <Header
      leadingAction={isHeaderMenuVisible ? (
        <ActionButton onPress={() => setIsMobileNavigationOpen(true)}>
          Menu
        </ActionButton>
      ) : null}
    />
    <div className={style({
      display: 'flex', flexGrow: 1, minHeight: 0,
      borderWidth: 0, borderTopWidth: 2, borderColor: 'gray-300', borderStyle: 'solid',
    })}>
      {!isSmallViewport ? (
        <div className={sidebarClassName}>
          <div className={sidebarNavigationClassName}>
            <Navigation compact={isSidebarCollapsed} />
          </div>
          <TooltipTrigger>
            <ActionButton
              onPress={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
              aria-label={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              {isSidebarCollapsed ? <ChevronDoubleRight /> : <ChevronDoubleLeft />}
            </ActionButton>
            <Tooltip>{isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}</Tooltip>
          </TooltipTrigger>
        </div>
      ) : null}
      <div className={style({flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'})}>
        {children}
      </div>
    </div>
    <DialogContainer onDismiss={() => setIsMobileNavigationOpen(false)}>
      {isSmallViewport && isMobileNavigationOpen ? (
        <Dialog>
          {({ close }) => (
            <>
              <Heading slot="title">Navigation</Heading>
              <Content>
                <Navigation
                  onNavigate={() => {
                    close();
                    setIsMobileNavigationOpen(false);
                  }}
                />
              </Content>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  onPress={() => {
                    close();
                    setIsMobileNavigationOpen(false);
                  }}
                >
                  Close
                </Button>
              </ButtonGroup>
            </>
          )}
        </Dialog>
      ) : null}
    </DialogContainer>
  </div>
}
