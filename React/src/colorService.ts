import axios from 'axios';

const apiEndpoint = 'https://www.thecolorapi.com/id?hex=';

export async function fetchColorData(hex: string): Promise<{ name: string; image: string } | null> {
  try {
    const response = await axios.get(`${apiEndpoint}${hex}`);
    return {
      name: response.data.name.value,
      image: response.data.image.bare,
    };
  } catch (error) {
    console.error(`Error fetching color for hex ${hex}:`, error);
    return null;
  }
}

export function getRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.random() * 0.4 + 0.2;
  const brightness = Math.random() * 0.3 + 0.7;
  return hsvToHex(hue, saturation, brightness);
}

function hsvToHex(h: number, s: number, v: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0: [r, g, b] = [v, t, p]; break;
    case 1: [r, g, b] = [q, v, p]; break;
    case 2: [r, g, b] = [p, v, t]; break;
    case 3: [r, g, b] = [p, q, v]; break;
    case 4: [r, g, b] = [t, p, v]; break;
    case 5: [r, g, b] = [v, p, q]; break;
    default: throw new Error('Unexpected case in HSV to RGB conversion');
  }

  function toHex(x: number): string {
    if (isNaN(x) || x < 0 || x > 1) {
      return '00';
    }
    return Math.round(x * 255).toString(16).padStart(2, '0');
  }
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}
