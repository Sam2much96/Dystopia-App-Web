declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader } from 'three';
    import { Object3D } from 'three';

    export class GLTFLoader extends Loader {
        constructor();
        load(
            url: string,
            onLoad: (gltf: GLTF) => void,
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
        parse(
            data: ArrayBuffer | string,
            path: string,
            onLoad: (gltf: GLTF) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }

    export interface GLTF {
        scene: Object3D;
        scenes: Object3D[];
        animations: any[];
        asset: any;
    }
}
