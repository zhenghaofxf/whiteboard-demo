import { Plugin } from "white-web-sdk";
import { PluginContext, WhiteAudioPluginAttributes } from "./types";
import { WhiteAudioPlugin } from "./WhiteAudioPlugin";
import {AudioJsPluginOptions, setOptions} from './options'
/**
 * white-web-sdk audio plugin.
 * @example
 * const plugins = createPlugins({ "audio2": audioPlugin2 });
 * plugins.setPluginContext("audio2", {
 *     identity: identity === Identity.creator ? "host" : ""
 * });
 * let sdk = new WhiteWebSdk({ plugins });
 * let room = await sdk.joinRoom(...);
 * room.insertPlugin("audio2", {
 *     ...,
 *     attributes: { src: url, isNavigationDisable: false },
 * });
 */
export const audioPlugin2 = (options?: Partial<AudioJsPluginOptions>): Plugin => {
    options && setOptions(options);
    return {
        kind: "audio2",
        render: WhiteAudioPlugin,
        defaultAttributes: {
            src: "",
            hostTime: 0,
            currentTime: 0,
            paused: true,
            muted: false,
            volume: 1,
        },
        hitTest(plugin) {
            const memberState = (plugin as any).component.context.getMemberState();
            return !(memberState?.currentApplianceName === "eraser");
        },
    }
}

// export const videoJsPlugin = (options?: Partial<VideoJsPluginOptions>): Plugin => {
//     options && setOptions(options);

//     return {
//         kind: PluginId,
//         render: VideoJsPlugin,
//         defaultAttributes: {
//             src: "",
//             poster: "",
//             hostTime: 0,
//             currentTime: 0,
//             paused: true,
//             muted: false,
//             volume: 1,
//             close: true,
//         },
//     };
// };