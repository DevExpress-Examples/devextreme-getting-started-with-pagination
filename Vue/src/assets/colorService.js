import axios from 'axios';

const apiEndpoint = 'https://www.thecolorapi.com/id?hex=';

export const fetchColorData = async (hex) => {
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
};

export const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.random() * 0.4 + 0.2; // 20-60% saturation
    const brightness = Math.random() * 0.3 + 0.7; // 70-100% brightness
    return hsvToHex(hue, saturation, brightness);
};

const hsvToHex = (h, s, v) => {
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: [r, g, b] = [v, t, p]; break;
        case 1: [r, g, b] = [q, v, p]; break;
        case 2: [r, g, b] = [p, v, t]; break;
        case 3: [r, g, b] = [p, q, v]; break;
        case 4: [r, g, b] = [t, p, v]; break;
        case 5: [r, g, b] = [v, p, q]; break;
    }

    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};
