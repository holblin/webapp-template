import { style } from '@react-spectrum/s2/style' with { type: 'macro' }
import type { UmlAccent } from 'src/components/UmlGraph/UmlGraph.types';

type UmlAccentStyle = {
  fill: string;
  border: string;
  styleClass: string;
};

export const umlAccentPalette: Record<UmlAccent, UmlAccentStyle> = {
  gray: {
    fill: 'var(--spectrum-gray-200, lightgray)',
    border: 'var(--spectrum-gray-800, gray)',
    styleClass: style({ backgroundColor: 'gray-100', borderColor: 'gray-800' }),
  },
  red: {
    fill: 'var(--spectrum-red-200, mistyrose)',
    border: 'var(--spectrum-red-800, firebrick)',
    styleClass: style({ backgroundColor: 'red-100', borderColor: 'red-800' }),
  },
  orange: {
    fill: 'var(--spectrum-orange-200, bisque)',
    border: 'var(--spectrum-orange-800, darkorange)',
    styleClass: style({ backgroundColor: 'orange-100', borderColor: 'orange-800' }),
  },
  yellow: {
    fill: 'var(--spectrum-yellow-200, lightyellow)',
    border: 'var(--spectrum-yellow-800, goldenrod)',
    styleClass: style({ backgroundColor: 'yellow-100', borderColor: 'yellow-800' }),
  },
  chartreuse: {
    fill: 'var(--spectrum-chartreuse-200, greenyellow)',
    border: 'var(--spectrum-chartreuse-800, olivedrab)',
    styleClass: style({ backgroundColor: 'chartreuse-100', borderColor: 'chartreuse-800' }),
  },
  celery: {
    fill: 'var(--spectrum-celery-200, palegreen)',
    border: 'var(--spectrum-celery-800, seagreen)',
    styleClass: style({ backgroundColor: 'celery-100', borderColor: 'celery-800' }),
  },
  green: {
    fill: 'var(--spectrum-green-200, lightgreen)',
    border: 'var(--spectrum-green-800, forestgreen)',
    styleClass: style({ backgroundColor: 'green-100', borderColor: 'green-800' }),
  },
  indigo: {
    fill: 'var(--spectrum-indigo-200, lightsteelblue)',
    border: 'var(--spectrum-indigo-800, indigo)',
    styleClass: style({ backgroundColor: 'indigo-100', borderColor: 'indigo-800' }),
  },
  seafoam: {
    fill: 'var(--spectrum-seafoam-200, paleturquoise)',
    border: 'var(--spectrum-seafoam-800, teal)',
    styleClass: style({ backgroundColor: 'seafoam-100', borderColor: 'seafoam-800' }),
  },
  cyan: {
    fill: 'var(--spectrum-cyan-200, lightcyan)',
    border: 'var(--spectrum-cyan-800, darkcyan)',
    styleClass: style({ backgroundColor: 'cyan-100', borderColor: 'cyan-800' }),
  },
  blue: {
    fill: 'var(--spectrum-blue-200, lightblue)',
    border: 'var(--spectrum-blue-800, steelblue)',
    styleClass: style({ backgroundColor: 'blue-100', borderColor: 'blue-800' }),
  },
  purple: {
    fill: 'var(--spectrum-purple-200, thistle)',
    border: 'var(--spectrum-purple-800, rebeccapurple)',
    styleClass: style({ backgroundColor: 'purple-100', borderColor: 'purple-800' }),
  },
  fuchsia: {
    fill: 'var(--spectrum-fuchsia-200, plum)',
    border: 'var(--spectrum-fuchsia-800, darkmagenta)',
    styleClass: style({ backgroundColor: 'fuchsia-100', borderColor: 'fuchsia-800' }),
  },
  magenta: {
    fill: 'var(--spectrum-magenta-200, pink)',
    border: 'var(--spectrum-magenta-800, mediumvioletred)',
    styleClass: style({ backgroundColor: 'magenta-100', borderColor: 'magenta-800' }),
  },
};
