export const ASSETS = {

    logo: '/src/assets/images/wanderWay_logo.png',
} as const;


export type AssetKey = keyof typeof ASSETS;