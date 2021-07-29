export interface AudioJsPluginOptions {
    onPlayEvent?: (event: string) => void;
}

export const defaultOptions: AudioJsPluginOptions = {
    
};

export let options = defaultOptions;

export function setOptions(userDefined: Partial<AudioJsPluginOptions>) {
    options = { ...defaultOptions, ...userDefined };
}