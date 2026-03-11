import {  AssetCard, Footer, LinkButton } from '@react-spectrum/s2'
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import {CardView, CardPreview, Image, Content, Text} from '@react-spectrum/s2';
import { useTheme } from 'src/providers/Theme'

import reactLogo from './icons/react.svg'
import viteLogo from './icons/vite.svg'
import codegenLogo from './icons/graphql-codegen.svg'

import apolloLogoDark from './icons/apollo_dark.svg'
import apolloLogoLight from './icons/apollo_light.svg'
import reactSpectrumLogoDark from './icons/react-spectrum_dark.svg'
import reactSpectrumLogoLight from './icons/react-spectrum_light.svg'
import transtackRouterLogoDark from './icons/tanstack-router_dark.svg'
import transtackRouterLogoLight from './icons/tanstack-router_light.svg'

type TechnologyData = {icon: string | {dark: string, light: string}, name: string, description: string, url: string}

export const AboutCard = ({icon, name, description, url}: TechnologyData) => {
  const {theme} = useTheme();
  let iconSrc :string;
  if (typeof icon === 'string') {
    iconSrc = icon
  } else {
    if (theme === 'dark') {
      iconSrc = icon.dark
    } else {
      iconSrc = icon.light
    }
  }
  return <AssetCard id={name}>
    <CardPreview>
      <Image src={iconSrc} />
    </CardPreview>
    <Content styles={style({textAlign: 'start'})}>
      <Text slot="title">{name}</Text>
      <Text slot="description">{description}</Text>
    </Content>
    <Footer styles={style({justifyContent: 'end'})}>
      <LinkButton href={url} target='_blank'>Visit webpage</LinkButton>
    </Footer>
  </AssetCard>
}

export const About = () => {
  const technologies: Array<TechnologyData> = [
    {
      name: 'Vite',
      description: 'Native-ESM powered web dev build tool',
      url: 'https://vite.dev/',
      icon: viteLogo
    },
    {
      name: 'React',
      description: 'React is a JavaScript library for building user interfaces.',
      url: 'https://react.dev/',
      icon: reactLogo
    },
    {
      name: 'TanStack Router',
      description: 'Type-safe router with file-based route support',
      url: 'https://tanstack.com/router/latest',
      icon: {
        dark: transtackRouterLogoDark,
        light: transtackRouterLogoLight
      }
    },
    {
      name: 'React Spectrum S2',
      description: 'Spectrum 2 UI components in React',
      url: 'https://react-spectrum.adobe.com/',
      icon: {
        dark: reactSpectrumLogoDark,
        light: reactSpectrumLogoLight
      }
    },
    {
      name: 'GraphQL Codegen',
      description: 'Effortlessly generate comprehensive code from GraphQL schemas and operations, streamlining development across your tech stack.',
      url: 'https://the-guild.dev/graphql/codegen',
      icon: codegenLogo
    },
    {
      name: 'Apollo server',
      description: '',
      url: 'https://www.apollographql.com/docs/apollo-server',
      icon: {
        dark: apolloLogoDark,
        light: apolloLogoLight
      }
    },
    {
      name: 'Apollo client',
      description: '',
      url: 'https://www.apollographql.com/docs/react',
      icon: {
        dark: apolloLogoDark,
        light: apolloLogoLight
      }
    },
  ];

  return <>
    <CardView
      aria-label="Nature photos"
      selectionMode="single"
      selectionStyle="highlight"
      items={technologies.map(item => ({...item, id: item.name}))}
      styles={style({width: 'full'})}
    >
      {(item) => <AboutCard {...item} key={item.name} />}
    </CardView>
  </>;
}
